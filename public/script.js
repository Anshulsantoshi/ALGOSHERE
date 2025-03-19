// QR Code Generator
const qrCode = new QRCode(document.getElementById('qrcode'), {
  text: 'https://example.com/ticket/123',
  width: 128,
  height: 128
});

// Book Now Button Functionality
const bookButtons = document.querySelectorAll('.event-card button');
bookButtons.forEach(button => {
  button.addEventListener('click', () => {
    alert('Ticket booked successfully!');
  });
});

// Sidebar Toggle Functionality
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');

sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  mainContent.classList.toggle('sidebar-open'); // Add this line
});

// Sidebar Close Button Functionality
const sidebarClose = document.getElementById('sidebar-close');

sidebarClose.addEventListener('click', () => {
  sidebar.classList.remove('open');
  mainContent.classList.remove('sidebar-open'); // Add this line
});

// Function to switch between sections
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll('.content-section').forEach(section => {
    section.classList.remove('active');
  });

  // Show the selected section
  document.getElementById(sectionId).classList.add('active');
}

// Sidebar Links Event Listeners
document.getElementById('home-link').addEventListener('click', () => {
  showSection('home-section');
});

document.getElementById('events-link').addEventListener('click', () => {
  showSection('events-section');
});

document.getElementById('artists-link').addEventListener('click', () => {
  showSection('artists-section');
});

document.getElementById('tracks-link').addEventListener('click', () => {
  showSection('tracks-section');
});

document.getElementById('tickets-link').addEventListener('click', () => {
  showSection('tickets-section');
});

document.getElementById('profile-link').addEventListener('click', () => {
  showSection('profile-section');
});

document.getElementById('support-link').addEventListener('click', () => {
  showSection('support-section');
});

// Fetch User Data and Spotify Data
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Fetch User Data
    const userRes = await fetch("/debug", { credentials: "include" });
    const userData = await userRes.json();

    if (!userData.user) {
      window.location.href = "/"; // Redirect to home if no user data
      return;
    }

    // Update User Profile Section
    const { profile } = userData.user;
    document.getElementById("username").innerText = `Welcome, ${profile.displayName || "User"}`;
    document.getElementById("user-email").innerText = profile.emails?.[0] || "Gold Member";
    document.getElementById("user-avatar").src = profile.photos?.[0] || "images/52eabf633ca6414e60a7677b0b917d92-male-avatar-maker.webp";

    // Fetch Top Artists
    const artistRes = await fetch("/api/spotify/top-artists", { credentials: "include" });
    const artistData = await artistRes.json();

    const artistList = document.getElementById("top-artists");
    if (artistData.items) {
      artistData.items.forEach(artist => {
        const artistItem = document.createElement("div");
        artistItem.classList.add("event-card");
        artistItem.innerHTML = `
          <img src="${artist.images[0]?.url}" alt="${artist.name}">
          <h4>${artist.name}</h4>
          <p>Popularity: ${artist.popularity}</p>
        `;
        artistList.appendChild(artistItem);
      });
    }
    
    const saveUserData = async (spotify_id, email, top_artists, top_tracks) => {
      try {
          const response = await fetch('http://localhost:5000/save-user-data', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ spotify_id, email, top_artists, top_tracks }),
          });
  
          const data = await response.json();
          console.log('User data saved:', data);
      } catch (err) {
          console.error('Error saving user data:', err);
      }
    };
  
    // Call this function after fetching user data from Spotify
    const spotify_id = 'user_spotify_id'; // Replace with actual Spotify ID
    const email = 'user_email'; // Replace with actual email
    const top_artists = [/* Array of top artists */];
    const top_tracks = [/* Array of top tracks */];
  
    saveUserData(spotify_id, email, top_artists, top_tracks);
    
  
    // Fetch Top Tracks
    const trackRes = await fetch("/api/spotify/top-tracks", { credentials: "include" });
    const trackData = await trackRes.json();

    const trackList = document.getElementById("top-tracks");
    if (trackData.items) {
      trackData.items.forEach(track => {
        const trackItem = document.createElement("div");
        trackItem.classList.add("event-card");
        trackItem.innerHTML = `
          <img src="${track.album.images[0]?.url}" alt="${track.name}">
          <h4>${track.name}</h4>
          <p>Artist: ${track.artists[0]?.name}</p>
        `;
        trackList.appendChild(trackItem);
      });
    }

    // Fetch Upcoming Events
    const eventRes = await fetch("/api/spotify/upcoming-events", { credentials: "include" });
    const eventData = await eventRes.json();

    // Add events to both home page and events page
    const upcomingEventsList = document.getElementById("upcoming-events");
    const eventsListSection = document.getElementById("events-list");
    
    if (eventData) {
      // Add to upcoming events on home page
      eventData.forEach(event => {
        const eventItem = document.createElement("div");
        eventItem.classList.add("event-card");
        eventItem.innerHTML = `
          <img src="${event.image}" alt="${event.name}">
          <h4>${event.name}</h4>
          <p>Date: ${event.date}</p>
          <p>Location: ${event.location}</p>
        `;
        upcomingEventsList.appendChild(eventItem);
        
        // Add to events page with horizontal layout
        const eventItemHorizontal = document.createElement("div");
        eventItemHorizontal.classList.add("event-card");
        eventItemHorizontal.innerHTML = `
          <img src="${event.image}" alt="${event.name}">
          <div class="event-details">
            <h4>${event.name}</h4>
            <p>Date: ${event.date}</p>
            <p>Location: ${event.location}</p>
            <button>Book Now</button>
          </div>
        `;
        eventsListSection.appendChild(eventItemHorizontal);
      });
    }

  } catch (err) {
    console.error("Error fetching data:", err);
  }
});