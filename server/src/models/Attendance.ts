import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  checkedIn: { type: Boolean, default: false },
  time: { type: String }
});

export default mongoose.model('Attendance', AttendanceSchema); 