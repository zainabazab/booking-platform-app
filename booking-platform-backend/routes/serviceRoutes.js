const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const auth = require('../middleware/auth'); 

// @route   POST /api/services
// @desc    Create a new service (Protected: requires auth)
router.post('/', auth, async (req, res) => {
  const { name, description, durationMinutes, price } = req.body;

  try {
    const newService = new Service({
      name,
      description,
      durationMinutes,
      price
    });

    const service = await newService.save();
    res.status(201).json(service);

  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) { // MongoDB duplicate key error (for 'name')
        return res.status(400).json({ msg: 'Service with this name already exists.' });
    }
    res.status(500).send('Server Error: Failed to create service.');
  }
});

// @route   GET /api/services
// @desc    Get all available services (Public route)
router.get('/', async (req, res) => {
  try {
    const services = await Service.find().sort({ name: 1 });
    res.json(services);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error: Failed to retrieve services.');
  }
});

// @route   GET /api/services/:id
// @desc    Get a specific service by ID (Public route)
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ msg: 'Service not found' });
    }

    res.json(service);
  } catch (err) {
    console.error(err.message);
    // Handle invalid ID format (e.g., if ID is not a valid MongoDB ObjectId)
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ msg: 'Service not found (Invalid ID format)' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;