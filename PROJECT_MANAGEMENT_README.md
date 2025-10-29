# Project Management System with Image Upload

This system allows you to create posts/projects with multiple image uploads that are automatically organized in the `public/projects` folder.

## Features

- ✅ Create projects with multiple image uploads
- ✅ Automatic folder structure generation
- ✅ Image validation and optimization
- ✅ Project metadata management
- ✅ Gallery display with category filtering
- ✅ Admin interface for project creation

## API Endpoints

### POST `/api/projects`
Creates a new project with images.

**Form Data:**
- `title` (required): Project title
- `description` (required): Project description  
- `category` (required): Project category
- `files` (optional): Multiple image files

**Response:**
```json
{
  "success": true,
  "message": "Project created successfully",
  "project": {
    "folderName": "project_folder_name",
    "title": "Project Title",
    "description": "Project Description",
    "category": "Category",
    "date": "2025-01-01T00:00:00.000Z",
    "images": ["/projects/project_folder_name/image1.jpg"]
  }
}
```

### GET `/api/projects`
Retrieves all projects.

### POST `/api/upload`
Uploads a single file to a specific project folder.

**Form Data:**
- `file` (required): Image file
- `projectName` (required): Project folder name

## Usage Examples

### 1. Using the Admin Interface

Navigate to `/admin` to use the visual interface for creating projects:

```typescript
// The admin page includes the CreateProjectForm component
import CreateProjectForm from '../components/CreateProjectForm';
```

### 2. Using the API Directly

```javascript
// Create a new project with images
const formData = new FormData();
formData.append('title', 'My New Project');
formData.append('description', 'This is a description of my project');
formData.append('category', 'trophées');

// Add multiple files
const fileInput = document.getElementById('files');
for (let i = 0; i < fileInput.files.length; i++) {
  formData.append('files', fileInput.files[i]);
}

const response = await fetch('/api/projects', {
  method: 'POST',
  body: formData,
});

const result = await response.json();
```

### 3. Using the ProjectAPI Utility

```typescript
import { ProjectAPI } from '../utils/projectManager';

// Create project
const result = await ProjectAPI.createProject(formData);

// Get all projects
const projects = await ProjectAPI.getAllProjects();

// Upload single file
const uploadResult = await ProjectAPI.uploadFile(file, 'project-folder-name');
```

### 4. Displaying Projects

```typescript
import ProjectGallery from '../components/ProjectGallery';

// Use in any page
export default function ProjectsPage() {
  return <ProjectGallery />;
}
```

## File Structure

When you create a project, the system automatically creates this structure:

```
public/
  projects/
    project_folder_name/
      project.json          # Project metadata
      image1_timestamp.jpg  # Uploaded images
      image2_timestamp.jpg
      ...
```

### Project Metadata Format

Each project folder contains a `project.json` file:

```json
{
  "title": "Project Title",
  "description": "Project description",
  "category": "Category name",
  "date": "2025-01-01T00:00:00.000Z",
  "images": [
    "/projects/project_folder_name/image1.jpg",
    "/projects/project_folder_name/image2.jpg"
  ]
}
```

## Available Components

### CreateProjectForm
Form component for creating new projects with image uploads.

### ProjectGallery  
Gallery component that displays all projects with filtering by category.

## Utilities

### ProjectManager
Server-side utility for managing projects:
- `getAllProjects()`: Get all projects
- `getProjectByFolderName()`: Get specific project
- `getProjectsByCategory()`: Filter by category
- `searchProjects()`: Search projects

### ProjectAPI
Client-side API wrapper:
- `createProject()`: Create new project
- `getAllProjects()`: Fetch all projects
- `uploadFile()`: Upload single file

### ImageUtils
Image handling utilities:
- `isValidImageType()`: Validate file type
- `isValidImageSize()`: Validate file size
- `compressImage()`: Compress images
- `formatFileSize()`: Format size display

## Installation & Setup

1. The required dependencies are already installed in your project
2. Navigate to `/admin` to start creating projects
3. View projects at `/projects`

## Next Steps

You can extend this system by:
1. Adding authentication to protect the admin interface
2. Adding image optimization/resizing on upload
3. Adding project editing/deletion functionality
4. Adding search functionality to the gallery
5. Adding pagination for large project lists

## Environment Variables

No additional environment variables are needed for basic functionality. The system uses the existing Node.js file system APIs.