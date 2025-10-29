export interface Projects {
    title: string;
    slug: string;
    description: string;
    project: string;
    year?: number;
    materials?: string[];
    techniques?: string[];
    partenaires?: string[];
    technologies: string[];
    // optional commercial fields for structured data
    price?: number | string;
    priceCurrency?: string;
    githubLink?: string;
    demoLink?: string;
    imageProject: string[] | string;
    imagePartner: string;
}

// Database project interface
export interface DatabaseProject {
    id: string;
    title: string;
    slug: string;
    description: string;
    client?: string;
    clientLogo?: string;
    images: string[];
    tags: string[];
    year?: number;
    materials?: string;
    techniques?: string;
    technologies?: string;
    createdAt: string;
    updatedAt?: string;
    createdBy: any;
}

export interface Blogs {
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    slug: string;
}   

