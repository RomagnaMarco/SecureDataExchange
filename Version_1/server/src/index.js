// Importing necessary libraries
import express from 'express';      // Express framework for building the API
import cors from 'cors';            // Middleware for enabling cross-origin resource sharing
import mongoose from 'mongoose';    // Library for MongoDB object modeling

// Initializing the express application
const app = express();

// Middleware configurations

// Enable JSON body parsing for incoming requests (to read JSON payload from frontend)
app.use(express.json());

// Enable CORS with default settings (allows requests from any origin by default)
app.use(cors());

// Start the server on port 3001
app.listen(3001, () => console.log("Server Started on Port 3001"));
