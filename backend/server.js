const Application = require('./src/app');
const User = require('./src/models/User'); // Add this
require('dotenv').config();

const app = new Application();
const PORT = process.env.PORT || 5000;

// Function to setup default admin
const setupDefaultAdmin = async () => {
  try {
    const adminEmail = 'admin@taskmaster.com';
    const adminPassword = 'Admin@123';
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const adminUser = new User({
        name: 'System Administrator',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        isActive: true
      });
      
      await adminUser.save();
      console.log('\n🎉 DEFAULT ADMIN USER CREATED');
      console.log('==============================');
      console.log('📧 Email: admin@taskmaster.com');
      console.log('🔑 Password: Admin@123');
      console.log('👑 Role: Administrator');
      console.log('==============================\n');
    } else {
      console.log('\n✅ Admin user already exists');
      console.log('📧 Email: admin@taskmaster.com');
      console.log('🔑 Password: Admin@123\n');
    }
  } catch (error) {
    console.error('❌ Error setting up admin:', error.message);
  }
};

// Start server with admin setup
app.start(PORT).then(async () => {
  // Wait a bit for DB connection
  setTimeout(setupDefaultAdmin, 1000);
}).catch((error) => {
  console.error('Application failed to start:', error);
  process.exit(1);
});