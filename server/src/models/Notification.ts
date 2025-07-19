import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['class_timing', 'deadline', 'assignment_upload', 'general', 'urgent'], 
    required: true 
  },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'], 
    default: 'medium' 
  },
  isRead: { type: Boolean, default: false },
  scheduledFor: { type: Date }, // For scheduled notifications
  expiresAt: { type: Date }, // Auto-expire notifications
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // For specific notification types
  relatedData: {
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    assignmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
    liveClassId: { type: mongoose.Schema.Types.ObjectId, ref: 'LiveClassLink' }
  }
});

export default mongoose.model('Notification', NotificationSchema); 