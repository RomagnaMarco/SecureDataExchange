// Required Libraries and Models
import express from "express";
import mongoose from "mongoose";
import { DataModel } from "../models/data.js";
import { UserModel } from "../models/Users.js";
import jwt from 'jsonwebtoken';

// Middleware to verify a user's clearance for accessing data
function verifyClearance(requiredClearance) {
    return async (req, res, next) => {
        // Extract token from the authorization header
        const token = req.headers.authorization.split(" ")[1];

        try {
            // Decode the JWT token to get the user ID
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Fetch the user with the decoded ID
            const user = await UserModel.findById(decoded.id);
            
            // If no user found with the given ID, respond with an error
            if (!user) {
                return res.status(403).json({ message: "Invalid token." });
            }

            // Check if the user's clearance level meets the required clearance
            if (user.clearanceLevel < requiredClearance) {
                return res.status(403).json({ message: "Insufficient clearance." });
            }

            // Store the user object in the request for subsequent route handling
            req.user = user;
            
            // Proceed to the next middleware or route handler
            next();

        } catch (err) {
            // Handle any error during token verification or user fetching
            return res.status(401).json({ message: "Authentication error.", error: err });
        }
    };
}

// Initialize the Express Router
const router = express.Router();

// GET route to fetch data based on user's clearance level
router.get("/", verifyClearance(0), async (req, res) => {
    try {
        // Fetch data with clearance level up to and including the user's clearance level
        const response = await DataModel.find({ clearanceLevel: { $lte: req.user.clearanceLevel } });
        res.json(response);
    } catch (err) {
        // Handle any data fetching error
        res.json(err);
    }
});

// POST route to add new data, ensuring user has necessary clearance
router.post("/", verifyClearance(0), async (req, res) => {
    const data = new DataModel(req.body);
    
    // Ensure the user has the clearance to add this data
    if (req.user.clearanceLevel < data.clearanceLevel) {
        return res.status(403).json({ message: "Insufficient clearance level to add this data." });
    }
    
    try {
        // Save the new data to the database
        const response = await data.save();
        res.json(response);
    } catch (err) {
        // Handle any errors during data saving
        res.json(err);
    }
});

// PUT route to update data, ensuring user has the right clearance
router.put("/", verifyClearance(0), async (req, res) => {
    try {
        // Fetch the data with the provided ID
        const data = await DataModel.findById(req.body.dataID);
        
        // Check the user's clearance against the data's clearance level
        if (req.user.clearanceLevel < data.clearanceLevel) {
            return res.status(403).json({ message: "Insufficient clearance level to update this data." });
        }

        // Fetch the user to update their savedData
        const user = await UserModel.findById(req.user._id);

        // Update user's savedData list
        user.savedData.push(data);
        await user.save();
        
        // Respond with the updated savedData list
        res.json({ savedData: user.savedData });
    } catch (err) {
        // Handle any errors during data or user fetching/updating
        res.json(err);
    }
});

// Export the router for use in the main server file
export { router as dataRouter };
