import mongoose from 'mongoose';

const LiveClassLinkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  platform: { 
    type: String, 
    enum: ['Google Meet', 'Zoom', 'Microsoft Teams', 'Other'], 
    required: true 
  },
  description: { type: String },
  scheduledDate: { type: Date },
  scheduledTime: { type: String },
  active: { type: Boolean, default: true },
  autoHide: { type: Boolean, default: false },
  hideAfterHours: { type: Number, default: 24 }, // Hide after X hours
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.model('LiveClassLink', LiveClassLinkSchema); 