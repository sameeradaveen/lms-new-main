import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'admin'], required: true },
  track: { 
    type: String, 
    enum: ['fullstack', 'cybersecurity'], 
    required: function(this: any) { return this.role === 'student'; } // Only required for students
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', UserSchema); 