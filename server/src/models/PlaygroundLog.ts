import mongoose from 'mongoose';

const PlaygroundLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  language: { type: String, required: true },
  code: { type: String, required: true },
  input: { type: String },
  output: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('PlaygroundLog', PlaygroundLogSchema); 