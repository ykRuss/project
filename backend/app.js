const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require("connect-flash");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3000;

// Load environment variables
dotenv.config();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Use method-override to support "_method" field in forms
app.use(methodOverride("_method"));

// Middleware to parse cookies
app.use(cookieParser());

// Enable all CORS requests (for development)
app.use(
  cors({
    origin: "http://localhost:8081",
  })
);

// Session Middleware (needed for flash messages)
app.use(
  session({
    secret: "my-very-simple-session-secret", // Choose a secret key
    resave: false,
    saveUninitialized: true,
  })
);

// Flash Middleware (use after session middleware)
app.use(flash());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  });

// View engine setup
app.set("views", "./frontend/views"); // Path to pug templates
app.set("view engine", "pug");

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", require("./routes/indexRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/goals", require("./routes/goalRoutes"));
app.use("/api/friends", require("./routes/friendRoutes"));

// Server
app.listen(PORT, () => console.log(`Server running on localhost:${PORT}`));
