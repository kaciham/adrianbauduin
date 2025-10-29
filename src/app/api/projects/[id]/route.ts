import { NextRequest, NextResponse } from 'next/server';
import { rmdir, unlink, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import connectToDatabase from '../../../../lib/mongodb';
import { Project } from '../../../../models/Project';
import { AuthMiddleware } from '../../../../utils/authMiddleware';
import { ServerImageUtils } from '../../../../utils/serverImageUtils';

// GET individual project
export async function GET(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const project = await Project.findById(id)
      .populate('createdBy', 'name email')
      .lean();

    if (!project) {
      return NextResponse.json({ 
        success: false, 
        error: 'Project not found' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      project: {
        id: (project as any)._id.toString(),
        title: (project as any).title,
        slug: (project as any).slug,
        description: (project as any).description,
        client: (project as any).client,
        clientLogo: (project as any).clientLogo,
        images: (project as any).images,
        tags: (project as any).tags,
        year: (project as any).year,
        materials: (project as any).materials,
        techniques: (project as any).techniques,
        technologies: (project as any).technologies,
        createdAt: (project as any).createdAt,
        updatedAt: (project as any).updatedAt,
        publishedAt: (project as any).publishedAt,
        createdBy: (project as any).createdBy
      }
    });

  } catch (error) {
    console.error('Error retrieving project:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to retrieve project' 
    }, { status: 500 });
  }
}

