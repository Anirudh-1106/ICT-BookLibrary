// models/RentalRequest.js
import mongoose from 'mongoose';

const rentalRequestSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending'
  },
  requestDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const RentalRequest = mongoose.model('RentalRequest', rentalRequestSchema);
export default RentalRequest;