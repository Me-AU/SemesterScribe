// Import necessary modules and configurations
import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";
import booksRoute from "./routes/booksRoute.js";

// Create an Express application
const app = express();

// Middleware to parse incoming request body
app.use(express.json());

// Mount the 'booksRoute' router under the "/books" path
app.use("/books", booksRoute);

// Define a route for the root endpoint
app.get("/", (request, response) => {
    // Log incoming request object
    console.log(request);

    // Send a response with a status code and message
    return response.status(200).send("Time to SemScribe!");
});

// Connect to MongoDB using Mongoose
mongoose
    .connect(mongoDBURL)
    .then(() => {
        // Log a successful connection message
        console.log("\nConnected to MongoDB!");

        // Start the Express server after successfully connecting to MongoDB
        app.listen(PORT, () => {
            console.log(`App is listening on port ${PORT}!`);
        });
    })
    .catch((error) => {
        // Log an error message if connection to MongoDB fails
        console.log(error);
    });
