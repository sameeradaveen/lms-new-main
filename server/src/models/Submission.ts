import mongoose from 'mongoose';

const SubmissionSchema = new mongoose.Schema({
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answerText: String, // for text/code answers
  fileUrl: String,    // for file uploads
  submittedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Submission', SubmissionSchema); 