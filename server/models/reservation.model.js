import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema({
  masterID: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '24h'
  }
});

export default mongoose.model('Reservation', ReservationSchema);
