// server.js ya routes/events.js ke andar

const express = require("express");
const router = express.Router();
const Event = require("../models/Event");

// GET all events
router.get("/events", async (req, res) => {
  try {
    const events = await Event.find({});
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events" });
  }
});

module.exports = router;
