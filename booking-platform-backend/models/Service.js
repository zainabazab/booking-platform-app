const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  durationMinutes: { type: Number, required: true },
  price: { type: Number, required: true, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);