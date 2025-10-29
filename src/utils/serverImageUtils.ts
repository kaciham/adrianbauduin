import sharp from 'sharp';
import path from 'path';
import { writeFile, mkdir } from 'fs/promises';

export interface ImageProcessingOptions {
  quality?: number;
  maxWidth?: number;
  maxHeight?: number;
  format?: 'webp' | 'jpeg' | 'png';
}

export class ServerImageUtils {
  /**
   * Convert image buffer to WebP format
   * @param buffer Buffer - Input image buffer
   * @param options ImageProcessingOptions
   * @returns Promise<Buffer>
   */
  static async convertToWebP(
    buffer: Buffer, 
    options: ImageProcessingOptions = {}
  ): Promise<Buffer> {
    const {
      quality = 85,
      maxWidth = 1920,
      maxHeight = 1080
    } = options;

    try {
      let sharpInstance = sharp(buffer);

      // Get image metadata
      const metadata = await sharpInstance.metadata();
      
      // Resize if necessary
      if (metadata.width && metadata.height) {
        if (metadata.width > maxWidth || metadata.height > maxHeight) {
          sharpInstance = sharpInstance.resize(maxWidth, maxHeight, {
            fit: 'inside',
            withoutEnlargement: true
          });
        }
      }

      // Convert to WebP
      const webpBuffer = await sharpInstance
        .webp({ quality })
        .toBuffer();

      return webpBuffer;
    } catch (error) {
      throw new Error(`Failed to convert image to WebP: ${error}`);
    }
  }

  /**
   * Process and save image with WebP conversion
   * @param buffer Buffer - Input image buffer
   * @param outputPath string - Output file path (without extension)
   * @param options ImageProcessingOptions
   * @returns Promise<string> - Final file path
   */
  static async processAndSaveImage(
    buffer: Buffer,
    outputPath: string,
    options: ImageProcessingOptions = {}
  ): Promise<string> {
    try {
      // Ensure output directory exists
      const dir = path.dirname(outputPath);
      await mkdir(dir, { recursive: true });

      // Convert to WebP
      const webpBuffer = await this.convertToWebP(buffer, options);
      
      // Generate WebP filename
      const pathWithoutExt = outputPath.replace(/\.[^/.]+$/, '');
      const webpPath = `${pathWithoutExt}.webp`;
      
      // Save the processed image
      await writeFile(webpPath, webpBuffer);
      
      return webpPath;
    } catch (error) {
      throw new Error(`Failed to process and save image: ${error}`);
    }
  }

  /**
   * Generate multiple sizes of an image (responsive images)
   * @param buffer Buffer
   * @param basePath string
   * @param sizes number[]
   * @returns Promise<string[]>
   */
  static async generateResponsiveSizes(
    buffer: Buffer,
    basePath: string,
    sizes: number[] = [480, 768, 1024, 1920]
  ): Promise<string[]> {
    const results: string[] = [];
    
    try {
      for (const size of sizes) {
        const sizePath = basePath.replace(/(\.[^/.]+)?$/, `_${size}w.webp`);
        
        const resizedBuffer = await sharp(buffer)
          .resize(size, null, { 
            fit: 'inside',
            withoutEnlargement: true 
          })
          .webp({ quality: 85 })
          .toBuffer();
        
        await writeFile(sizePath, resizedBuffer);
        results.push(sizePath);
      }
      
      return results;
    } catch (error) {
      throw new Error(`Failed to generate responsive sizes: ${error}`);
    }
  }

  /**
   * Get image information
   * @param buffer Buffer
   * @returns Promise<sharp.Metadata>
   */
  static async getImageInfo(buffer: Buffer): Promise<sharp.Metadata> {
    try {
      return await sharp(buffer).metadata();
    } catch (error) {
      throw new Error(`Failed to get image info: ${error}`);
    }
  }

  /**
   * Optimize existing image without format conversion
   * @param buffer Buffer
   * @param options ImageProcessingOptions
   * @returns Promise<Buffer>
   */
  static async optimizeImage(
    buffer: Buffer,
    options: ImageProcessingOptions = {}
  ): Promise<Buffer> {
    const {
      quality = 85,
      maxWidth = 1920,
      maxHeight = 1080,
      format
    } = options;

    try {
      let sharpInstance = sharp(buffer);
      const metadata = await sharpInstance.metadata();

      // Resize if necessary
      if (metadata.width && metadata.height) {
        if (metadata.width > maxWidth || metadata.height > maxHeight) {
          sharpInstance = sharpInstance.resize(maxWidth, maxHeight, {
            fit: 'inside',
            withoutEnlargement: true
          });
        }
      }

      // Apply format-specific optimization
      switch (format || metadata.format) {
        case 'jpeg':
        case 'jpg':
          return await sharpInstance.jpeg({ quality }).toBuffer();
        case 'png':
          return await sharpInstance.png({ quality }).toBuffer();
        case 'webp':
          return await sharpInstance.webp({ quality }).toBuffer();
        default:
          // Default to WebP for best compression
          return await sharpInstance.webp({ quality }).toBuffer();
      }
    } catch (error) {
      throw new Error(`Failed to optimize image: ${error}`);
    }
  }

  /**
   * Create thumbnail from image
   * @param buffer Buffer
   * @param size number
   * @returns Promise<Buffer>
   */
  static async createThumbnail(
    buffer: Buffer,
    size: number = 300
  ): Promise<Buffer> {
    try {
      return await sharp(buffer)
        .resize(size, size, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: 80 })
        .toBuffer();
    } catch (error) {
      throw new Error(`Failed to create thumbnail: ${error}`);
    }
  }
}