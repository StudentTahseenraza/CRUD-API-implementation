const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  
  role: {
    type: String,
    enum: {
      values: ['user', 'admin'],
      message: 'Role must be either user or admin'
    },
    default: 'user'
  },
  
  isActive: {
    type: Boolean,
    default: true
  },
  
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for better query performance
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });

// Password hashing middleware
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to remove sensitive data
UserSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

// Static method to ensure admin exists
UserSchema.statics.ensureAdminExists = async function() {
  try {
    const adminEmail = 'admin@taskmaster.com';
    const adminExists = await this.findOne({ email: adminEmail });
    
    if (!adminExists) {
      const adminData = {
        name: 'System Administrator',
        email: adminEmail,
        password: 'Admin@123',
        role: 'admin',
        isActive: true
      };
      
      // Create admin (password will be hashed by pre-save middleware)
      const admin = new this(adminData);
      await admin.save();
      
      console.log('🎉 Default Admin Created!');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Password: Admin@123');
      console.log('👑 Role: admin');
    }
  } catch (error) {
    console.error('Error ensuring admin exists:', error);
  }
};

module.exports = mongoose.model('User', UserSchema);