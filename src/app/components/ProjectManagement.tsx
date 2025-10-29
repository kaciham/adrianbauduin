'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ImageUtils } from '../../utils/imageUtils';

interface Project {
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

interface ProjectFormData {
  title: string;
  description: string;
  client: string;
  year: string;
  materials: string;
  techniques: string;
  technologies: string;
  tags: string;
  // Photo editing fields
  clientLogo: File | null;
  mainImage: File | null;
  additionalImages: FileList | null;
  removeClientLogo: boolean;
  removeMainImage: boolean;
  removeAdditionalImages: number[]; // Array of indices of images to remove
}

const initialFormData: ProjectFormData = {
  title: '',
  description: '',
  client: '',
  year: new Date().getFullYear().toString(),
  materials: '',
  techniques: '',
  technologies: '',
  tags: '',
  // Photo editing fields
  clientLogo: null,
  mainImage: null,
  additionalImages: null,
  removeClientLogo: false,
  removeMainImage: false,
  removeAdditionalImages: []
};

export default function ProjectManagement() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>(initialFormData);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  
  // Photo editing state variables
  const [converting, setConverting] = useState(false);
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<{
    clientLogo?: string;
    mainImage?: string;
    additionalImages: string[];
  }>({
    additionalImages: []
  });

  // Fetch projects
  const fetchProjects = async () => {
    setLoading(true);
    try {
      const searchQuery = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';
      const response = await fetch(`/api/projects?page=${pagination.page}&limit=${pagination.limit}${searchQuery}`);
      const data = await response.json();
      
      if (data.success) {
        setProjects(data.projects);
        setPagination(prev => ({
          ...prev,
          total: data.pagination.total,
          totalPages: data.pagination.totalPages
        }));
      } else {
        setMessage('Failed to load projects');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setMessage('Error loading projects');
    } finally {
      setLoading(false);
    }
  };

  // Load projects on component mount and when filters change
  useEffect(() => {
    fetchProjects();
  }, [searchTerm, pagination.page]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle photo file changes
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    
    if (files && files.length > 0) {
      const file = files[0];
      
      // Validate file type
      if (!ImageUtils.isValidImageType(file)) {
        setMessage('Invalid image type. Please select JPG, PNG, WebP, or GIF files.');
        return;
      }
      
      // Validate file size (5MB max)
      if (!ImageUtils.isValidImageSize(file, 5)) {
        setMessage('File size too large. Maximum size is 5MB.');
        return;
      }
      
      // Update form data
      if (name === 'clientLogo') {
        setFormData(prev => ({
          ...prev,
          clientLogo: file,
          removeClientLogo: false
        }));
        
        // Generate preview URL
        const previewUrl = ImageUtils.createPreviewUrl(file);
        setPhotoPreviewUrls(prev => ({
          ...prev,
          clientLogo: previewUrl
        }));
      } else if (name === 'mainImage') {
        setFormData(prev => ({
          ...prev,
          mainImage: file,
          removeMainImage: false
        }));
        
        // Generate preview URL
        const previewUrl = ImageUtils.createPreviewUrl(file);
        setPhotoPreviewUrls(prev => ({
          ...prev,
          mainImage: previewUrl
        }));
      }
    }
  };

  // Handle additional images change
  const handleAdditionalImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    
    if (files && files.length > 0) {
      // Validate maximum 10 additional images
      if (files.length > 10) {
        setMessage('Maximum 10 additional images allowed');
        e.target.value = ''; // Reset input
        return;
      }
      
      // Validate each file
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!ImageUtils.isValidImageType(file)) {
          setMessage(`Invalid image type: ${file.name}. Please select JPG, PNG, WebP, or GIF files.`);
          e.target.value = ''; // Reset input
          return;
        }
        if (!ImageUtils.isValidImageSize(file, 5)) {
          setMessage(`File size too large: ${file.name}. Maximum size is 5MB.`);
          e.target.value = ''; // Reset input
          return;
        }
      }
      
