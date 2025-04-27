const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventId: { type: String, required: true },
  artistName: { type: String, required: true },
  eventName: { type: String, required: true },
  date: { type: Date, required: true },
  venue: { type: String, required: true },
  ticketPrice: { type: Number, required: true },
  totalTickets: { type: Number, required: true },
  availableTickets: { type: Number, required: true },
  imageUrl: { type: String, default: "/images/concert-placeholder.jpg" } // Default image
});

// Add virtual property for formatted date
eventSchema.virtual('formattedDate').get(function() {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return this.date.toLocaleDateString('en-US', options);
});

// Ensure virtuals are included when converting to JSON
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
