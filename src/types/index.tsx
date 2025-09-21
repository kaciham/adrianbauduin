export interface Projects {
    id: number;
    title: string;
    description: string;
    project: string;
    year?: number;
    materials?: string[];
    techniques?: string[];
    partenaires?: string[];
    technologies: string[];
    githubLink?: string;
    demoLink?: string;
    imageProject: string[] | string;
    imagePartner: string;
}

export interface Blogs {
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    slug: string;
}   

