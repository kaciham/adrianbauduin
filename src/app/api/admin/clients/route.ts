import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import connectToDatabase from '../../../../lib/mongodb';
import { Client } from '../../../../models/Client';
import { AuthMiddleware } from '../../../../utils/authMiddleware';
import { ServerImageUtils } from '../../../../utils/serverImageUtils';

// POST - Create new client
export async function POST(request: NextRequest) {
  try {
    // Require admin authentication for creating clients
    const authResult = await AuthMiddleware.requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult; // Return auth error
    }

    await connectToDatabase();

    const data = await request.formData();
    
    // Extract client data
    const name = data.get('name') as string;
    const website = data.get('website') as string;
    const description = data.get('description') as string;
    const contactEmail = data.get('contactEmail') as string;
    const contactPhone = data.get('contactPhone') as string;
    const address = data.get('address') as string;
    const logoFile = data.get('logo') as File;

    if (!name) {
      return NextResponse.json({ 
        success: false, 
        error: 'Client name is required' 
      }, { status: 400 });
    }

    // Check if client already exists
    const existingClient = await Client.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
    if (existingClient) {
      return NextResponse.json({ 
        success: false, 
        error: 'Client with this name already exists' 
      }, { status: 409 });
    }

    let logoPath = '';

    // Handle logo upload if provided
    if (logoFile && logoFile instanceof File) {
      const bytes = await logoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Create clients directory
      const clientsPath = path.join(process.cwd(), 'public', 'clients');
      try {
        await mkdir(clientsPath, { recursive: true });
      } catch (error) {
        console.log('Directory creation info:', error);
      }

      // Generate unique filename
      const timestamp = Date.now();
      const originalName = path.basename(logoFile.name, path.extname(logoFile.name));
      const fileName = `${originalName}_${timestamp}`;
      const filePath = path.join(clientsPath, fileName);

      try {
        // Convert and save as WebP
        const webpPath = await ServerImageUtils.processAndSaveImage(buffer, filePath, {
          quality: 90, // Higher quality for logos
          maxWidth: 800,
          maxHeight: 800
        });
        
        // Store relative path
        logoPath = webpPath.replace(process.cwd(), '').replace(/\\/g, '/').replace('/public', '');
      } catch (conversionError) {
        console.error('Logo conversion failed:', conversionError);
        // Fallback: save original file
        const fallbackPath = path.join(clientsPath, `${fileName}${path.extname(logoFile.name)}`);
        await writeFile(fallbackPath, buffer);
        logoPath = fallbackPath.replace(process.cwd(), '').replace(/\\/g, '/').replace('/public', '');
      }
    }

    // Create client in database
    const client = new Client({
      name: name.trim(),
      logo: logoPath,
      website: website?.trim(),
      description: description?.trim(),
      contactEmail: contactEmail?.trim(),
      contactPhone: contactPhone?.trim(),
      address: address?.trim()
    });

    await client.save();

    console.log('✅ Client created successfully:', name);

    return NextResponse.json({
      success: true,
      message: 'Client created successfully',
      client: {
        id: client._id.toString(),
        name: client.name,
        logo: client.logo,
        website: client.website,
        description: client.description,
        contactEmail: client.contactEmail,
        contactPhone: client.contactPhone,
        address: client.address,
        createdAt: client.createdAt
      }
    });

  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create client' 
    }, { status: 500 });
  }
}

// GET - Retrieve all clients
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const page = parseInt(url.searchParams.get('page') || '1');
    const search = url.searchParams.get('search');

    // Build query
    const query: any = {};
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const clients = await Client.find(query)
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Client.countDocuments(query);

    return NextResponse.json({
      success: true,
      clients: clients.map((client: any) => ({
        id: client._id.toString(),
        name: client.name,
        logo: client.logo,
        website: client.website,
        description: client.description,
        contactEmail: client.contactEmail,
        contactPhone: client.contactPhone,
        address: client.address,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error retrieving clients:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to retrieve clients' 
    }, { status: 500 });
  }
}