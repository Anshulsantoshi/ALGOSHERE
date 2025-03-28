const mongoose = require('mongoose');
const Event = require('./models/Event');

// Connect to MongoDB (use your existing db.js logic)
mongoose.connect('mongodb://localhost:27017/ticketPlatform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

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
  },
  {
    eventId: 'event2',
    artistName: 'Neha Kakkar',
    eventName: 'Neha Kakkar Live',
    date: new Date('2023-12-20T18:30:00'),
    venue: 'Mumbai Arena',
    ticketPrice: 2000,
    totalTickets: 800,
    availableTickets: 800,
  },
  {
    eventId: 'event3',
    artistName: 'Badshah',
    eventName: 'Badshah Night',
    date: new Date('2023-12-25T20:00:00'),
    venue: 'Bangalore Palace',
    ticketPrice: 2500,
    totalTickets: 1200,
    availableTickets: 1200,
  },
  {
    eventId: 'event11',
    artistName: 'KK',
    eventName: 'KK Tribute Night',
    date: new Date('2024-07-05T19:30:00'),
    venue: 'Indore Arena',
    ticketPrice: 1300,
    totalTickets: 900,
    availableTickets: 900
},
{
    eventId: 'event12',
    artistName: 'Amit Trivedi',
    eventName: 'Amit Trivedi Musical Journey',
    date: new Date('2024-08-15T20:00:00'),
    venue: 'Goa Beach Festival',
    ticketPrice: 2100,
    totalTickets: 850,
    availableTickets: 850
},
{
    eventId: 'event13',
    artistName: 'Pritam',
    eventName: 'Pritam Live Orchestra',
    date: new Date('2024-09-10T19:00:00'),
    venue: 'Nagpur Music Fest',
    ticketPrice: 1800,
    totalTickets: 950,
    availableTickets: 950
},
{
    eventId: 'event14',
    artistName: 'Rahat Fateh Ali Khan',
    eventName: 'Sufi Night with Rahat',
    date: new Date('2024-10-05T20:30:00'),
    venue: 'Varanasi Ghat Concert',
    ticketPrice: 3000,
    totalTickets: 1000,
    availableTickets: 1000
},
{
    eventId: 'event15',
    artistName: 'Rekha Bhardwaj',
    eventName: 'Rekha Bhardwaj Gazal Night',
    date: new Date('2024-11-20T19:45:00'),
    venue: 'Bhopal Auditorium',
    ticketPrice: 2500,
    totalTickets: 700,
    availableTickets: 700
},
{
    eventId: 'event16',
    artistName: 'Mika Singh',
    eventName: 'Mika Singh Dhamaka',
    date: new Date('2024-12-25T21:00:00'),
    venue: 'Noida Rock Fest',
    ticketPrice: 2000,
    totalTickets: 1100,
    availableTickets: 1100
},
{
    eventId: 'event17',
    artistName: 'Vishal-Shekhar',
    eventName: 'Vishal-Shekhar Live',
    date: new Date('2025-01-15T20:00:00'),
    venue: 'Gurgaon Music Dome',
    ticketPrice: 2400,
    totalTickets: 900,
    availableTickets: 900
},
{
    eventId: 'event18',
    artistName: 'Shankar Mahadevan',
    eventName: 'Shankar Mahadevan Fusion Night',
    date: new Date('2025-02-10T19:30:00'),
    venue: 'Coimbatore Cultural Fest',
    ticketPrice: 2200,
    totalTickets: 800,
    availableTickets: 800
},
{
    eventId: 'event19',
    artistName: 'Ankit Tiwari',
    eventName: 'Ankit Tiwari Melody Night',
    date: new Date('2025-03-25T19:00:00'),
    venue: 'Surat Grand Hall',
    ticketPrice: 1700,
    totalTickets: 950,
    availableTickets: 950
},
{
    eventId: 'event20',
    artistName: 'A.R. Rahman',
    eventName: 'A.R. Rahman Live in Concert',
    date: new Date('2025-04-20T20:00:00'),
    venue: 'Chennai Stadium',
    ticketPrice: 5000,
    totalTickets: 1500,
    availableTickets: 1500
},
{
    eventId: 'event21',
    artistName: 'Salim-Sulaiman',
    eventName: 'Salim-Sulaiman Musical Extravaganza',
    date: new Date('2025-05-05T19:30:00'),
    venue: 'Ranchi Cultural Hall',
    ticketPrice: 2300,
    totalTickets: 750,
    availableTickets: 750
},
{
    eventId: 'event22',
    artistName: 'Hariharan',
    eventName: 'Hariharan Classical Evening',
    date: new Date('2025-06-15T20:00:00'),
    venue: 'Mysore Palace Grounds',
    ticketPrice: 2800,
    totalTickets: 600,
    availableTickets: 600
},
{
    eventId: 'event23',
    artistName: 'Shilpa Rao',
    eventName: 'Shilpa Rao Unplugged',
    date: new Date('2025-07-10T19:00:00'),
    venue: 'Patna Concert Hall',
    ticketPrice: 1900,
    totalTickets: 800,
    availableTickets: 800
},
{
    eventId: 'event24',
    artistName: 'Mohit Chauhan',
    eventName: 'Mohit Chauhan Indie Night',
    date: new Date('2025-08-20T20:30:00'),
    venue: 'Dehradun Music Festival',
    ticketPrice: 2600,
    totalTickets: 850,
    availableTickets: 850
},
{
    eventId: 'event25',
    artistName: 'Kailash Kher',
    eventName: 'Kailash Kher Sufi Vibes',
    date: new Date('2025-09-05T19:30:00'),
    venue: 'Shimla Open Grounds',
    ticketPrice: 2700,
    totalTickets: 700,
    availableTickets: 700
},

