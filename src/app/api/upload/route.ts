import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { AuthMiddleware } from '../../../utils/authMiddleware';
import { ServerImageUtils } from '../../../utils/serverImageUtils';

export async function POST(request: NextRequest) {
  try {
    // Require authentication for file uploads
    const authResult = await AuthMiddleware.requireAuth(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Return auth error
    }
    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;
    const projectName: string = data.get('projectName') as string;

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    if (!projectName) {
      return NextResponse.json({ success: false, error: 'Project name is required' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create project folder if it doesn't exist
    const projectPath = path.join(process.cwd(), 'public', 'projects', projectName);
    try {
      await mkdir(projectPath, { recursive: true });
    } catch (error) {
      // Folder might already exist, that's okay
      console.log('Directory might already exist:', error);
    }

    // Generate a unique filename (will be converted to .webp)
    const timestamp = Date.now();
    const originalName = path.basename(file.name, path.extname(file.name));
    const fileName = `${originalName}_${timestamp}`;
    const filePath = path.join(projectPath, fileName);

    try {
      // Convert and save as WebP
      const webpPath = await ServerImageUtils.processAndSaveImage(buffer, filePath, {
        quality: 85,
        maxWidth: 1920,
        maxHeight: 1080
      });
      
      // Get relative path for response
      const relativePath = webpPath.replace(process.cwd(), '').replace(/\\/g, '/').replace('/public', '');

      return NextResponse.json({ 
        success: true, 
        message: 'File uploaded and converted to WebP successfully',
        filePath: relativePath,
        originalName: file.name,
        convertedName: path.basename(webpPath),
        size: file.size
      });
    } catch (conversionError) {
      console.error('WebP conversion failed, saving original:', conversionError);
      
      // Fallback: save original file
      const fallbackPath = path.join(projectPath, `${fileName}${path.extname(file.name)}`);
      await writeFile(fallbackPath, buffer);
      const relativePath = fallbackPath.replace(process.cwd(), '').replace(/\\/g, '/').replace('/public', '');

      return NextResponse.json({ 
        success: true, 
        message: 'File uploaded successfully (WebP conversion failed, saved original)',
        filePath: relativePath,
        originalName: file.name,
        size: file.size
      });
    }

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ success: false, error: 'Failed to upload file' }, { status: 500 });
  }
}