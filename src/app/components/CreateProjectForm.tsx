'use client';

import { useState } from 'react';
import { ImageUtils } from '../../utils/imageUtils';
import { generateSlugFromTitle, validateProjectSEO } from '../../utils/projectSeoGenerator';
import { DatabaseProject } from '@/types';

interface ProjectFormData {
  title: string;
  description: string;
  client: string;
  year: string;
  materials: string;
  techniques: string;
  technologies: string;
  tags: string;
  mainImage: File | null;
  additionalImages: FileList | null;
  clientLogo: File | null;
}

const CreateProjectForm = () => {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    client: '',
    year: new Date().getFullYear().toString(),
    materials: '',
    techniques: '',
    technologies: '',
    tags: '',
    mainImage: null,
    additionalImages: null,
    clientLogo: null
  });
  
  const [loading, setLoading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [seoValidation, setSeoValidation] = useState<{ isValid: boolean; issues: string[]; recommendations: string[] } | null>(null);

  // Helper function to convert FileList to File array
  const fileListToArray = (fileList: FileList): File[] => {
    const files: File[] = [];
    for (let i = 0; i < fileList.length; i++) {
      files.push(fileList[i]);
    }
    return files;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    // Update form data
    const newFormData = {
      ...formData,
      [name]: value
    };
    setFormData(newFormData);
    
    // Real-time SEO validation for key fields
    if (['title', 'description', 'materials', 'techniques'].includes(name)) {
      const projectData: Partial<DatabaseProject> = {
        title: newFormData.title,
        description: newFormData.description,
        materials: newFormData.materials,
        techniques: newFormData.techniques,
        year: parseInt(newFormData.year) || new Date().getFullYear(),
        slug: generateSlugFromTitle(newFormData.title),
        images: [], // Will be populated after upload
        client: newFormData.client
      };
      
      const validation = validateProjectSEO(projectData as DatabaseProject);
      setSeoValidation(validation);
    }
    
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    
    if (name === 'mainImage') {
      setFormData(prev => ({
        ...prev,
        mainImage: files?.[0] || null
      }));
    } else if (name === 'additionalImages') {
      // Limit to max 10 additional images
      if (files && files.length > 10) {
        alert('Maximum 10 additional images allowed');
        e.target.value = ''; // Reset input
        return;
      }
      setFormData(prev => ({
        ...prev,
        additionalImages: files
      }));
    } else if (name === 'clientLogo') {
      setFormData(prev => ({
        ...prev,
        clientLogo: files?.[0] || null
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // Pre-submit SEO validation
      const projectData: Partial<DatabaseProject> = {
        title: formData.title,
        description: formData.description,
        materials: formData.materials,
        techniques: formData.techniques,
        year: parseInt(formData.year) || new Date().getFullYear(),
        slug: generateSlugFromTitle(formData.title),
        images: [], // Will be populated after upload
        client: formData.client
      };
      
      const validation = validateProjectSEO(projectData as DatabaseProject);
      if (!validation.isValid) {
        setMessage({ 
          type: 'error', 
          text: `SEO validation failed: ${validation.issues.join(', ')}` 
        });
        setLoading(false);
        return;
      }

      const submitData = new FormData();
      
      // Add all form fields with auto-generated SEO slug
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('client', formData.client);
      submitData.append('year', formData.year);
      submitData.append('materials', formData.materials);
      submitData.append('techniques', formData.techniques);
      submitData.append('technologies', formData.technologies);
      submitData.append('tags', formData.tags);
      submitData.append('slug', generateSlugFromTitle(formData.title)); // Auto-generated SEO slug

      // Handle client logo upload
      if (formData.clientLogo) {
        submitData.append('clientLogo', formData.clientLogo);
      }

      // Check if main image is provided (mandatory)
      if (!formData.mainImage) {
        setMessage({ type: 'error', text: 'Main project image is required' });
        setLoading(false);
        return;
      }

      // Prepare all images for conversion
      const allImages: File[] = [formData.mainImage];
      
      // Add client logo if provided
      if (formData.clientLogo) {
        allImages.push(formData.clientLogo);
      }
      
      // Add additional images if any
      if (formData.additionalImages) {
        const additionalFiles = fileListToArray(formData.additionalImages);
        allImages.push(...additionalFiles);
      }

      setConverting(true);
      setMessage({ type: 'info', text: 'Converting images to WebP format...' });
      
      try {
        // Convert all images to WebP
        const convertedFiles = await ImageUtils.convertMultipleToWebP(
          allImages, 
          0.85, // High quality WebP
          1920  // Max width
        );
        
        // Add converted files to form data
        let fileIndex = 0;
        
        // First image is always the main image
        submitData.append('mainImage', convertedFiles[fileIndex++]);
        
        // Second image is client logo if it was provided
        if (formData.clientLogo) {
          submitData.append('clientLogo', convertedFiles[fileIndex++]);
        }
        
        // Rest are additional images
        while (fileIndex < convertedFiles.length) {
          submitData.append('files', convertedFiles[fileIndex++]);
        }
        
        setMessage({ type: 'info', text: 'Images converted! Uploading project...' });
      } catch (conversionError) {
        console.error('Conversion error:', conversionError);
        setMessage({ type: 'error', text: 'Failed to convert images. Please try again.' });
        setLoading(false);
        setConverting(false);
        return;
      } finally {
        setConverting(false);
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        body: submitData,
      });

      const result = await response.json();

      if (result.success) {
        setMessage({ type: 'success', text: `Project "${result.project.title}" created successfully with slug: ${result.project.slug}` });
        setFormData({
          title: '',
          description: '',
          client: '',
          year: new Date().getFullYear().toString(),
          materials: '',
          techniques: '',
          technologies: '',
          tags: '',
          mainImage: null,
          additionalImages: null,
          clientLogo: null
        });
        // Reset file inputs
        const mainImageInput = document.getElementById('mainImage') as HTMLInputElement;
        const additionalImagesInput = document.getElementById('additionalImages') as HTMLInputElement;
        const clientLogoInput = document.getElementById('clientLogo') as HTMLInputElement;
        if (mainImageInput) mainImageInput.value = '';
        if (additionalImagesInput) additionalImagesInput.value = '';
        if (clientLogoInput) clientLogoInput.value = '';
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to create project' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' });
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Create New Project</h2>
      
      {message && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-700 border border-green-300' 
            : message.type === 'info'
            ? 'bg-blue-100 text-blue-700 border border-blue-300'
            : 'bg-red-100 text-red-700 border border-red-300'
        }`}>
          {message.text}
        </div>
      )}

      {/* SEO Validation Display */}
      {seoValidation && (
        <div className="mb-6 p-4 rounded-lg border">
          <h3 className="font-semibold mb-2 flex items-center">
            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
              seoValidation.isValid ? 'bg-green-500' : 'bg-yellow-500'
            }`}></span>
            SEO Status: {seoValidation.isValid ? 'Optimized' : 'Needs Improvement'}
          </h3>
          
          {seoValidation.issues.length > 0 && (
            <div className="mb-3">
              <h4 className="text-sm font-medium text-red-700 mb-1">Issues to Fix:</h4>
              <ul className="text-sm text-red-600 list-disc list-inside">
                {seoValidation.issues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
          
          {seoValidation.recommendations.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-amber-700 mb-1">Recommendations:</h4>
              <ul className="text-sm text-amber-600 list-disc list-inside">
                {seoValidation.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
          
          {formData.title && (
            <div className="mt-3 pt-3 border-t">
              <p className="text-sm text-gray-600">
                <strong>Auto-generated URL:</strong> /trophee/{generateSlugFromTitle(formData.title)}
              </p>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter project title"
              />
            </div>

            <div>
              <label htmlFor="client" className="block text-sm font-medium text-gray-700 mb-1">
                Client Name
              </label>
              <input
                type="text"
                id="client"
                name="client"
                value={formData.client}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter client name"
              />
            </div>

            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                min="1900"
                max={new Date().getFullYear() + 10}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe your project..."
              />
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Technical Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="materials" className="block text-sm font-medium text-gray-700 mb-1">
                Materials Used
              </label>
              <input
                type="text"
                id="materials"
                name="materials"
                value={formData.materials}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Wood, Metal, Glass"
              />
            </div>

            <div>
              <label htmlFor="techniques" className="block text-sm font-medium text-gray-700 mb-1">
                Techniques Used
              </label>
              <input
                type="text"
                id="techniques"
                name="techniques"
                value={formData.techniques}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Laser cutting, Hand carving"
              />
            </div>

            <div>
              <label htmlFor="technologies" className="block text-sm font-medium text-gray-700 mb-1">
                Technologies Used
              </label>
              <input
                type="text"
                id="technologies"
                name="technologies"
                value={formData.technologies}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., CAD Software, 3D Printing"
              />
            </div>

            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., premium, custom, award"
              />
              <p className="text-sm text-gray-500 mt-1">Separate multiple tags with commas</p>
            </div>
          </div>
        </div>

        {/* Client Logo */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Client Logo</h3>
          
          <div>
            <label htmlFor="clientLogo" className="block text-sm font-medium text-gray-700 mb-1">
              Client Logo (Optional)
            </label>
            <input
              type="file"
              id="clientLogo"
              name="clientLogo"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-500 mt-1">
              Upload the client's logo (JPG, PNG, WebP, GIF formats). This will be displayed alongside the project.
            </p>
            {formData.clientLogo && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
                <p className="text-sm text-blue-700">
                  ✓ Client logo selected: {formData.clientLogo.name}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Images */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">Project Images</h3>
          
          <div className="space-y-4">
            {/* Main Image - Mandatory */}
            <div>
              <label htmlFor="mainImage" className="block text-sm font-medium text-gray-700 mb-1">
                Main Project Image *
              </label>
              <input
                type="file"
                id="mainImage"
                name="mainImage"
                accept="image/*"
                onChange={handleFileChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-sm text-gray-500 mt-1">
                Select the main project image (mandatory). This will be the primary image displayed.
              </p>
              {formData.mainImage && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                  <p className="text-sm text-green-700">
                    ✓ Main image selected: {formData.mainImage.name}
                  </p>
                </div>
              )}
            </div>

            {/* Additional Images - Optional */}
            <div>
              <label htmlFor="additionalImages" className="block text-sm font-medium text-gray-700 mb-1">
                Additional Images (Optional)
              </label>
              <input
                type="file"
                id="additionalImages"
                name="additionalImages"
                multiple
                accept="image/*"
                onChange={handleFileChange}
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
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || converting}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed font-medium text-lg"
        >
          {converting ? 'Converting to WebP...' : loading ? 'Creating Project...' : 'Create Project'}
        </button>
      </form>
    </div>
  );
};

export default CreateProjectForm;