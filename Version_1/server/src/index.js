// Importing necessary libraries
import express from 'express';      // Express framework for building the API
import cors from 'cors';            // Middleware for enabling cross-origin resource sharing
import mongoose from 'mongoose';    // Library for MongoDB object modeling

import dotenv from 'dotenv';
dotenv.config();


// Initializing the express application
const app = express();

// Middleware configurations

// Enable JSON body parsing for incoming requests (to read JSON payload from frontend)
app.use(express.json());

// Enable CORS with default settings (allows requests from any origin by default)
app.use(cors());

// Connect to the MongoDB database using Mongoose
// - mongodb+srv: Indicates we are connecting to MongoDB Atlas (cloud version of MongoDB)
// - Use environment variables for sensitive information such as username, password, and host.
//   This keeps secrets out of the codebase and provides flexibility in different environments.
// - process.env.MONGODB_USERNAME: The MongoDB user (in this case "marrromagna")
// - process.env.MONGODB_PASSWORD: Password for the MongoDB user
// - process.env.MONGODB_HOST: The address of your MongoDB Atlas cluster (e.g., securedata.bdrzv2e.mongodb.net)
// - SecureData: The Database being connected to
// - ?retryWrites=true: Ensures that write operations are retried if they fail initially
// - &w=majority: Write concern set to "majority" ensures data is written to the majority of replica set members before confirming the write
mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/SecureData?retryWrites=true&w=majority`);

// Start the server on port 3001
app.listen(3001, () => console.log("Server Started on Port 3001"));

