import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '../../../../../lib/mongodb';
import { Project } from '../../../../../models/Project';

interface Props {
  params: Promise<{ slug: string }>;
}

// GET specific project by slug
export async function GET(
  request: NextRequest,
  { params }: Props
) {
  try {
    const { slug } = await params;
    await connectToDatabase();

    const project = await Project.findOne({ 
      slug: slug
    });

    if (!project) {
      return NextResponse.json({ 
        success: false, 
        error: 'Project not found' 
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
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
        updatedAt: project.updatedAt,
        publishedAt: project.publishedAt
      }
    });

  } catch (error) {
    console.error('Error retrieving project by slug:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to retrieve project' 
    }, { status: 500 });
  }
}