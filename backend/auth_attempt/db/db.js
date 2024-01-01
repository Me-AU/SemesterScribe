const mongoose = require("mongoose");

// Connection URI

// Add to envs later 
const DB_URL='mongodb+srv://ahsanullah101003:SemesterScribe@semesterscribe.xb36bb4.mongodb.net/?retryWrites=true&w=majority'
// Connect to MongoDB

mongoose.connect(DB_URL);

// Check if the connection was successful
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

module.exports = mongoose;
