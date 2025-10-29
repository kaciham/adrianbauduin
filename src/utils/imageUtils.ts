/**
 * Utility functions for handling images in the project
 */

export class ImageUtils {
  /**
   * Validate image file type
   * @param file File
   * @returns boolean
   */
  static isValidImageType(file: File): boolean {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    return allowedTypes.includes(file.type);
  }

  /**
   * Validate image file size (default max: 5MB)
   * @param file File
   * @param maxSizeMB number
   * @returns boolean
   */
  static isValidImageSize(file: File, maxSizeMB: number = 5): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }

  /**
   * Get optimized image dimensions
   * @param file File
   * @returns Promise<{width: number, height: number}>
   */
  static getImageDimensions(file: File): Promise<{width: number, height: number}> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image'));
      };
      
      img.src = url;
    });
  }

  /**
   * Create a preview URL for an image file
   * @param file File
   * @returns string
   */
  static createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  /**
   * Revoke a preview URL to free memory
   * @param url string
   */
  static revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url);
  }

  /**
   * Compress image file (basic client-side compression)
   * @param file File
   * @param quality number (0-1)
   * @param maxWidth number
   * @returns Promise<File>
   */
  static compressImage(file: File, quality: number = 0.8, maxWidth: number = 1920): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Failed to compress image'));
            }
          },
          file.type,
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Format file size for display
   * @param bytes number
   * @returns string
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Check if image is already in WebP format
   * @param file File
   * @returns boolean
   */
  static isWebP(file: File): boolean {
    return file.type === 'image/webp';
  }

  /**
   * Convert image to WebP format
   * @param file File
   * @param quality number (0-1, default: 0.8)
   * @param maxWidth number (default: 1920)
   * @returns Promise<File>
   */
  static convertToWebP(file: File, quality: number = 0.8, maxWidth: number = 1920): Promise<File> {
    return new Promise((resolve, reject) => {
      // If already WebP, just optimize it
      if (this.isWebP(file)) {
        this.compressImage(file, quality, maxWidth).then(resolve).catch(reject);
        return;
      }

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw image on canvas
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to WebP
        canvas.toBlob(
          (blob) => {
            if (blob) {
              // Generate new filename with .webp extension
              const originalName = file.name;
              const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
              const webpFileName = `${nameWithoutExt}.webp`;
              
              const webpFile = new File([blob], webpFileName, {
                type: 'image/webp',
                lastModified: Date.now()
              });
              resolve(webpFile);
            } else {
              reject(new Error('Failed to convert image to WebP'));
            }
          },
          'image/webp',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image for WebP conversion'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Process multiple images and convert them to WebP
   * @param files FileList or File[]
   * @param quality number (0-1, default: 0.8)
   * @param maxWidth number (default: 1920)
   * @returns Promise<File[]>
   */
  static async convertMultipleToWebP(
    files: FileList | File[], 
    quality: number = 0.8, 
    maxWidth: number = 1920
  ): Promise<File[]> {
    const fileArray = Array.from(files);
    const conversionPromises = fileArray.map(file => this.convertToWebP(file, quality, maxWidth));
    
    try {
      return await Promise.all(conversionPromises);
    } catch (error) {
      throw new Error(`Failed to convert images: ${error}`);
    }
  }

  /**
   * Auto-convert image to WebP if it's not already
   * @param file File
   * @param options Object with quality and maxWidth options
   * @returns Promise<File>
   */
  static async autoConvertToWebP(
    file: File, 
    options: { quality?: number; maxWidth?: number } = {}
  ): Promise<File> {
    const { quality = 0.8, maxWidth = 1920 } = options;
    
    // Check if the file is a valid image
    if (!this.isValidImageType(file)) {
      throw new Error('Invalid image type');
    }

    // Check if it's already WebP
    if (this.isWebP(file)) {
      console.log(`Image ${file.name} is already in WebP format`);
      return this.compressImage(file, quality, maxWidth);
    }

    console.log(`Converting ${file.name} to WebP format`);
    return this.convertToWebP(file, quality, maxWidth);
  }

  /**
   * Generate a filename with timestamp to avoid conflicts
   * @param originalName string
   * @returns string
   */
  static generateUniqueFilename(originalName: string): string {
    const timestamp = Date.now();
    const extension = originalName.substring(originalName.lastIndexOf('.'));
    const nameWithoutExt = originalName.substring(0, originalName.lastIndexOf('.'));
    return `${nameWithoutExt}_${timestamp}${extension}`;
  }
}