// PUT (update) individual project
export async function PUT(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Require authentication for updating projects
    const authResult = await AuthMiddleware.requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Return auth error
    }

    await connectToDatabase();

    // Find the project first
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ 
        success: false, 
        error: 'Project not found' 
      }, { status: 404 });
    }

    // Check content type to determine if this is a file upload or JSON update
    const contentType = request.headers.get('content-type');
    const isFormData = contentType?.includes('multipart/form-data');

    if (isFormData) {
      // Handle FormData with file uploads
      const data = await request.formData();
      
      // Extract text data
      const title = data.get('title') as string;
      const description = data.get('description') as string;
      const client = data.get('client') as string;
      const year = data.get('year') as string;
      const materials = data.get('materials') as string;
      const techniques = data.get('techniques') as string;
      const technologies = data.get('technologies') as string;
      const tags = data.get('tags') as string;

      // Extract file data
      const clientLogoFile = data.get('clientLogo') as File;
      const mainImageFile = data.get('mainImage') as File;
      const additionalImageFiles = data.getAll('additionalImages') as File[];

      // Extract removal flags
      const removeClientLogo = data.get('removeClientLogo') === 'true';
      const removeMainImage = data.get('removeMainImage') === 'true';
      const removeAdditionalImagesStr = data.get('removeAdditionalImages') as string;
      const removeAdditionalImages = removeAdditionalImagesStr ? JSON.parse(removeAdditionalImagesStr) : [];

      if (!title || !description) {
        return NextResponse.json({ 
          success: false, 
          error: 'Missing required fields: title and description are required' 
        }, { status: 400 });
      }

      // Create project folder name from title (sanitized)
      const projectFolderName = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '_') // Replace spaces with underscores
        .trim();

      // Create project directory if it doesn't exist
      const projectPath = path.join(process.cwd(), 'public', 'projects', projectFolderName);
      try {
        await mkdir(projectPath, { recursive: true });
      } catch (error) {
        console.log('Directory creation info:', error);
      }

      let updatedClientLogoPath = (project as any).clientLogo;
      let updatedImages = [...((project as any).images || [])];

      // Handle client logo changes
      if (removeClientLogo && (project as any).clientLogo) {
        try {
          const oldLogoPath = path.join(process.cwd(), 'public', (project as any).clientLogo);
          await unlink(oldLogoPath);
        } catch (error) {
          console.log('Could not delete old client logo:', error);
        }
        updatedClientLogoPath = '';
      }

      if (clientLogoFile && clientLogoFile instanceof File) {
        // Remove old client logo if exists
        if ((project as any).clientLogo) {
          try {
            const oldLogoPath = path.join(process.cwd(), 'public', (project as any).clientLogo);
            await unlink(oldLogoPath);
          } catch (error) {
            console.log('Could not delete old client logo:', error);
          }
        }

        const bytes = await clientLogoFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const timestamp = Date.now();
        const originalName = path.basename(clientLogoFile.name, path.extname(clientLogoFile.name));
        const fileName = `client_logo_${originalName}_${timestamp}`;
        const filePath = path.join(projectPath, fileName);

        try {
          // Convert and save as WebP
          const webpPath = await ServerImageUtils.processAndSaveImage(buffer, filePath, {
            quality: 90, // Higher quality for logos
            maxWidth: 800,
            maxHeight: 800
          });
          updatedClientLogoPath = webpPath.replace(process.cwd(), '').replace(/\\/g, '/').replace('/public', '');
        } catch (conversionError) {
          console.error('Client logo conversion failed:', conversionError);
          // Fallback: save original file
          const fallbackPath = path.join(projectPath, `${fileName}${path.extname(clientLogoFile.name)}`);
          await writeFile(fallbackPath, buffer);
          updatedClientLogoPath = fallbackPath.replace(process.cwd(), '').replace(/\\/g, '/').replace('/public', '');
        }
      }

      // Handle main image changes
      if (removeMainImage && updatedImages.length > 0) {
        try {
          const oldMainImagePath = path.join(process.cwd(), 'public', updatedImages[0]);
          await unlink(oldMainImagePath);
        } catch (error) {
          console.log('Could not delete old main image:', error);
        }
        updatedImages.shift(); // Remove first image (main image)
      }

      if (mainImageFile && mainImageFile instanceof File) {
        // Remove old main image if exists
        if (updatedImages.length > 0) {
          try {
            const oldMainImagePath = path.join(process.cwd(), 'public', updatedImages[0]);
            await unlink(oldMainImagePath);
          } catch (error) {
            console.log('Could not delete old main image:', error);
          }
          updatedImages.shift(); // Remove first image
        }

        const bytes = await mainImageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const timestamp = Date.now();
        const originalName = path.basename(mainImageFile.name, path.extname(mainImageFile.name));
        const fileName = `main_${originalName}_${timestamp}`;
        const filePath = path.join(projectPath, fileName);

        try {
          const webpPath = await ServerImageUtils.processAndSaveImage(buffer, filePath, {
            quality: 90, // Higher quality for main image
            maxWidth: 1920,
            maxHeight: 1080
          });
          const relativePath = webpPath.replace(process.cwd(), '').replace(/\\/g, '/').replace('/public', '');
          updatedImages.unshift(relativePath); // Add as first image (main image)
        } catch (conversionError) {
          console.error('Main image conversion failed:', conversionError);
          // Fallback: save original file
          const fallbackPath = path.join(projectPath, `${fileName}${path.extname(mainImageFile.name)}`);
          await writeFile(fallbackPath, buffer);
          const relativePath = fallbackPath.replace(process.cwd(), '').replace(/\\/g, '/').replace('/public', '');
          updatedImages.unshift(relativePath);
        }
      }

      // Handle additional image removals
      if (removeAdditionalImages.length > 0) {
        // Sort indices in descending order to avoid index shifting issues
        const sortedIndices = removeAdditionalImages.sort((a: number, b: number) => b - a);
        for (const index of sortedIndices) {
          // Adjust index for additional images (skip main image at index 0)
          const actualIndex = index + 1;
          if (actualIndex < updatedImages.length) {
            try {
              const imageToRemove = updatedImages[actualIndex];
              const oldImagePath = path.join(process.cwd(), 'public', imageToRemove);
              await unlink(oldImagePath);
            } catch (error) {
              console.log(`Could not delete additional image at index ${actualIndex}:`, error);
            }
            updatedImages.splice(actualIndex, 1);
          }
        }
      }

      // Handle additional image uploads
      if (additionalImageFiles.length > 0) {
        for (let i = 0; i < additionalImageFiles.length; i++) {
          const file = additionalImageFiles[i];
          if (file instanceof File) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const timestamp = Date.now();
            const originalName = path.basename(file.name, path.extname(file.name));
            const fileName = `additional_${i + 1}_${originalName}_${timestamp}`;
            const filePath = path.join(projectPath, fileName);

            try {
              const webpPath = await ServerImageUtils.processAndSaveImage(buffer, filePath, {
                quality: 85, // Good quality for additional images
                maxWidth: 1920,
                maxHeight: 1080
              });
              const relativePath = webpPath.replace(process.cwd(), '').replace(/\\/g, '/').replace('/public', '');
              updatedImages.push(relativePath);
            } catch (conversionError) {
              console.error(`Additional image ${i + 1} conversion failed:`, conversionError);
              // Fallback: save original file
              const fallbackPath = path.join(projectPath, `${fileName}${path.extname(file.name)}`);
              await writeFile(fallbackPath, buffer);
              const relativePath = fallbackPath.replace(process.cwd(), '').replace(/\\/g, '/').replace('/public', '');
              updatedImages.push(relativePath);
            }
          }
        }
      }

      // Parse tags
      const parsedTags = typeof tags === 'string' 
        ? tags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag)
        : Array.isArray(tags) ? tags : [];

      // Generate new slug if title changed
      let newSlug = (project as any).slug;
      if (title !== (project as any).title) {
        newSlug = title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .trim()
          .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

        // Check if slug already exists
        const existingProject = await Project.findOne({ slug: newSlug, _id: { $ne: id } });
        if (existingProject) {
          newSlug = `${newSlug}-${Date.now()}`;
        }
      }

      // Update project with file changes
      const updatedProject = await Project.findByIdAndUpdate(
        id,
        {
          title,
          slug: newSlug,
          description,
          client: client?.trim(),
          clientLogo: updatedClientLogoPath,
          images: updatedImages,
          year: year ? parseInt(year) : undefined,
          materials: materials?.trim(),
          techniques: techniques?.trim(),
          technologies: technologies?.trim(),
          tags: parsedTags,
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      ).populate('createdBy', 'name email');

      if (!updatedProject) {
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to update project' 
        }, { status: 500 });
      }

      console.log('✅ Project updated successfully with files:', title);

      return NextResponse.json({
        success: true,
        message: 'Project updated successfully',
        project: {
          id: updatedProject._id.toString(),
          title: updatedProject.title,
          slug: updatedProject.slug,
          description: updatedProject.description,
          client: updatedProject.client,
          clientLogo: updatedProject.clientLogo,
          images: updatedProject.images,
          tags: updatedProject.tags,
          year: updatedProject.year,
          materials: updatedProject.materials,
          techniques: updatedProject.techniques,
          technologies: updatedProject.technologies,
          createdAt: updatedProject.createdAt,
          updatedAt: updatedProject.updatedAt,
          createdBy: updatedProject.createdBy
        }
      });

    } else {
      // Handle JSON data (no file uploads)
      const body = await request.json();
      const {
        title,
        description,
        client,
        year,
        materials,
        techniques,
        technologies,
        tags
      } = body;

      if (!title || !description) {
        return NextResponse.json({ 
          success: false, 
          error: 'Missing required fields: title and description are required' 
        }, { status: 400 });
      }

      // Parse tags
      const parsedTags = typeof tags === 'string' 
        ? tags.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag)
        : Array.isArray(tags) ? tags : [];

      // Generate new slug if title changed
      let newSlug = (project as any).slug;
      if (title !== (project as any).title) {
        newSlug = title
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .trim()
          .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

        // Check if slug already exists
        const existingProject = await Project.findOne({ slug: newSlug, _id: { $ne: id } });
        if (existingProject) {
          newSlug = `${newSlug}-${Date.now()}`;
        }
      }

      // Update project without file changes
      const updatedProject = await Project.findByIdAndUpdate(
        id,
        {
          title,
          slug: newSlug,
          description,
          client: client?.trim(),
          year: year ? parseInt(year) : undefined,
          materials: materials?.trim(),
          techniques: techniques?.trim(),
          technologies: technologies?.trim(),
          tags: parsedTags,
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      ).populate('createdBy', 'name email');

      if (!updatedProject) {
        return NextResponse.json({ 
          success: false, 
          error: 'Failed to update project' 
        }, { status: 500 });
      }

      console.log('✅ Project updated successfully:', title);

      return NextResponse.json({
        success: true,
        message: 'Project updated successfully',
        project: {
          id: updatedProject._id.toString(),
          title: updatedProject.title,
          slug: updatedProject.slug,
          description: updatedProject.description,
          client: updatedProject.client,
          clientLogo: updatedProject.clientLogo,
          images: updatedProject.images,
          tags: updatedProject.tags,
          year: updatedProject.year,
          materials: updatedProject.materials,
          techniques: updatedProject.techniques,
          technologies: updatedProject.technologies,
          createdAt: updatedProject.createdAt,
          updatedAt: updatedProject.updatedAt,
          createdBy: updatedProject.createdBy
        }
      });
    }

  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update project' 
    }, { status: 500 });
  }
}

