// QR Code Generator
function generateQR(text) {
  if (document.getElementById('qrcode')) {
    document.getElementById('qrcode').innerHTML = '';
    new QRCode(document.getElementById('qrcode'), {
      text: text,
      width: 128,
      height: 128
    });
  }
}

// Sidebar Toggle Functionality
const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebar = document.querySelector('.sidebar');
const mainContent = document.querySelector('.main-content');

sidebarToggle.addEventListener('click', () => {
  sidebar.classList.toggle('open');
  mainContent.classList.toggle('sidebar-open');
});

// Sidebar Close Button Functionality
const sidebarClose = document.getElementById('sidebar-close');

sidebarClose.addEventListener('click', () => {
  sidebar.classList.remove('open');
  mainContent.classList.remove('sidebar-open');
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
document.getElementById('home-link').addEventListener('click', (e) => {
  e.preventDefault();
  showSection('home-section');
});

document.getElementById('events-link').addEventListener('click', (e) => {
  e.preventDefault();
  showSection('events-section');
});

document.getElementById('artists-link').addEventListener('click', (e) => {
  e.preventDefault();
  showSection('artists-section');
});

document.getElementById('tracks-link').addEventListener('click', (e) => {
  e.preventDefault();
  showSection('tracks-section');
});

document.getElementById('tickets-link').addEventListener('click', (e) => {
  e.preventDefault();
  showSection('tickets-section');
});

document.getElementById('profile-link').addEventListener('click', (e) => {
  e.preventDefault();
  showSection('profile-section');
});

document.getElementById('support-link').addEventListener('click', (e) => {
  e.preventDefault();
  showSection('support-section');
});

// Format date nicely
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

// Modal functionality
const modal = document.getElementById('booking-modal');
const closeModal = document.querySelector('.close-modal');

if (closeModal) {
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
  });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
  }
});

// Book Now Button Event Handler
function setupBookButtons() {
  const bookButtons = document.querySelectorAll('.event-card button[data-event-id]');
  bookButtons.forEach(button => {
    button.addEventListener('click', async (e) => {
      const eventId = e.target.getAttribute('data-event-id');
      
      try {
        // Fetch event details
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) throw new Error('Failed to fetch event details');
        
        const event = await response.json();
        
        // Populate modal with event details
        document.getElementById('booking-event-name').textContent = event.eventName;
        document.getElementById('booking-event-artist').textContent = `Artist: ${event.artistName}`;
        document.getElementById('booking-event-date').textContent = `Date: ${formatDate(event.date)}`;
        document.getElementById('booking-event-venue').textContent = `Venue: ${event.venue}`;
        document.getElementById('booking-event-price').textContent = `Price: ₹${event.ticketPrice} per ticket`;
        document.getElementById('booking-tickets-available').textContent = 
          `Available: ${event.availableTickets} out of ${event.totalTickets}`;
        
        // Set event ID in hidden field
        document.getElementById('booking-event-id').value = event.eventId;
        
        // Calculate initial total
        const quantity = document.getElementById('ticket-quantity').value;
        document.getElementById('ticket-total').textContent = (quantity * event.ticketPrice).toFixed(2);
        
        // Show modal
        modal.style.display = 'block';
        
      } catch (error) {
        console.error('Error getting event details:', error);
        alert('Could not load event details. Please try again later.');
      }
    });
  });
  
  // Handle quantity change - update total price
  const quantityInput = document.getElementById('ticket-quantity');
  if (quantityInput) {
    quantityInput.addEventListener('change', async () => {
      const eventId = document.getElementById('booking-event-id').value;
      try {
        const response = await fetch(`/api/events/${eventId}`);
        if (!response.ok) throw new Error('Failed to fetch event details');
        
        const event = await response.json();
        const quantity = quantityInput.value;
        
        document.getElementById('ticket-total').textContent = (quantity * event.ticketPrice).toFixed(2);
      } catch (error) {
        console.error('Error updating price:', error);
      }
    });
  }
  
  // Handle booking form submission
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const eventId = document.getElementById('booking-event-id').value;
      const tickets = parseInt(document.getElementById('ticket-quantity').value);
      
      try {
        const response = await fetch('/api/book-ticket', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ eventId, tickets })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.message || 'Failed to book tickets');
        }
        
        alert('Tickets booked successfully!');
        modal.style.display = 'none';
        
        // Refresh events display
        fetchEvents();
        
      } catch (error) {
        console.error('Error booking tickets:', error);
        alert(`Booking failed: ${error.message}`);
      }
    });
  }
}

