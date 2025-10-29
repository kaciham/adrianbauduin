import { readdir, readFile } from 'fs/promises';
import path from 'path';

export interface Project {
  folderName: string;
  title: string;
  description: string;
  category: string;
  date: string;
  images: string[];
}

export class ProjectManager {
  private static projectsPath = path.join(process.cwd(), 'public', 'projects');

  /**
   * Get all projects from the projects directory
   * @returns Promise<Project[]>
   */
  static async getAllProjects(): Promise<Project[]> {
    try {
      const directories = await readdir(this.projectsPath, { withFileTypes: true });
      const projects: Project[] = [];

      for (const dirent of directories) {
        if (dirent.isDirectory()) {
          const project = await this.getProjectByFolderName(dirent.name);
          if (project) {
            projects.push(project);
          }
        }
      }

      // Sort by date (newest first)
      return projects.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } catch (error) {
      console.error('Error getting projects:', error);
      return [];
    }
  }

  /**
   * Get a specific project by folder name
   * @param folderName string
   * @returns Promise<Project | null>
   */
  static async getProjectByFolderName(folderName: string): Promise<Project | null> {
    try {
      const projectJsonPath = path.join(this.projectsPath, folderName, 'project.json');
      const projectData = await readFile(projectJsonPath, 'utf-8');
      const project = JSON.parse(projectData);
      
      return {
        folderName,
        ...project
      };
    } catch (error) {
      console.log(`No project.json found for ${folderName}`);
      return null;
    }
  }

  /**
   * Get projects by category
   * @param category string
   * @returns Promise<Project[]>
   */
  static async getProjectsByCategory(category: string): Promise<Project[]> {
    const allProjects = await this.getAllProjects();
    return allProjects.filter(project => 
      project.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Search projects by title or description
   * @param query string
   * @returns Promise<Project[]>
   */
  static async searchProjects(query: string): Promise<Project[]> {
    const allProjects = await this.getAllProjects();
    const searchTerm = query.toLowerCase();
    
    return allProjects.filter(project => 
      project.title.toLowerCase().includes(searchTerm) ||
      project.description.toLowerCase().includes(searchTerm)
    );
  }

  /**
   * Get the main image for a project (first image in the array)
   * @param project Project
   * @returns string | null
   */
  static getMainImage(project: Project): string | null {
    return project.images && project.images.length > 0 ? project.images[0] : null;
  }

  /**
   * Get all categories from existing projects
   * @returns Promise<string[]>
   */
  static async getAllCategories(): Promise<string[]> {
    const allProjects = await this.getAllProjects();
    const categories = [...new Set(allProjects.map(project => project.category))];
    return categories.sort();
  }
}

/**
 * Client-side API functions for interacting with the backend
 */
export class ProjectAPI {
  /**
   * Create a new project with images
   * @param projectData FormData
   * @returns Promise<{success: boolean, project?: any, error?: string}>
   */
  static async createProject(projectData: FormData) {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        body: projectData,
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: 'Network error occurred'
      };
    }
  }

  /**
   * Get all projects from the API
   * @returns Promise<{success: boolean, projects?: Project[], error?: string}>
   */
  static async getAllProjects() {
    try {
      const response = await fetch('/api/projects');
      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: 'Failed to fetch projects'
      };
    }
  }

  /**
   * Upload a single file to a project
   * @param file File
   * @param projectName string
   * @returns Promise<{success: boolean, filePath?: string, error?: string}>
   */
  static async uploadFile(file: File, projectName: string) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('projectName', projectName);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      return await response.json();
    } catch (error) {
      return {
        success: false,
        error: 'Failed to upload file'
      };
    }
  }
}