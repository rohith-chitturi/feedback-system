require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const facultyRoutes = require("./routes/faculty");
const feedbackRoutes = require("./routes/feedback");
const reportRoutes = require("./routes/reports");

const app = express();


// ===============================
// ✅ CORS CONFIGURATION (IMPORTANT)
// ===============================
app.use(
  cors({
    origin: [
      "http://localhost:5500",
      "http://127.0.0.1:5500",
      "http://localhost:5000"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


// ===============================
// ✅ MIDDLEWARE
// ===============================
app.use(express.json());


// ===============================
// ✅ MONGODB CONNECTION
// ===============================
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error:", err));


// ===============================
// ✅ ROUTES
// ===============================
app.use("/api/auth", authRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/reports", reportRoutes);


// ===============================
// ✅ HEALTH CHECK ROUTE
// ===============================
app.get("/", (req, res) => {
  res.send("Feedback API Running 🚀");
});


// ===============================
// ✅ PORT FIX FOR AWS
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);