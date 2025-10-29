/**
 * Script to create an admin user
 * Run with: npm run create-admin
 */

import mongoose from 'mongoose';
import { User } from '../src/models/User';
import { AuthUtils } from '../src/utils/auth';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://kacihamrounpro:kacikaci@cluster0.tikf5zi.mongodb.net/adrian_portfolio';

async function createAdminUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Admin user details - CHANGE THESE FOR PRODUCTION
    const adminData = {
      email: 'admin@adrianbauduin.com',
      password: 'admin123', // Change this password!
      name: 'Adrian Bauduin',
      role: 'admin'
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('❌ Admin user already exists with email:', adminData.email);
      process.exit(1);
    }

    // Hash password
    const hashedPassword = await AuthUtils.hashPassword(adminData.password);

    // Create admin user
    const adminUser = new User({
      email: adminData.email,
      password: hashedPassword,
      name: adminData.name,
      role: adminData.role
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password:', adminData.password);
    console.log('⚠️  IMPORTANT: Change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
createAdminUser();