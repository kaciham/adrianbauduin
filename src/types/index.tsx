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

export interface Blogs {
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    slug: string;
}   

