import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { revalidateTag } from 'next/cache';
import path from 'path';
import connectToDatabase from '../../../lib/mongodb';
import { Project } from '../../../models/Project';
import { AuthMiddleware } from '../../../utils/authMiddleware';
import { ServerImageUtils } from '../../../utils/serverImageUtils';

type ProjectData = {
  title: string;
  description: string;
  category: string;
  date?: string;
  tags?: string[];
};

export async function POST(request: NextRequest) {
  try {
    // Require authentication for creating projects
    const authResult = await AuthMiddleware.requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Return auth error
    }

    await connectToDatabase();

    const data = await request.formData();
    
    // Extract project data
    const title = data.get('title') as string;
    const description = data.get('description') as string;
    const client = data.get('client') as string;
    const tagsString = data.get('tags') as string;
    
    // New fields
    const year = data.get('year') as string;
    const materials = data.get('materials') as string;
    const techniques = data.get('techniques') as string;
    const technologies = data.get('technologies') as string;
    const clientLogo = data.get('clientLogo') as File;

    if (!title || !description) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required fields: title and description are required' 
      }, { status: 400 });
    }

    // Check for main image (mandatory)
    const mainImageFile = data.get('mainImage') as File;
    if (!mainImageFile || !(mainImageFile instanceof File)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Main project image is required' 
      }, { status: 400 });
    }

    // Parse tags
    const tags = tagsString ? tagsString.split(',').map(tag => tag.trim().toLowerCase()) : [];

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .trim()
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

    // Create project folder name from title (sanitized)
    const projectFolderName = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .trim();

    // Create project directory
    const projectPath = path.join(process.cwd(), 'public', 'projects', projectFolderName);
    try {
      await mkdir(projectPath, { recursive: true });
    } catch (error) {
      console.log('Directory creation info:', error);
    }

    // Handle multiple file uploads with WebP conversion
    const uploadedFiles: string[] = [];
    let mainImagePath = '';
    let clientLogoPath = '';
    
    // Get main image and additional files
    const mainImage = data.get('mainImage') as File;
    const files = data.getAll('files') as File[];
    
    // Handle client logo upload first (optional)
    if (clientLogo && clientLogo instanceof File) {
      const bytes = await clientLogo.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const timestamp = Date.now();
      const originalName = path.basename(clientLogo.name, path.extname(clientLogo.name));
      const fileName = `client_logo_${originalName}_${timestamp}`;
      const filePath = path.join(projectPath, fileName);

      try {
        const webpPath = await ServerImageUtils.processAndSaveImage(buffer, filePath, {
          quality: 95, // Highest quality for client logos
          maxWidth: 800,
          maxHeight: 600
        });
        
        clientLogoPath = webpPath.replace(process.cwd(), '').replace(/\\/g, '/').replace('/public', '');
        console.log(`✅ Client logo converted and saved: ${fileName}.webp`);
      } catch (conversionError) {
        console.error(`❌ Failed to convert client logo:`, conversionError);
        const fallbackPath = path.join(projectPath, `${fileName}${path.extname(clientLogo.name)}`);
        await writeFile(fallbackPath, buffer);
        clientLogoPath = fallbackPath.replace(process.cwd(), '').replace(/\\/g, '/').replace('/public', '');
      }
    }
    
    // Handle main image first (mandatory)
    if (mainImage && mainImage instanceof File) {
      const bytes = await mainImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const timestamp = Date.now();
      const originalName = path.basename(mainImage.name, path.extname(mainImage.name));
      const fileName = `main_${originalName}_${timestamp}`;
      const filePath = path.join(projectPath, fileName);

      try {
        const webpPath = await ServerImageUtils.processAndSaveImage(buffer, filePath, {
          quality: 90, // Higher quality for main image
          maxWidth: 1920,
          maxHeight: 1080
        });
        
        mainImagePath = webpPath.replace(process.cwd(), '').replace(/\\/g, '/').replace('/public', '');
        console.log(`✅ Main image converted and saved: ${fileName}.webp`);
      } catch (conversionError) {
        console.error(`❌ Failed to convert main image:`, conversionError);
        const fallbackPath = path.join(projectPath, `${fileName}${path.extname(mainImage.name)}`);
        await writeFile(fallbackPath, buffer);
        mainImagePath = fallbackPath.replace(process.cwd(), '').replace(/\\/g, '/').replace('/public', '');
      }
      
      // Add main image to the beginning of uploaded files array
      uploadedFiles.push(mainImagePath);
    }
    
    // Handle additional project files
    if (files && files.length > 0) {
      for (const file of files) {
        if (file instanceof File) {
          const bytes = await file.arrayBuffer();
          const buffer = Buffer.from(bytes);

          // Generate unique filename (will be converted to .webp)
          const timestamp = Date.now();
          const originalName = path.basename(file.name, path.extname(file.name));
          const fileName = `${originalName}_${timestamp}`;
          const filePath = path.join(projectPath, fileName);

          try {
            // Convert and save as WebP using server-side processing
            const webpPath = await ServerImageUtils.processAndSaveImage(buffer, filePath, {
              quality: 85,
              maxWidth: 1920,
              maxHeight: 1080
            });
            
            // Store the relative path for the database
            const relativePath = webpPath.replace(process.cwd(), '').replace(/\\/g, '/').replace('/public', '');
            uploadedFiles.push(relativePath);
            
            console.log(`✅ Converted and saved: ${fileName}.webp`);
          } catch (conversionError) {
            console.error(`❌ Failed to convert ${file.name}:`, conversionError);
            // Fallback: save original file if conversion fails
            const fallbackPath = path.join(projectPath, `${fileName}${path.extname(file.name)}`);
            await writeFile(fallbackPath, buffer);
            const relativePath = fallbackPath.replace(process.cwd(), '').replace(/\\/g, '/').replace('/public', '');
            uploadedFiles.push(relativePath);
          }
        }
      }
    }

    // Create project in database
    const project = new Project({
      title,
      slug,
      description,
      client: client?.trim(),
      clientLogo: clientLogoPath,
      images: uploadedFiles,
      tags,
      year: year ? parseInt(year) : undefined,
      materials: materials?.trim(),
      techniques: techniques?.trim(),
      technologies: technologies?.trim(),
      createdBy: authResult.user.id
    });

    await project.save();

    console.log('✅ Project created successfully:', title);

    // Revalidate sitemap and project-related caches
    try {
      revalidateTag('projects-sitemap');
      console.log('✅ Sitemap cache revalidated');
    } catch (revalidateError) {
      console.warn('⚠️ Failed to revalidate cache:', revalidateError);
    }

    return NextResponse.json({
      success: true,
      message: 'Project created successfully',
      project: {
        id: project._id.toString(),
        title: project.title,
        slug: project.slug,
        description: project.description,
        client: project.client,
        clientLogo: project.clientLogo,
        images: project.images,
        tags: project.tags,
        year: project.year,
        materials: project.materials,
        techniques: project.techniques,
        technologies: project.technologies,
        createdAt: project.createdAt,
        folderName: projectFolderName
      }
    });

  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create project' 
    }, { status: 500 });
  }
}

// GET method to retrieve projects
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const url = new URL(request.url);
    const search = url.searchParams.get('search');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const page = parseInt(url.searchParams.get('page') || '1');

    // Build query
    const query: any = {};
    
    // Search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { client: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('createdBy', 'name email')
      .lean();

    // Get total count for pagination
    const total = await Project.countDocuments(query);

    return NextResponse.json({
      success: true,
      projects: projects.map((project: any) => ({
        id: project._id.toString(),
        title: project.title,
        slug: project.slug,
        description: project.description,
        client: project.client,
        clientLogo: project.clientLogo,
        images: project.images,
        tags: project.tags,
        year: project.year,
        materials: project.materials,
        techniques: project.techniques,
        technologies: project.technologies,
        createdAt: project.createdAt,
        updatedAt: project.updatedAt,
        publishedAt: project.publishedAt,
        createdBy: project.createdBy
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error retrieving projects:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to retrieve projects' 
    }, { status: 500 });
  }
}