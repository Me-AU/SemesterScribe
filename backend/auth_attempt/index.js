const express = require("express");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors"); // Import the cors package
const User = require("./models/User");
const { default: mongoose } = require("mongoose");
require("dotenv").config();

const app = express();
const port = 3003;

// Middleware to parse JSON in requests
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const DB_URL =
'mongodb+srv://ahsanullah101003:SemesterScribe@semesterscribe.xb36bb4.mongodb.net/?retryWrites=true&w=majority';
// Connect to MongoDB

mongoose.connect(DB_URL);

// Check if the connection was successful
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Secret key for JWT
const secretKey = "B315926272DB4C496427225777394D6FD0D9902D45F44EB23E047C6C11D51CB9";
const blacklistedTokens = new Set();

// ======================= MIDDLEWARES ===============================
const validateTokenMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Authorization header is missing" });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.userId = decoded.userId;
    next();
  });
};

// Middleware to check if the token is blacklisted
const isTokenBlacklisted = (req, res, next) => {
  const token = req.headers.authorization;

  if (blacklistedTokens.has(token)) {
    return res.status(401).json({ message: "Token has been blacklisted" });
  }

  next();
};

// ======================= ENDPOINTS ================== //
// Signup endpoint
app.post("/signup", async (req, res) => {
  console.log(req.body);
  const { username, password } = req.body;

  try {
    const newUser = new User({ username, password });
    await newUser.save();

    const token = jwt.sign({ userId: newUser._id }, secretKey, {
      expiresIn: "1h",
    });
    res.json({ token });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists in MongoDB
    const user = await User.findOne({ username });

    if (user && user.password == password) {
      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, secretKey, {
        expiresIn: "1h",
      });
      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.post("/logout", validateTokenMiddleware, (req, res) => {
  const token = req.headers.authorization;

  // Add the token to the blacklist
  blacklistedTokens.add(token);

  res.json({ message: "Logout successful" });
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // Exclude the password field from the response

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get(
  "/validate_token",
  validateTokenMiddleware,
  isTokenBlacklisted,
  async (req, res) => {
    // If the middleware succeeds, the token is valid & IS NOT BLACKLISTED, and req.userId is available
    // Get the user
    const user = await User.findById(req.userId);
    res.json({ message: "Token is valid", userId: req.userId, user: user });
  }
);

// ===================================== RUN THE SERVER ===================================
app.listen(port, () => {
  console.log(`AUTH SERVC Server is running on http://localhost:${port}`);
});