      // Update form data
      setFormData(prev => ({
        ...prev,
        additionalImages: files
      }));
      
      // Generate preview URLs
      const previewUrls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        previewUrls.push(ImageUtils.createPreviewUrl(files[i]));
      }
      
      setPhotoPreviewUrls(prev => ({
        ...prev,
        additionalImages: previewUrls
      }));
    }
  };

  // Remove existing image
  const handleRemoveExistingImage = (imageType: 'clientLogo' | 'mainImage') => {
    if (imageType === 'clientLogo') {
      setFormData(prev => ({
        ...prev,
        removeClientLogo: true,
        clientLogo: null
      }));
    } else if (imageType === 'mainImage') {
      setFormData(prev => ({
        ...prev,
        removeMainImage: true,
        mainImage: null
      }));
    }
  };

  // Clean up preview URLs
  const cleanupPreviewUrls = () => {
    if (photoPreviewUrls.clientLogo) {
      ImageUtils.revokePreviewUrl(photoPreviewUrls.clientLogo);
    }
    if (photoPreviewUrls.mainImage) {
      ImageUtils.revokePreviewUrl(photoPreviewUrls.mainImage);
    }
    photoPreviewUrls.additionalImages.forEach(url => {
      ImageUtils.revokePreviewUrl(url);
    });
    
    setPhotoPreviewUrls({
      additionalImages: []
    });
  };

  // Convert FileList to File array
  const fileListToArray = (fileList: FileList): File[] => {
    const files: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      files[i] = fileList[i];
    }
    return files;
  };

  // Handle form submission (edit only)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    // Validate required photos
    const hasClientLogo = editingProject.clientLogo && !formData.removeClientLogo || formData.clientLogo;
    const hasMainImage = editingProject.images && editingProject.images.length > 0 && !formData.removeMainImage || formData.mainImage;

    if (!hasClientLogo) {
      setMessage('Client logo is required. Please upload a client logo.');
      return;
    }

    if (!hasMainImage) {
      setMessage('Main image is required. Please upload a main project image.');
      return;
    }

    setSubmitting(true);
    setMessage('');

    try {
      // Check if any photos are being edited
      const hasPhotoChanges = formData.clientLogo || 
                             formData.mainImage || 
                             formData.additionalImages || 
                             formData.removeClientLogo || 
                             formData.removeMainImage ||
                             formData.removeAdditionalImages.length > 0;

      if (hasPhotoChanges) {
        // Handle photo uploads with WebP conversion
        setConverting(true);
        setMessage('Converting images to WebP format...');

        // Prepare all images for conversion
        const allImages: File[] = [];
        
        if (formData.clientLogo) {
          allImages.push(formData.clientLogo);
        }
        
        if (formData.mainImage) {
          allImages.push(formData.mainImage);
        }
        
        if (formData.additionalImages) {
          const additionalFiles = fileListToArray(formData.additionalImages);
          allImages.push(...additionalFiles);
        }

        let convertedFiles: File[] = [];
        if (allImages.length > 0) {
          try {
            // Convert all images to WebP
            convertedFiles = await ImageUtils.convertMultipleToWebP(
              allImages, 
              0.85, // High quality WebP
              1920  // Max width
            );
          } catch (conversionError) {
            console.error('Image conversion failed:', conversionError);
            setMessage('Image conversion failed. Please try again.');
            setConverting(false);
            setSubmitting(false);
            return;
          }
        }

        setConverting(false);
        setMessage('Uploading project with images...');

        // Create FormData for file upload
        const submitData = new FormData();
        
        // Add text data
        submitData.append('title', formData.title);
        submitData.append('description', formData.description);
        submitData.append('client', formData.client);
        submitData.append('year', formData.year);
        submitData.append('materials', formData.materials);
        submitData.append('techniques', formData.techniques);
        submitData.append('technologies', formData.technologies);
        submitData.append('tags', formData.tags);

        // Add removal flags
        if (formData.removeClientLogo) {
          submitData.append('removeClientLogo', 'true');
        }
        if (formData.removeMainImage) {
          submitData.append('removeMainImage', 'true');
        }
        if (formData.removeAdditionalImages.length > 0) {
          submitData.append('removeAdditionalImages', JSON.stringify(formData.removeAdditionalImages));
        }

        // Add converted images
        let convertedIndex = 0;
        
        if (formData.clientLogo && convertedFiles[convertedIndex]) {
          submitData.append('clientLogo', convertedFiles[convertedIndex]);
          convertedIndex++;
        }
        
        if (formData.mainImage && convertedFiles[convertedIndex]) {
          submitData.append('mainImage', convertedFiles[convertedIndex]);
          convertedIndex++;
        }
        
        if (formData.additionalImages) {
          const additionalFilesCount = fileListToArray(formData.additionalImages).length;
          for (let i = 0; i < additionalFilesCount; i++) {
            if (convertedFiles[convertedIndex]) {
              submitData.append('additionalImages', convertedFiles[convertedIndex]);
              convertedIndex++;
            }
          }
        }

        const response = await fetch(`/api/projects/${editingProject.id}`, {
          method: 'PUT',
          body: submitData
        });

        const data = await response.json();

        if (data.success) {
          setMessage('Project updated successfully!');
          cleanupPreviewUrls();
          setShowEditForm(false);
          setEditingProject(null);
          setFormData(initialFormData);
          fetchProjects(); // Refresh the project list
        } else {
          setMessage(data.error || 'Failed to update project');
        }
      } else {
        // No photo changes, send JSON data
        const updateData = {
          title: formData.title,
          description: formData.description,
          client: formData.client,
          year: formData.year,
          materials: formData.materials,
          techniques: formData.techniques,
          technologies: formData.technologies,
          tags: formData.tags
        };

        const response = await fetch(`/api/projects/${editingProject.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData)
        });

        const data = await response.json();

        if (data.success) {
          setMessage('Project updated successfully!');
          setShowEditForm(false);
          setEditingProject(null);
          setFormData(initialFormData);
          fetchProjects(); // Refresh the project list
        } else {
          setMessage(data.error || 'Failed to update project');
        }
      }
    } catch (error) {
      console.error('Error updating project:', error);
      setMessage('Error updating project');
    } finally {
      setSubmitting(false);
      setConverting(false);
    }
  };

  // Handle edit project
  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      client: project.client || '',
      year: project.year?.toString() || new Date().getFullYear().toString(),
      materials: project.materials || '',
      techniques: project.techniques || '',
      technologies: project.technologies || '',
      tags: project.tags.join(', '),
      // Initialize photo editing fields
      clientLogo: null,
      mainImage: null,
      additionalImages: null,
      removeClientLogo: false,
      removeMainImage: false,
      removeAdditionalImages: []
    });
    setShowEditForm(true);
  };

  // Handle delete project
  const handleDelete = async (project: Project) => {
    if (!confirm(`Are you sure you want to delete "${project.title}"? This action cannot be undone and will remove all associated images.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Project deleted successfully!');
        fetchProjects(); // Refresh the project list
      } else {
        setMessage(data.error || 'Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      setMessage('Error deleting project');
    }
  };

  // Reset form
  const resetForm = () => {
    cleanupPreviewUrls();
    setFormData(initialFormData);
    setEditingProject(null);
    setShowEditForm(false);
    setMessage('');
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Project Management</h1>
        <div className="text-sm text-gray-500">
          Total Projects: {pagination.total}
        </div>
      </div>

      {message && (
        <div className={`mb-4 p-4 rounded-lg ${message.includes('Error') || message.includes('Failed') 
          ? 'bg-red-100 text-red-700 border border-red-300' 
          : 'bg-green-100 text-green-700 border border-green-300'
        }`}>
          {message}
        </div>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search projects by title or client..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Edit Form */}
      {showEditForm && editingProject && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Edit Project: {editingProject.title}</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  name="client"
                  value={formData.client}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  min="1900"
                  max={new Date().getFullYear() + 10}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Materials
                </label>
                <input
                  type="text"
                  name="materials"
                  value={formData.materials}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Wood, Metal, Glass"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Techniques
                </label>
                <input
                  type="text"
                  name="techniques"
                  value={formData.techniques}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Laser cutting, Hand carving"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Technologies
                </label>
                <input
                  type="text"
                  name="technologies"
                  value={formData.technologies}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., CAD Software, 3D Printing"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., premium, custom, award"
              />
              <p className="text-sm text-gray-500 mt-1">Separate multiple tags with commas</p>
            </div>

            {/* Photo Editing Section */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-700">Photo Management</h3>
              
              {/* Client Logo */}
              <div className="mb-6">
                <h4 className="text-md font-medium mb-3 text-gray-600">Client Logo *</h4>
                
                {/* No Client Logo - Show Add Button */}
                {!editingProject?.clientLogo && !formData.clientLogo && !formData.removeClientLogo && (
                  <div className="mb-3 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                    <div className="text-gray-500 mb-2">No client logo uploaded</div>
                    <label htmlFor="clientLogo" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                      Add Client Logo
                    </label>
                    <input
                      type="file"
                      id="clientLogo"
                      name="clientLogo"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Upload the client's logo (JPG, PNG, WebP, GIF formats). Will be automatically converted to WebP.
                    </p>
                  </div>
                )}

                {/* Current Client Logo */}
                {editingProject?.clientLogo && !formData.removeClientLogo && !formData.clientLogo && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">Current logo:</p>
                    <div className="flex items-center space-x-3">
                      <Image
                        src={editingProject.clientLogo}
                        alt={`${editingProject.client} logo`}
                        width={80}
                        height={80}
                        className="object-contain border border-gray-200 rounded-lg"
                      />
                      <div className="flex space-x-2">
                        <label htmlFor="clientLogo" className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 cursor-pointer transition-colors">
                          Replace
                        </label>
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage('clientLogo')}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <input
                      type="file"
                      id="clientLogo"
                      name="clientLogo"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </div>
                )}

                {/* New Client Logo Preview */}
                {photoPreviewUrls.clientLogo && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">New logo preview:</p>
                    <div className="flex items-center space-x-3">
                      <Image
                        src={photoPreviewUrls.clientLogo}
                        alt="New client logo preview"
                        width={80}
                        height={80}
                        className="object-contain border border-gray-200 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (photoPreviewUrls.clientLogo) {
                            ImageUtils.revokePreviewUrl(photoPreviewUrls.clientLogo);
                          }
                          setFormData(prev => ({ ...prev, clientLogo: null }));
                          setPhotoPreviewUrls(prev => ({ ...prev, clientLogo: undefined }));
                        }}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {/* Client Logo will be removed - Show Add Button */}
                {formData.removeClientLogo && (
                  <div className="mb-3 p-4 border-2 border-dashed border-red-300 rounded-lg text-center">
                    <div className="text-red-600 text-sm mb-2">✓ Client logo will be removed</div>
                    <label htmlFor="clientLogoReplace" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                      Add New Client Logo
                    </label>
                    <input
                      type="file"
                      id="clientLogoReplace"
                      name="clientLogo"
                      accept="image/*"
                      onChange={(e) => {
                        handlePhotoChange(e);
                        setFormData(prev => ({ ...prev, removeClientLogo: false }));
                      }}
                      className="hidden"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Upload a new client logo to replace the removed one.
                    </p>
                  </div>
                )}
              </div>

              {/* Main Image */}
              <div className="mb-6">
                <h4 className="text-md font-medium mb-3 text-gray-600">Main Project Image *</h4>
                
                {/* No Main Image - Show Add Button */}
                {(!editingProject?.images || editingProject.images.length === 0) && !formData.mainImage && !formData.removeMainImage && (
                  <div className="mb-3 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                    <div className="text-gray-500 mb-2">No main image uploaded</div>
                    <label htmlFor="mainImage" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                      Add Main Image
                    </label>
                    <input
                      type="file"
                      id="mainImage"
                      name="mainImage"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Upload the main project image (JPG, PNG, WebP, GIF formats). Will be automatically converted to WebP.
                    </p>
                  </div>
                )}

                {/* Current Main Image */}
                {editingProject?.images && editingProject.images.length > 0 && !formData.removeMainImage && !formData.mainImage && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">Current main image:</p>
                    <div className="flex items-center space-x-3">
                      <Image
                        src={editingProject.images[0]}
                        alt={editingProject.title}
                        width={120}
                        height={120}
                        className="object-cover border border-gray-200 rounded-lg"
                      />
                      <div className="flex space-x-2">
                        <label htmlFor="mainImage" className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 cursor-pointer transition-colors">
                          Replace
                        </label>
                        <button
                          type="button"
                          onClick={() => handleRemoveExistingImage('mainImage')}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                    <input
                      type="file"
                      id="mainImage"
                      name="mainImage"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="hidden"
                    />
                  </div>
                )}

                {/* New Main Image Preview */}
                {photoPreviewUrls.mainImage && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">New main image preview:</p>
                    <div className="flex items-center space-x-3">
                      <Image
                        src={photoPreviewUrls.mainImage}
                        alt="New main image preview"
                        width={120}
                        height={120}
                        className="object-cover border border-gray-200 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (photoPreviewUrls.mainImage) {
                            ImageUtils.revokePreviewUrl(photoPreviewUrls.mainImage);
                          }
                          setFormData(prev => ({ ...prev, mainImage: null }));
                          setPhotoPreviewUrls(prev => ({ ...prev, mainImage: undefined }));
                        }}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                {/* Main Image will be removed - Show Add Button */}
                {formData.removeMainImage && (
                  <div className="mb-3 p-4 border-2 border-dashed border-red-300 rounded-lg text-center">
                    <div className="text-red-600 text-sm mb-2">✓ Main image will be removed</div>
                    <label htmlFor="mainImageReplace" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                      Add New Main Image
                    </label>
                    <input
                      type="file"
                      id="mainImageReplace"
                      name="mainImage"
                      accept="image/*"
                      onChange={(e) => {
                        handlePhotoChange(e);
                        setFormData(prev => ({ ...prev, removeMainImage: false }));
                      }}
                      className="hidden"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Upload a new main image to replace the removed one.
                    </p>
                  </div>
                )}
              </div>

              {/* Additional Images */}
              <div className="mb-6">
                <h4 className="text-md font-medium mb-3 text-gray-600">Additional Images</h4>
                
                {/* No Additional Images - Show Add Button */}
                {(!editingProject?.images || editingProject.images.length <= 1) && photoPreviewUrls.additionalImages.length === 0 && (
                  <div className="mb-3 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                    <div className="text-gray-500 mb-2">No additional images uploaded</div>
                    <label htmlFor="additionalImages" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors">
                      Add Additional Images
                    </label>
                    <input
                      type="file"
                      id="additionalImages"
                      name="additionalImages"
                      multiple
                      accept="image/*"
                      onChange={handleAdditionalImagesChange}
                      className="hidden"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Select up to 10 additional images (JPG, PNG, WebP, GIF formats). All images will be automatically converted to WebP for optimization.
                    </p>
                  </div>
                )}

                {/* Current Additional Images */}
                {editingProject?.images && editingProject.images.length > 1 && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">Current additional images:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      {editingProject.images.slice(1).map((image, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={image}
                            alt={`Additional image ${index + 1}`}
                            width={100}
                            height={100}
                            className="object-cover border border-gray-200 rounded-lg w-full"
                          />
                          {!formData.removeAdditionalImages.includes(index) && (
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  removeAdditionalImages: [...prev.removeAdditionalImages, index]
                                }));
                              }}
                              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                            >
                              ×
                            </button>
                          )}
                          {formData.removeAdditionalImages.includes(index) && (
                            <div className="absolute inset-0 bg-red-500 bg-opacity-50 flex items-center justify-center rounded-lg">
                              <span className="text-white text-xs font-medium">Will be removed</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Additional Images Preview */}
                {photoPreviewUrls.additionalImages.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">New additional images preview:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
                      {photoPreviewUrls.additionalImages.map((url, index) => (
                        <div key={index} className="relative">
                          <Image
                            src={url}
                            alt={`New additional image ${index + 1}`}
                            width={100}
                            height={100}
                            className="object-cover border border-gray-200 rounded-lg w-full"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              // Remove this specific image from the preview
                              const newUrls = [...photoPreviewUrls.additionalImages];
                              ImageUtils.revokePreviewUrl(newUrls[index]);
                              newUrls.splice(index, 1);
                              setPhotoPreviewUrls(prev => ({
                                ...prev,
                                additionalImages: newUrls
                              }));
                              
                              // Also remove from form data (need to recreate FileList without this file)
                              if (formData.additionalImages) {
                                const files = fileListToArray(formData.additionalImages);
                                files.splice(index, 1);
                                // Note: FileList is read-only, so we'll need to handle this in the upload logic
                                setFormData(prev => ({ ...prev, additionalImages: null }));
                              }
                            }}
                            className="absolute top-1 right-1 bg-gray-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Additional Images Upload - Always show if there are existing images or new previews */}
                {((editingProject?.images && editingProject.images.length > 1) || photoPreviewUrls.additionalImages.length > 0) && (
                  <div>
                    <label htmlFor="additionalImagesMore" className="block text-sm font-medium text-gray-700 mb-1">
                      Add More Images
                    </label>
                    <input
                      type="file"
                      id="additionalImagesMore"
                      name="additionalImages"
                      multiple
                      accept="image/*"
                      onChange={handleAdditionalImagesChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Select up to 10 additional images (JPG, PNG, WebP, GIF formats). All images will be automatically converted to WebP for optimization.
                    </p>
                    {formData.additionalImages && formData.additionalImages.length > 0 && (
                      <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                        <p className="text-sm text-blue-700">
                          ✓ {formData.additionalImages.length} additional image(s) selected
                        </p>
                        <ul className="text-xs text-blue-600 mt-1">
                          {Array.from(formData.additionalImages).map((file, index) => (
                            <li key={index}>• {file.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={submitting || converting}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {converting ? 'Converting Images...' : submitting ? 'Updating...' : 'Update Project'}
              </button>
              
              <button
                type="button"
                onClick={resetForm}
                disabled={submitting || converting}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Project List */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Projects ({projects.length} of {pagination.total})
          </h2>
        </div>

        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            {searchTerm ? 'No projects found matching your filters.' : 'No projects found. Create your first project!'}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {projects.map((project) => (
              <div key={project.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Main Image */}
                    {project.images && project.images.length > 0 ? (
                      <Image
                        src={project.images[0]}
                        alt={project.title}
                        width={80}
                        height={80}
                        className="object-cover rounded-lg border border-gray-200 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{project.title}</h3>
                      </div>
                      
                      <p className="text-gray-600 mb-2 line-clamp-2">{project.description}</p>
                      
                      <div className="text-sm text-gray-500 space-y-1">
                        {project.client && (
                          <div><strong>Client:</strong> {project.client}</div>
                        )}
                        {project.year && (
                          <div><strong>Year:</strong> {project.year}</div>
                        )}
                        {project.tags && project.tags.length > 0 && (
                          <div><strong>Tags:</strong> {project.tags.join(', ')}</div>
                        )}
                        <div><strong>Images:</strong> {project.images.length}</div>
                        <div><strong>Created:</strong> {new Date(project.createdAt).toLocaleDateString()}</div>
                        <div><strong>Slug:</strong> /{project.slug}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(project)}
                      className="bg-blue-100 text-blue-700 px-3 py-1 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(project)}
                      className="bg-red-100 text-red-700 px-3 py-1 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}