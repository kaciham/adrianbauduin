import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  client?: string;
  clientLogo?: string;
  images: string[];
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  tags: string[];
  slug: string;
  year?: number;
  materials?: string;
  techniques?: string;
  technologies?: string;
}

const ProjectSchema = new Schema<IProject>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  client: {
    type: String,
    trim: true,
    maxlength: [200, 'Client name cannot exceed 200 characters']
  },
  clientLogo: {
    type: String,
    trim: true
  },
  images: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  publishedAt: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  year: {
    type: Number,
    min: [1900, 'Year must be after 1900'],
    max: [new Date().getFullYear() + 10, 'Year cannot be too far in the future']
  },
  materials: {
    type: String,
    trim: true
  },
  techniques: {
    type: String,
    trim: true
  },
  technologies: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
ProjectSchema.index({ client: 1 });
ProjectSchema.index({ createdBy: 1 });
// The unique: true in the schema already creates an index for slug, so we don't need this explicit index
// ProjectSchema.index({ slug: 1 });
ProjectSchema.index({ year: 1 });
ProjectSchema.index({ materials: 1 });
ProjectSchema.index({ techniques: 1 });

// Pre-save middleware to generate slug
ProjectSchema.pre('save', function(next) {
  if (this.isNew || this.isModified('title')) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-')         // Replace spaces with hyphens
      .replace(/-+/g, '-')          // Replace multiple hyphens with single hyphen
      .trim()                       // Remove leading/trailing spaces
      .replace(/^-+|-+$/g, '');     // Remove leading/trailing hyphens
  }
  
  next();
});

export const Project = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);