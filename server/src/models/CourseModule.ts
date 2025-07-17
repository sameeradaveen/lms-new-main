import mongoose from 'mongoose';

const ResourceSchema = new mongoose.Schema({
  type: { type: String, enum: ['pdf', 'video', 'ppt', 'link', 'quiz'], required: true },
  url: { type: String, required: true },
  name: { type: String, required: true }
});

const CourseModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  track: { type: String, enum: ['fullstack', 'cybersecurity'], required: true },
  resources: [ResourceSchema],
  pdfUrl: { type: String },
  quizzes: [{ type: mongoose.Schema.Types.Mixed }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('CourseModule', CourseModuleSchema); 