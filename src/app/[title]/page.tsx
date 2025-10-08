import { Metadata } from 'next';
import { projects } from '@/contents/projects';
import { generateProjectMetadata } from './metadata';

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