// DELETE individual project
export async function DELETE(
  request: NextRequest, 
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Require authentication for deleting projects
    const authResult = await AuthMiddleware.requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Return auth error
    }

    await connectToDatabase();

    // Find the project to get file paths before deletion
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ 
        success: false, 
        error: 'Project not found' 
      }, { status: 404 });
    }

    // Create project folder name from title for cleanup
    const projectFolderName = (project as any).title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .trim();

    const projectPath = path.join(process.cwd(), 'public', 'projects', projectFolderName);

    // Delete project from database first
    await Project.findByIdAndDelete(id);

    // Clean up files and folder
    try {
      // Try to delete the entire project folder
      await rmdir(projectPath, { recursive: true });
      console.log(`✅ Deleted project folder: ${projectFolderName}`);
    } catch (fileError) {
      console.log(`⚠️ Could not delete project folder ${projectFolderName}:`, fileError);
      
      // Fallback: try to delete individual files
      try {
        // Delete main images
        if ((project as any).images && (project as any).images.length > 0) {
          for (const imagePath of (project as any).images) {
            try {
              const fullPath = path.join(process.cwd(), 'public', imagePath);
              await unlink(fullPath);
            } catch (individualFileError) {
              console.log(`⚠️ Could not delete file ${imagePath}:`, individualFileError);
            }
          }
        }

        // Delete client logo
        if ((project as any).clientLogo) {
          try {
            const logoPath = path.join(process.cwd(), 'public', (project as any).clientLogo);
            await unlink(logoPath);
          } catch (logoError) {
            console.log(`⚠️ Could not delete client logo:`, logoError);
          }
        }
      } catch (cleanupError) {
        console.log(`⚠️ Error during file cleanup:`, cleanupError);
      }
    }

    console.log('✅ Project deleted successfully:', (project as any).title);

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete project' 
    }, { status: 500 });
  }
}