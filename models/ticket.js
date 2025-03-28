const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    allocation_status: { type: String, default: 'pending' },
    created_at: { type: Date, default: Date.now },
    
});

module.exports = mongoose.model('Ticket', ticketSchema);