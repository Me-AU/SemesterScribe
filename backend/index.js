import express, { response } from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";

const app = express();

app.get("/", (request, response) => {
    console.log(request);
    return response.status(200).send("Hello World!");
});

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log("Connected to MongoDB!");
        app.listen(PORT, () => {
            console.log(`App is listening on port ${PORT}!`);
        });
    })
    .catch((error) => {
        console.log(error);
    });