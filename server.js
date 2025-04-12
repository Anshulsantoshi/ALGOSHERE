require("dotenv").config();
const express = require("express");
const passport = require("passport");
const SpotifyStrategy = require("passport-spotify").Strategy;
const session = require("express-session");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));

// CORS Setup
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
        let user = await User.findOne({ spotify_id: profile.id });

        if (!user) {
          user = new User({
            spotify_id: profile.id,
            display_name: profile.displayName || "Unknown",
            email: profile.emails?.[0]?.value || `noemail-${profile.id}@spotify.com`,
            top_artists: [],
            top_tracks: [],
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

// Serialize/Deserialize
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

// Top Artists
app.get("/api/spotify/top-artists", async (req, res) => {
  if (!req.user || !req.user.accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const response = await axios.get("https://api.spotify.com/v1/me/top/artists", {
      headers: { Authorization: `Bearer ${req.user.accessToken}` },
    });

    await User.findOneAndUpdate(
      { spotify_id: req.user.profile.id },
      { top_artists: response.data.items },
      { new: true }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch top artists" });
  }
});

// Top Tracks
app.get("/api/spotify/top-tracks", async (req, res) => {
  if (!req.user || !req.user.accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const response = await axios.get("https://api.spotify.com/v1/me/top/tracks", {
      headers: { Authorization: `Bearer ${req.user.accessToken}` },
    });

    await User.findOneAndUpdate(
      { spotify_id: req.user.profile.id },
      { top_tracks: response.data.items },
      { new: true }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch top tracks" });
  }
});

// Dummy Events
app.get("/api/spotify/upcoming-events", async (req, res) => {
  if (!req.user || !req.user.accessToken) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const mockEvents = [
    {
      name: "Concert 1",
      date: "25th Oct 2023",
      location: "Mumbai",
      image: "https://example.com/concert1.jpg",
    },
    {
      name: "Concert 2",
      date: "30th Oct 2023",
      location: "Delhi",
      image: "https://example.com/concert2.jpg",
    },
  ];

  res.json(mockEvents);
});

// Dashboard
app.get("/dashboard", (req, res) => {
  if (req.isAuthenticated()) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  } else {
    res.redirect("/auth/spotify");
  }
});

// Events Route
const eventRoutes = require("./route/events");
app.use("/api", eventRoutes);

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