// Fetch and Display Events from the database
async function fetchEvents() {
  try {
    const eventsContainer = document.getElementById('events-list');
    const upcomingEventsContainer = document.getElementById('upcoming-events');
    
    // Show loading state
    if (eventsContainer) {
      eventsContainer.innerHTML = '<div class="loading">Loading events...</div>';
    }
    if (upcomingEventsContainer) {
      upcomingEventsContainer.innerHTML = '<div class="loading">Loading events...</div>';
    }
    
    const response = await fetch('/api/events');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const events = await response.json();
    
    // Clear loading state
    if (eventsContainer) {
      eventsContainer.innerHTML = '';
    }
    if (upcomingEventsContainer) {
      upcomingEventsContainer.innerHTML = '';
    }
    
    if (events.length === 0) {
      if (eventsContainer) {
        eventsContainer.innerHTML = '<div class="empty-state">No events found</div>';
      }
      if (upcomingEventsContainer) {
        upcomingEventsContainer.innerHTML = '<div class="empty-state">No upcoming events</div>';
      }
      return;
    }
    
    // Process events for both containers
    events.forEach((event, index) => {
      // Create event card for the events section (horizontal layout)
      if (eventsContainer) {
        const eventCard = createEventCard(event, true);
        eventsContainer.appendChild(eventCard);
      }
      
      // Only add the first 4 events to the upcoming events on home page
      if (upcomingEventsContainer && index < 4) {
        const upcomingEventCard = createEventCard(event, false);
        upcomingEventsContainer.appendChild(upcomingEventCard);
      }
    });
    
    // Setup book buttons after adding events to the DOM
    setupBookButtons();
    
  } catch (error) {
    console.error('Error fetching events:', error);
    if (document.getElementById('events-list')) {
      document.getElementById('events-list').innerHTML = 
        '<div class="empty-state">Failed to load events. Please try again later.</div>';
    }
    if (document.getElementById('upcoming-events')) {
      document.getElementById('upcoming-events').innerHTML = 
        '<div class="empty-state">Failed to load events. Please try again later.</div>';
    }
  }
}

// Helper function to create event cards
function createEventCard(event, isHorizontal) {
  const eventCard = document.createElement('div');
  eventCard.classList.add('event-card');
  
  // Use a default image if none is provided
  const imageUrl = event.imageUrl || '/images/concert-placeholder.jpg';
  
  if (isHorizontal) {
    // Horizontal layout for events page
    eventCard.innerHTML = `
      <img src="${imageUrl}" alt="${event.eventName}">
      <div class="event-details">
        <h4>${event.eventName}</h4>
        <p><strong>Artist:</strong> ${event.artistName}</p>
        <p><strong>Date:</strong> ${formatDate(event.date)}</p>
        <p><strong>Venue:</strong> ${event.venue}</p>
        <p><strong>Price:</strong> ₹${event.ticketPrice}</p>
        <p><strong>Available Tickets:</strong> ${event.availableTickets}/${event.totalTickets}</p>
        <button data-event-id="${event.eventId}">Book Now</button>
      </div>
    `;
  } else {
    // Vertical layout for homepage
    eventCard.innerHTML = `
      <img src="${imageUrl}" alt="${event.eventName}">
      <h4>${event.eventName}</h4>
      <p>${event.artistName}</p>
      <p>${formatDate(event.date)}</p>
      <p>${event.venue}</p>
      <button data-event-id="${event.eventId}">Book Now</button>
    `;
  }
  
  return eventCard;
}

// Support Form Handler
const supportForm = document.getElementById('support-form');
if (supportForm) {
  supportForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // This would typically make an API call to submit the support request
    alert(`Support request submitted!\nSubject: ${subject}\nWe'll get back to you soon.`);
    supportForm.reset();
  });
}

