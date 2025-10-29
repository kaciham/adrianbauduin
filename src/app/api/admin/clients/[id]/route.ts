import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import connectToDatabase from '../../../../../lib/mongodb';
import { Client } from '../../../../../models/Client';
import { AuthMiddleware } from '../../../../../utils/authMiddleware';
import { ServerImageUtils } from '../../../../../utils/serverImageUtils';

// GET - Retrieve specific client
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectToDatabase();

    const client = await Client.findById(id);

    if (!client) {
      return NextResponse.json({ 
        success: false, 
        error: 'Client not found' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      client: {
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
      }
    });

  } catch (error) {
    console.error('Error retrieving client:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to retrieve client' 
    }, { status: 500 });
  }
}

// PUT - Update client
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Require admin authentication
    const authResult = await AuthMiddleware.requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    await connectToDatabase();

    const data = await request.formData();
    
    // Extract updated client data
    const name = data.get('name') as string;
    const website = data.get('website') as string;
    const description = data.get('description') as string;
    const contactEmail = data.get('contactEmail') as string;
    const contactPhone = data.get('contactPhone') as string;
    const address = data.get('address') as string;
    const logoFile = data.get('logo') as File;
    const removeLogo = data.get('removeLogo') === 'true';

    // Find existing client
    const existingClient = await Client.findById(id);
    if (!existingClient) {
      return NextResponse.json({ 
        success: false, 
        error: 'Client not found' 
      }, { status: 404 });
    }

    // Check if another client with the same name exists (excluding current)
    if (name && name !== existingClient.name) {
      const duplicateClient = await Client.findOne({ 
        name: { $regex: new RegExp(`^${name}$`, 'i') },
        _id: { $ne: id }
      });
      
      if (duplicateClient) {
        return NextResponse.json({ 
          success: false, 
          error: 'Client with this name already exists' 
        }, { status: 409 });
      }
    }

    let logoPath = existingClient.logo;

    // Handle logo removal
    if (removeLogo && existingClient.logo) {
      try {
        const oldLogoPath = path.join(process.cwd(), 'public', existingClient.logo);
        await unlink(oldLogoPath);
      } catch (error) {
        console.log('Could not delete old logo file:', error);
      }
      logoPath = '';
    }

    // Handle new logo upload
    if (logoFile && logoFile instanceof File) {
      const bytes = await logoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Remove old logo if exists
      if (existingClient.logo) {
        try {
          const oldLogoPath = path.join(process.cwd(), 'public', existingClient.logo);
          await unlink(oldLogoPath);
        } catch (error) {
          console.log('Could not delete old logo file:', error);
        }
      }

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
          quality: 90,
          maxWidth: 800,
          maxHeight: 800
        });
        
        logoPath = webpPath.replace(process.cwd(), '').replace(/\\/g, '/').replace('/public', '');
      } catch (conversionError) {
        console.error('Logo conversion failed:', conversionError);
        // Fallback: save original file
        const fallbackPath = path.join(clientsPath, `${fileName}${path.extname(logoFile.name)}`);
        await writeFile(fallbackPath, buffer);
        logoPath = fallbackPath.replace(process.cwd(), '').replace(/\\/g, '/').replace('/public', '');
      }
    }

    // Update client
    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (website !== undefined) updateData.website = website?.trim();
    if (description !== undefined) updateData.description = description?.trim();
    if (contactEmail !== undefined) updateData.contactEmail = contactEmail?.trim();
    if (contactPhone !== undefined) updateData.contactPhone = contactPhone?.trim();
    if (address !== undefined) updateData.address = address?.trim();
    updateData.logo = logoPath;
    updateData.updatedAt = new Date();

    const updatedClient = await Client.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    console.log('✅ Client updated successfully:', updatedClient.name);

    return NextResponse.json({
      success: true,
      message: 'Client updated successfully',
      client: {
        id: updatedClient._id.toString(),
        name: updatedClient.name,
        logo: updatedClient.logo,
        website: updatedClient.website,
        description: updatedClient.description,
        contactEmail: updatedClient.contactEmail,
        contactPhone: updatedClient.contactPhone,
        address: updatedClient.address,
        createdAt: updatedClient.createdAt,
        updatedAt: updatedClient.updatedAt
      }
    });

  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update client' 
    }, { status: 500 });
  }
}

// DELETE - Delete client
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // Require admin authentication
    const authResult = await AuthMiddleware.requireAdmin(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }

    await connectToDatabase();

    const client = await Client.findById(id);
    if (!client) {
      return NextResponse.json({ 
        success: false, 
        error: 'Client not found' 
      }, { status: 404 });
    }

    // Delete logo file if exists
    if (client.logo) {
      try {
        const logoPath = path.join(process.cwd(), 'public', client.logo);
        await unlink(logoPath);
      } catch (error) {
        console.log('Could not delete logo file:', error);
      }
    }

    // Delete client from database
    await Client.findByIdAndDelete(id);

    console.log('✅ Client deleted successfully:', client.name);

    return NextResponse.json({
      success: true,
      message: 'Client deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete client' 
    }, { status: 500 });
  }
}