{
    eventId: 'event1',
    artistName: 'Arijit Singh',
    eventName: 'Arijit Live in Concert',
    date: new Date('2023-12-15T19:00:00'),
    venue: 'Delhi Stadium',
    ticketPrice: 1500,
    totalTickets: 1000,
    availableTickets: 1000
},
{
    eventId: 'event2',
    artistName: 'Neha Kakkar',
    eventName: 'Neha Kakkar Night',
    date: new Date('2023-11-20T18:30:00'),
    venue: 'Mumbai Arena',
    ticketPrice: 1200,
    totalTickets: 800,
    availableTickets: 800
},
{
    eventId: 'event3',
    artistName: 'Diljit Dosanjh',
    eventName: 'Diljit Live',
    date: new Date('2023-10-10T20:00:00'),
    venue: 'Chandigarh Stadium',
    ticketPrice: 2000,
    totalTickets: 1200,
    availableTickets: 1200
},
{
    eventId: 'event4',
    artistName: 'Badshah',
    eventName: 'Badshah Rap Show',
    date: new Date('2023-09-05T21:00:00'),
    venue: 'Bangalore Open Air',
    ticketPrice: 1800,
    totalTickets: 900,
    availableTickets: 900
},
{
    eventId: 'event5',
    artistName: 'Shreya Ghoshal',
    eventName: 'Shreya Ghoshal Symphony',
    date: new Date('2024-01-10T19:30:00'),
    venue: 'Hyderabad Auditorium',
    ticketPrice: 2500,
    totalTickets: 1100,
    availableTickets: 1100
},
{
    eventId: 'event6',
    artistName: 'Sonu Nigam',
    eventName: 'Sonu Nigam Melodies',
    date: new Date('2024-02-15T20:00:00'),
    venue: 'Kolkata Stadium',
    ticketPrice: 1700,
    totalTickets: 1000,
    availableTickets: 1000
},
{
    eventId: 'event7',
    artistName: 'Jubin Nautiyal',
    eventName: 'Jubin Nautiyal Live',
    date: new Date('2024-03-05T19:00:00'),
    venue: 'Pune Concert Hall',
    ticketPrice: 1400,
    totalTickets: 850,
    availableTickets: 850
},
{
    eventId: 'event8',
    artistName: 'Guru Randhawa',
    eventName: 'Guru Randhawa Night',
    date: new Date('2024-04-10T20:30:00'),
    venue: 'Ahmedabad Dome',
    ticketPrice: 1600,
    totalTickets: 950,
    availableTickets: 950
},
{
    eventId: 'event9',
    artistName: 'B Praak',
    eventName: 'B Praak Unplugged',
    date: new Date('2024-05-15T19:30:00'),
    venue: 'Jaipur Music Hall',
    ticketPrice: 1900,
    totalTickets: 700,
    availableTickets: 700
},
{
    eventId: 'event10',
    artistName: 'Honey Singh',
    eventName: 'Yo Yo Honey Singh Show',
    date: new Date('2024-06-20T21:00:00'),
    venue: 'Lucknow Ground',
    ticketPrice: 2200,
    totalTickets: 1200,
    availableTickets: 1200
}

  
  
];

// Function to seed events
const seedEvents = async () => {
  try {
    await Event.deleteMany({}); // Clear existing events
    await Event.insertMany(fakeEvents); // Insert new events
    console.log('Events seeded successfully!');
  } catch (err) {
    console.error('Error seeding events:', err);
  } finally {
    mongoose.connection.close();
  }
};

seedEvents();