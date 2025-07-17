import mongoose from 'mongoose';

const TestCaseSchema = new mongoose.Schema({
  input: String,
  output: String,
});

const AssignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['theory', 'coding'], required: true },
  pdfUrl: String, // for theory tasks
  testCases: [TestCaseSchema], // for coding challenges
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Assignment', AssignmentSchema); 