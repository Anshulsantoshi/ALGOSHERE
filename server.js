require("dotenv").config();
const express = require("express");
const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;
const session = require("express-session");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

// Import database connection function
const connectDB = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors({ origin: "http://localhost:5000", credentials: true }));

// Session Setup
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ticket_platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Optional: Drop email index if error aa raha hai (run once)
// mongoose.connection.once('open', async () => {
//   try {
//     await mongoose.connection.collection("users").dropIndex("email_1");
//     console.log("✅ Dropped existing email_1 index");
//   } catch (err) {
//     console.log("ℹ️ Index may not exist:", err.message);
//   }
// });

// User Schema and Model
const userSchema = new mongoose.Schema({
  spotify_id: { type: String, required: true, unique: true },
  display_name: { type: String, required: true },
  email: { type: String, default: "N/A" },
  top_artists: { type: Array, default: [] },
  top_tracks: { type: Array, default: [] },
  fan_score: { type: Number, default: 0 },
  created_at: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// Spotify Strategy
passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/spotify/callback",
    },
    async (accessToken, refreshToken, expires_in, profile, done) => {
      try {
        // Import User model directly here to avoid circular dependencies
        const User = require('./models/User');
        
        let user = await User.findOne({ spotify_id: profile.id });

        if (!user) {
          user = new User({
            spotify_id: profile.id,
            email: profile.emails?.[0]?.value || "N/A",
          });

          await user.save();
        }

        return done(null, { profile, accessToken });
      } catch (error) {
        console.error("Database Error:", error);
        return done(error);
      }
    }
  )
);

// Serialize & Deserialize User
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Auth Routes
app.get(
  "/auth/spotify",
  passport.authenticate("spotify", {
    scope: ["user-top-read", "user-read-email"],
  })
);

app.get(
  "/auth/spotify/callback",
  passport.authenticate("spotify", {
    failureRedirect: "/auth/fail",
    successRedirect: "/dashboard",
  })
);

// Logout
app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).send("Logout Failed");
    req.session.destroy(() => {
      res.redirect("/");
    });
  });
});

// Debug route
app.get("/debug", (req, res) => {
  console.log("Session User:", req.user);
  res.json({ user: req.user || "No user in session" });
});

// Save user data endpoint
app.post('/save-user-data', async (req, res) => {
  try {
    const { spotify_id, email, top_artists, top_tracks } = req.body;
    
    const User = require('./models/User');
    const user = await User.findOneAndUpdate(
      { spotify_id },
      { 
        email,
        fan_score: calculateFanScore(top_artists, top_tracks) 
      },
      { new: true, upsert: true }
    );
    
    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error('Error saving user data:', err);
    res.status(500).json({ error: 'Failed to save user data' });
  }
});

// Helper function to calculate fan score based on top artists and tracks
function calculateFanScore(artists, tracks) {
  // Simple algorithm: score based on popularity of artists and tracks
  let score = 0;
  
  if (Array.isArray(artists)) {
    artists.forEach((artist, index) => {
      // Weight by position in list (earlier = more important)
      score += (artist.popularity || 0) * (20 - index) / 10;
    });
  }
  
  if (Array.isArray(tracks)) {
    tracks.forEach((track, index) => {
      // Weight by position in list
      score += (track.popularity || 0) * (20 - index) / 20;
    });
  }
  
  return Math.round(score);
}

// API Routes
app.use("/api/spotify", require("./route/spotify"));
app.use("/api", require("./route/events"));

// Serve Dashboard
app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    res.sendFile(path.join(__dirname, "public", "dashboard.html"));
  } else {
    res.redirect("/auth/spotify");
  }
});

// Home route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
