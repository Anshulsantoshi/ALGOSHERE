const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true },
  artistName: { type: String, required: true },
  eventName: { type: String, required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  ticketPrice: { type: Number, required: true },
  totalTickets: { type: Number, required: true },
  availableTickets: { type: Number, required: true },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;