// Importing necessary libraries

import express from 'express';      // Framework for creating web applications and APIs
import cors from 'cors';            // Middleware for enabling cross-origin requests
import mongoose from 'mongoose';    // ODM (Object Data Modeling) library for MongoDB and Node.js

import { userRouter } from './routes/users.js'; // Routes for user-related operations

import dotenv from 'dotenv';        // Library to load environment variables from a .env file
dotenv.config();                    // Load environment variables from a .env file

// Initializing the Express application
const app = express();

// Middleware configurations

// Parse incoming requests with JSON payloads
app.use(express.json());

// Enable CORS for all routes with default settings 
// (allowing requests from any origin)
app.use(cors());

// Associate the userRouter with the '/auth' path. 
// All routes defined in userRouter will be prefixed with '/auth'
app.use("/auth", userRouter)

// Connect to the MongoDB database using Mongoose
// - The connection string is constructed using environment variables to keep credentials secure
// - "mongodb+srv": Specifies that the connection is made to MongoDB Atlas, the cloud service
// - The various query parameters at the end are options for the connection:
//   * "retryWrites=true": Automatically retry write operations upon failure
//   * "w=majority": Ensure data is written to the majority of replica set members before confirming
mongoose.connect(
`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/SecureData?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,           // Use the new URL parser to process the connection string
        useUnifiedTopology: true,        // Use the unified topology for MongoDB client operations
    }
);

// Start the Express server on port 3001
app.listen(3001, () => console.log("Server Started on Port 3001"));
