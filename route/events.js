const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Get all events
router.get('/events', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 }); // Sort by date ascending
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get event by ID
router.get('/events/:eventId', async (req, res) => {
  try {
    const event = await Event.findOne({ eventId: req.params.eventId });
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Book tickets endpoint
router.post('/book-ticket', async (req, res) => {
  try {
    const { eventId, tickets } = req.body;
    
    if (!eventId || !tickets || tickets < 1) {
      return res.status(400).json({ message: 'Invalid request' });
    }
    
    const event = await Event.findOne({ eventId });
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    if (event.availableTickets < tickets) {
      return res.status(400).json({ message: 'Not enough tickets available' });
    }
    
    // Update available tickets
    event.availableTickets -= tickets;
    await event.save();
    
    // In a real app, you'd also create a ticket record for the user
    
    res.json({ 
      success: true, 
      message: `Successfully booked ${tickets} tickets for ${event.eventName}`,
      event 
    });
    
  } catch (error) {
    console.error('Error booking tickets:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
