import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import nodemailer from "nodemailer";
import bookRoutes from "./routes/bookRoutes.js";
import userRoutes from "./routes/userRoutes.js";


// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(); // Load environment variables
const app = express();

// Middleware
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json()); // For parsing JSON requests
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve static files

// Logging Middleware
app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.path}`);
  console.log("Request Headers:", req.headers);
  console.log("Request Body:", req.body);
  next();
});

// Email Sending Route
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
    secure: false,  // Use TLS
  auth: {
    user:'jinusaju05@gmail.com', // Store in .env file
    pass:'gdmazmsojiztfsxj'  // Store in .env file
  },
});
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.post("/send-email", (req, res) => {
  const { to, subject, text, html } = req.body;

  const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error("Error sending email:", error);
          return res.status(500).send("Error sending email");
      }
      res.status(200).send("Email sent successfully");
  });
});
app.get("/", (req, res) => {
  res.send("Backend is running successfully");
});





// 404 Handler
app.use((req, res) => {
  console.log("Unhandled Route:", req.path);
  res.status(404).json({
    message: "Route not found",
    path: req.path,
    method: req.method
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err);
  res.status(500).json({
    message: "An unexpected error occurred",
    error: err.message
  });
});

// Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Listening for requests on http://localhost:${PORT}`);
});
