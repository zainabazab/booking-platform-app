const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  // serviceId: Reference to the Service model
  service: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Service', 
    required: true 
  },
  // userId: Reference to the User model
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  // Date and Time fields for the booking slot
  date: { type: Date, required: true },
  time: { type: String, required: true }, // Store as HH:MM string (e.g., "10:30")
  
  // Status field
  status: { 
    type: String, 
    enum: ['booked', 'canceled', 'completed'], 
    default: 'booked' 
  },
  
  // To prevent double booking easily, you can add an index.
  // We'll handle the logic in the controller, but this is good practice.
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);