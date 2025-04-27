require("dotenv").config();
const mongoose = require('mongoose');
const connectDB = require('./db');

// Connect to MongoDB
connectDB();

// Import Event model
const Event = require('./models/Event');

// Event image URLs (placeholder URLs - replace with actual image URLs)
const eventImages = [
  '/images/concert1.jpg',
  '/images/concert2.jpg',
  '/images/concert3.jpg',
  '/images/concert4.jpg',
  '/images/concert5.jpg'
];

// Fake events data
const fakeEvents = [
  {
    eventId: 'event1',
    artistName: 'Arijit Singh',
    eventName: 'Arijit Live in Concert',
    date: new Date('2023-12-15T19:00:00'),
    venue: 'Delhi Stadium',
    ticketPrice: 1500,
    totalTickets: 1000,
    availableTickets: 1000,
    imageUrl: eventImages[0] || '/images/concert-placeholder.jpg'
  },
  {
    eventId: 'event2',
    artistName: 'Neha Kakkar',
    eventName: 'Neha Kakkar World Tour',
    date: new Date('2023-12-22T20:00:00'),
    venue: 'Mumbai Arena',
    ticketPrice: 2000,
    totalTickets: 800,
    availableTickets: 650,
    imageUrl: eventImages[1] || '/images/concert-placeholder.jpg'
  },
  {
    eventId: 'event3',
    artistName: 'Badshah',
    eventName: 'Badshah Rap Night',
    date: new Date('2023-12-30T21:00:00'),
    venue: 'Bengaluru Stadium',
    ticketPrice: 1800,
    totalTickets: 1200,
    availableTickets: 900,
    imageUrl: eventImages[2] || '/images/concert-placeholder.jpg'
  },
  {
    eventId: 'event4',
    artistName: 'A.R. Rahman',
    eventName: 'Rahman Musical Night',
    date: new Date('2024-01-05T19:30:00'),
    venue: 'Chennai Auditorium',
    ticketPrice: 2500,
    totalTickets: 1500,
    availableTickets: 1500,
    imageUrl: eventImages[3] || '/images/concert-placeholder.jpg'
  },
  {
    eventId: 'event5',
    artistName: 'Shreya Ghoshal',
    eventName: 'Melody Queen Live',
    date: new Date('2024-01-15T18:00:00'),
    venue: 'Hyderabad Convention Center',
    ticketPrice: 1700,
    totalTickets: 900,
    availableTickets: 750,
    imageUrl: eventImages[4] || '/images/concert-placeholder.jpg'
  },
  {
    eventId: 'event6',
    artistName: 'Divine',
    eventName: 'Gully Gang Tour',
    date: new Date('2024-01-28T20:30:00'),
    venue: 'Pune Music Arena',
    ticketPrice: 1600,
    totalTickets: 800,
    availableTickets: 800,
    imageUrl: eventImages[0] || '/images/concert-placeholder.jpg'
  },
  {
    eventId: 'event7',
    artistName: 'Sonu Nigam',
    eventName: 'Sonu Nigam Unplugged',
    date: new Date('2024-02-10T19:00:00'),
    venue: 'Kolkata Stadium',
    ticketPrice: 2200,
    totalTickets: 1100,
    availableTickets: 980,
    imageUrl: eventImages[1] || '/images/concert-placeholder.jpg'
  }
];

// Function to seed database
async function seedDatabase() {
  try {
    // Clear existing events
    await Event.deleteMany({});
    console.log('Cleared existing events from database');
    
    // Insert new events
    const result = await Event.insertMany(fakeEvents);
    console.log(`Successfully seeded ${result.length} events to database`);
    
    // Display all events
    const allEvents = await Event.find({});
    console.log('All events in database:');
    allEvents.forEach(event => {
      console.log(`- ${event.eventName} by ${event.artistName} on ${event.formattedDate}`);
    });
    
    mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
}

// Run the seeding function
seedDatabase();