// Fetch User Data and Spotify Data
document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Fetch User Data
    const userRes = await fetch("/debug", { credentials: "include" });
    const userData = await userRes.json();

    if (!userData.user) {
      console.log("No user data found, redirecting to login");
      window.location.href = "/";
      return;
    }

    // Update User Profile Section
    const { profile } = userData.user;
    document.getElementById("username").innerText = `Welcome, ${profile.displayName || "User"}`;
    document.getElementById("user-email").innerText = profile.emails?.[0]?.value || "Gold Member";
    
    // Also update profile section
    document.getElementById("profile-name").innerText = profile.displayName || "User";
    document.getElementById("profile-email").innerText = profile.emails?.[0]?.value || "Not available";
    
    // Set avatar with a fallback
    const avatarUrl = profile.photos?.[0]?.value || "/images/avatar-placeholder.jpg";
    
    const avatarElement = document.getElementById("user-avatar");
    if (avatarElement) {
      avatarElement.src = avatarUrl;
      avatarElement.onerror = function() {
        this.src = "/images/avatar-placeholder.jpg";
      };
    }
    
    const profileAvatarElement = document.getElementById("profile-avatar");
    if (profileAvatarElement) {
      profileAvatarElement.src = avatarUrl;
      profileAvatarElement.onerror = function() {
        this.src = "/images/avatar-placeholder.jpg";
      };
    }

    // Fetch Events
    await fetchEvents();
    
    try {
      // Fetch Top Artists
      const artistRes = await fetch("/api/spotify/top-artists", { credentials: "include" });
      const artistData = await artistRes.json();

      const artistList = document.getElementById("top-artists");
      if (artistList) {
        if (artistData.items && artistData.items.length > 0) {
          artistData.items.forEach(artist => {
            const artistItem = document.createElement("div");
            artistItem.classList.add("event-card");
            artistItem.innerHTML = `
              <img src="${artist.images[0]?.url || '/images/artist-placeholder.jpg'}" alt="${artist.name}">
              <h4>${artist.name}</h4>
              <p>Popularity: ${artist.popularity}</p>
            `;
            artistList.appendChild(artistItem);
          });
        } else {
          artistList.innerHTML = '<div class="empty-state">No top artists found</div>';
        }
      }
    } catch (artistError) {
      console.error("Error fetching top artists:", artistError);
      if (document.getElementById("top-artists")) {
        document.getElementById("top-artists").innerHTML = 
          '<div class="empty-state">Could not load artist data</div>';
      }
    }
    
    try {
      // Fetch Top Tracks
      const trackRes = await fetch("/api/spotify/top-tracks", { credentials: "include" });
      const trackData = await trackRes.json();

      const trackList = document.getElementById("top-tracks");
      if (trackList) {
        if (trackData.items && trackData.items.length > 0) {
          trackData.items.forEach(track => {
            const trackItem = document.createElement("div");
            trackItem.classList.add("event-card");
            trackItem.innerHTML = `
              <img src="${track.album.images[0]?.url || '/images/track-placeholder.jpg'}" alt="${track.name}">
              <h4>${track.name}</h4>
              <p>Artist: ${track.artists[0]?.name}</p>
            `;
            trackList.appendChild(trackItem);
          });
        } else {
          trackList.innerHTML = '<div class="empty-state">No top tracks found</div>';
        }
      }
    } catch (trackError) {
      console.error("Error fetching top tracks:", trackError);
      if (document.getElementById("top-tracks")) {
        document.getElementById("top-tracks").innerHTML = 
          '<div class="empty-state">Could not load track data</div>';
      }
    }

    // Try to calculate fan score
    try {
      const fanScoreElement = document.getElementById('fan-score');
      if (fanScoreElement) {
        // This would typically come from your user profile or be calculated
        // For now we'll just set a placeholder value
        const randomScore = Math.floor(Math.random() * 50) + 50; // Random score between 50-100
        fanScoreElement.textContent = randomScore;
      }
    } catch (err) {
      console.error("Error setting fan score:", err);
    }

  } catch (err) {
    console.error("Error fetching data:", err);
  }
});
