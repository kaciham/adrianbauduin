import { Metadata } from 'next';
import { projects } from '@/contents/projects';
import { generateProjectMetadata } from './metadata';
import ProjectPageClient from './ProjectPageClient';

type Props = {
  params: Promise<{ title: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { title } = await params;
  return generateProjectMetadata(title);
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    title: project.slug,
  }));
}

export default async function ProjectPage({ params }: Props) {
  const { title } = await params;
  const project = projects.find((p) => p.slug === title);

  return <ProjectPageClient project={project} slug={title} />;
}