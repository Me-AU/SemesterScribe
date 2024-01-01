// Import necessary modules and configurations
import express from 'express';
import { Book } from "../models/bookModel.js";

// Create an instance of an Express router
const router = express.Router();

// Define a route for creating a new book
router.post("/", async (request, response) => {
    try {
        // Validate presence of required fields (title, author, publishYear) in the request body
        if (!request.body.title || !request.body.author || !request.body.publishYear) {
            return response.status(400).send({ message: "Required fields: title, author, publishYear" });
        }

        // Create a new Book instance with data from the request body
        const newBook = new Book({
            title: request.body.title,
            author: request.body.author,
            publishYear: request.body.publishYear,
        });

        // Create the book in the MongoDB database
        const book = await Book.create(newBook);

        // Send a response with a status code indicating successful creation (201) and the created book object
        return response.status(201).send(book);
    } catch (error) {
        // Log any errors to the console
        console.log(error.message);

        // Send an error response with a status code of 500 and an error message
        response.status(500).send({ message: error.message });
    }
});

// Define a route for retrieving all books
router.get("/", async (request, response) => {
    try {
        // Retrieve all books from the MongoDB database
        const books = await Book.find({});

        // Send a response with a status code indicating successful retrieval (200) and the retrieved books
        return response.status(200).json({
            count: books.length,
            data: books,
        });
    } catch (error) {
        // Log any errors to the console
        console.log(error.message);

        // Send an error response with a status code of 500 and an error message
        response.status(500).send({ message: error.message });
    }
});

// Define a route for retrieving a book by id
router.get("/:id", async (request, response) => {
    try {

        // Retrieve the book id from the request parameters
        const { id } = request.params;

        // Retrieve the book with the specified id from the MongoDB database
        const book = await Book.findById(id);

        // Send a response with a status code indicating successful retrieval (200) and the retrieved book
        return response.status(200).json(book);
    } catch (error) {
        // Log any errors to the console
        console.log(error.message);

        // Send an error response with a status code of 500 and an error message
        response.status(500).send({ message: error.message });
    }
});

// Define an update route for modifying a book by id
router.put('/:id', async (request, response) => {
    try {
        // Validate the presence of required fields (title, author, publishYear) in the request body
        if (!request.body.title || !request.body.author || !request.body.publishYear) {
            return response.status(400).send({ message: 'Send all required fields: title, author, publishYear' });
        }

        // Retrieve the book id from the request parameters
        const { id } = request.params;

        // Update the book in the MongoDB database using the provided id and request body
        const result = await Book.findByIdAndUpdate(id, request.body);

        // Check if the book with the specified id exists
        if (!result) {
            return response.status(404).json({ message: 'Book not found' });
        }

        // Send a response with a status code indicating successful update (200) and a success message
        return response.status(200).send({ message: 'Book updated successfully' });
    } catch (error) {
        // Log any errors to the console
        console.log(error.message);

        // Send an error response with a status code of 500 and an error message
        response.status(500).send({ message: error.message });
    }
});

// Define a route for deleting a book by id
router.delete('/:id', async (request, response) => {
    try {
        // Retrieve the book id from the request parameters
        const { id } = request.params;

        // Delete the book from the MongoDB database using the provided id
        const result = await Book.findByIdAndDelete(id);

        // Check if the book with the specified id exists
        if (!result) {
            return response.status(404).json({ message: 'Book not found' });
        }

        // Send a response with a status code indicating successful deletion (200) and a success message
        return response.status(200).send({ message: 'Book deleted successfully' });
    } catch (error) {
        // Log any errors to the console
        console.log(error.message);

        // Send an error response with a status code of 500 and an error message
        response.status(500).send({ message: error.message });
    }
});  

// Export the router as the default export of the module
export default router;