const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    spotify_id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    fan_score: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
    
});

module.exports = mongoose.model('User', userSchema);