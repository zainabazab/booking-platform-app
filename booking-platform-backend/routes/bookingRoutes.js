const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');

// Utility function to check for existing, confirmed bookings
const checkDoubleBooking = async (serviceId, date, time) => {
  const existingBooking = await Booking.findOne({
    service: serviceId,
    date: date,
    time: time,
    status: 'booked', // Only check against confirmed bookings
  });
  return existingBooking;
};

// @route   POST /api/bookings
// @desc    Create a new booking (protected route)
router.post('/', auth, async (req, res) => {
  const { serviceId, date, time } = req.body;

  try {
    // 1. --- Prevent Double Booking ---
    const isDoubleBooking = await checkDoubleBooking(serviceId, date, time);
    if (isDoubleBooking) {
      // 🟢 STEP 6: Error Handling - Slot unavailable
      return res.status(409).json({ // 409 Conflict
        msg: 'Slot unavailable errors: This service slot is already booked. Please choose another time.' 
      }); 
    }

    // 2. Create the booking instance
    const newBooking = new Booking({
      service: serviceId,
      user: req.user.id, // User ID from the JWT payload attached by the 'auth' middleware
      date: new Date(date), // Ensure date is a Date object
      time,
      status: 'booked'
    });

    // 3. Save the booking
    const booking = await newBooking.save();
    
    // Optional: Populate service/user info for a richer response
    await booking.populate('service', 'name durationMinutes');

    res.json(booking);

  } catch (err) {
    console.error(err.message);
    // 🟢 STEP 6: Error Handling - Validation errors (e.g., serviceId not found)
    res.status(500).send('Server Error: Failed to create booking.');
  }
});

// @route   GET /api/bookings/me
// @desc    View user's own bookings (protected route)
router.get('/me', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate('service', 'name description durationMinutes price')
      .sort({ date: 1, time: 1 }); // Sort by date and time
      
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/bookings/cancel/:id
// @desc    Cancel a booking (protected route)
router.put('/cancel/:id', auth, async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ msg: 'Booking not found' });
    }

    // Security Check: Only the owner can cancel or an admin (if implemented)
    if (booking.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized to cancel this booking' });
    }

    // Prevent canceling an already canceled/completed booking
    if (booking.status !== 'booked') {
        return res.status(400).json({ msg: `Cannot cancel a booking with status: ${booking.status}` });
    }

    booking.status = 'canceled';
    await booking.save();
    
    res.json({ msg: 'Booking canceled successfully', booking });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;