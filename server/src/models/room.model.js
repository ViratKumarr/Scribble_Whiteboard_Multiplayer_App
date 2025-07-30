const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Room name is required'],
    trim: true,
    minlength: [3, 'Room name must be at least 3 characters'],
    maxlength: [50, 'Room name cannot exceed 50 characters']
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isPrivate: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    select: false // Don't include password in query results by default
  },
  canvasState: {
    type: String,
    default: ''
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
roomSchema.pre('save', async function(next) {
  // Only hash the password if it's modified (or new) and if the room is private with a password
  if (!this.isModified('password') || !this.password) return next();
  
  try {
    // Generate salt
    const salt = await bcrypt.genSalt(10);
    // Hash password with salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
roomSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;