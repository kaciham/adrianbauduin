# Authentication & Database System

This document explains the complete authentication and MongoDB integration for the Adrian Bauduin portfolio project.

## 🚀 Features

✅ **MongoDB Integration** with Mongoose  
✅ **JWT Authentication** with HTTP-only cookies  
✅ **User Registration & Login**  
✅ **Protected Routes** (Admin/User roles)  
✅ **Password Hashing** with bcrypt  
✅ **File Upload Protection**  
✅ **React Context for Auth State**  
✅ **Responsive Auth Components**  

## 🗄️ Database Schema

### User Model
```typescript
{
  email: string (unique, required)
  password: string (hashed, required)
  name: string (required)
  role: 'admin' | 'user' (default: 'user')
  createdAt: Date
  updatedAt: Date
}
```

### Project Model
```typescript
{
  title: string (required)
  description: string (required)
  category: string (required)
  images: string[] (file paths)
  featured: boolean (default: false)
  status: 'draft' | 'published' | 'archived' (default: 'published')
  createdBy: ObjectId (ref: User)
  tags: string[]
  slug: string (auto-generated)
  createdAt: Date
  updatedAt: Date
  publishedAt: Date
}
```

## 🔧 Setup Instructions

### 1. Environment Variables
Create/update `.env.local`:
```env
MONGODB_URI=mongodb+srv://kacihamrounpro:kacikaci@cluster0.tikf5zi.mongodb.net/adrian_portfolio
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### 2. Create Admin User
```bash
npm run create-admin
```

This creates an admin user with:
- **Email**: `admin@adrianbauduin.com`
- **Password**: `admin123`
- **Role**: `admin`

⚠️ **IMPORTANT**: Change the password after first login!

### 3. Start Development Server
```bash
npm run dev
```

## 🔐 Authentication Flow

### Registration
1. User fills registration form
2. Password validation (min 6 chars, letters + numbers)
3. Email uniqueness check
4. Password hashing with bcrypt
5. User creation in database
6. Auto-login with JWT token

### Login
1. Email/password validation
2. User lookup in database
3. Password verification with bcrypt
4. JWT token generation
5. HTTP-only cookie set

### Protected Routes
1. Token extraction from cookies/headers
2. JWT verification
3. User lookup in database
4. Role-based access control

## 📍 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Projects (Protected)
- `POST /api/projects` - Create project (auth required)
- `GET /api/projects` - Get projects (public)
- `POST /api/upload` - Upload files (auth required)

### API Request Examples

#### Register
```javascript
const response = await fetch('/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123',
    name: 'John Doe'
  })
});
```

#### Login
```javascript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
});
```

#### Create Project
```javascript
const formData = new FormData();
formData.append('title', 'My Project');
formData.append('description', 'Project description');
formData.append('category', 'trophées');
formData.append('files', file1);
formData.append('files', file2);

const response = await fetch('/api/projects', {
  method: 'POST',
  credentials: 'include',
  body: formData
});
```

## 🎨 Frontend Components

### Auth Context
```typescript
const { user, loading, login, register, logout } = useAuth();
```

### Protected Route
```jsx
<ProtectedRoute requireAdmin={true}>
  <AdminContent />
</ProtectedRoute>
```

### Auth Modal
```jsx
<AuthModal 
  isOpen={showModal} 
  onClose={() => setShowModal(false)}
  defaultMode="login" 
/>
```

## 🛡️ Security Features

### Password Security
- Minimum 6 characters
- Must contain letters and numbers
- Hashed with bcrypt (12 rounds)

### JWT Security
- HTTP-only cookies (prevents XSS)
- 7-day expiration
- Secure flag in production
- SameSite=strict

### API Security
- Authentication middleware on protected routes
- Role-based access control
- Input validation and sanitization
- Error handling without information leakage

## 📱 Pages & Navigation

### Public Pages
- `/` - Home page
- `/projects` - Project gallery
- `/login` - Authentication page

### Protected Pages
- `/admin` - Admin dashboard (admin only)

### Authentication States
- **Loading**: Shows spinner while checking auth
- **Unauthenticated**: Shows login prompt or modal
- **Authenticated**: Shows protected content
- **Unauthorized**: Shows permission denied message

## 🔄 State Management

### Auth Context Provider
Wraps the entire app and provides:
- Current user state
- Loading state
- Auth functions (login, register, logout)
- Auto-token refresh on page load

### Usage Example
```jsx
function MyComponent() {
  const { user, loading, logout } = useAuth();
  
  if (loading) return <Spinner />;
  if (!user) return <LoginPrompt />;
  
  return (
    <div>
      Welcome {user.name}!
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## 🚀 Deployment Considerations

### Environment Variables
Set these in production:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Strong random secret (32+ characters)
- `NEXTAUTH_SECRET` - Another strong secret
- `NEXTAUTH_URL` - Your production domain

### Security Checklist
- [ ] Change default admin password
- [ ] Use strong JWT secret
- [ ] Enable HTTPS in production
- [ ] Set secure cookie flags
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Monitor failed login attempts

### Database Indexes
The following indexes are automatically created:
- `User.email` (unique)
- `Project.category + status`
- `Project.createdBy`
- `Project.slug` (unique)
- `Project.featured + status`

## 🛠️ Development Workflow

### 1. Create Admin User
```bash
npm run create-admin
```

### 2. Login to Admin
Visit `http://localhost:3000/login` and use admin credentials

### 3. Access Admin Dashboard
Navigate to `http://localhost:3000/admin`

### 4. Create Projects
Use the admin interface to create projects with images

### 5. View Public Gallery
Check `http://localhost:3000/projects` for the public gallery

## 🐛 Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Check MONGODB_URI in `.env.local`
- Verify network access to MongoDB Atlas
- Check database name in connection string

**JWT Token Issues**
- Clear cookies and try again
- Check JWT_SECRET is set
- Verify cookie settings

**File Upload Issues**
- Check authentication is working
- Verify file size limits
- Check file permissions in `public/projects`

**Admin Access Denied**
- Verify user role is 'admin' in database
- Check authentication token is valid
- Confirm admin user was created successfully

### Debug Mode
Add this to your component to debug auth state:
```jsx
const { user } = useAuth();
console.log('Current user:', user);
```

## 📝 Next Steps

1. **Email Verification**: Add email confirmation for new users
2. **Password Reset**: Implement forgot password functionality
3. **2FA**: Add two-factor authentication
4. **Rate Limiting**: Implement login attempt limiting
5. **Audit Logs**: Track user actions
6. **Role Management**: Add more granular permissions
7. **Project Management**: Add edit/delete functionality
8. **Image Optimization**: Add automatic image compression
9. **Backup System**: Implement database backups
10. **Monitoring**: Add error tracking and analytics

The system is now fully functional with MongoDB integration and JWT authentication!