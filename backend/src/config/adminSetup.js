const User = require('../models/User');

const setupDefaultAdmin = async () => {
  try {
    // Default admin credentials
    const adminEmail = 'admin@taskmaster.com';
    const adminPassword = 'Admin@123'; // Strong password
    const adminName = 'System Administrator';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Password:', adminPassword);
      console.log('👑 Role: admin');
      return;
    }

    // Create admin user
    const adminUser = new User({
      name: adminName,
      email: adminEmail,
      password: adminPassword, // Will be hashed by User model middleware
      role: 'admin',
      isActive: true
    });

    // Save admin user
    await adminUser.save();
    
    console.log('🎉 Default Admin User Created!');
    console.log('==============================');
    console.log('📧 Email:', adminEmail);
    console.log('🔑 Password:', adminPassword);
    console.log('👑 Role: admin');
    console.log('📝 Name:', adminName);
    console.log('==============================');
    console.log('💡 Use these credentials to login as administrator');
    
  } catch (error) {
    console.error('❌ Error creating default admin:', error.message);
  }
};

module.exports = setupDefaultAdmin;