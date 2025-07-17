import mongoose from 'mongoose';

const LiveClassLinkSchema = new mongoose.Schema({
  url: { type: String, required: true },
  title: { type: String, required: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

export default mongoose.model('LiveClassLink', LiveClassLinkSchema); 