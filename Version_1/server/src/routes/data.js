// Required Libraries and Models
import express from "express";  // Importing Express framework for building web applications
import mongoose from "mongoose";  // Importing Mongoose for MongoDB object modeling
import { DataModel } from "../models/data.js";  // Importing Data schema/model
import { UserModel } from "../models/Users.js";  // Importing User schema/model
import jwt from 'jsonwebtoken';  // Importing JSON Web Token for authentication

// Middleware to verify a user's clearance for accessing data
function verifyClearance(requiredClearance) {
    return async (req, res, next) => {
        // Extract token from the authorization header
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
        return res.status(401).json({ message: 'Authorization header missing.' });
        }

        const token = authorizationHeader.split(" ")[1];

        try {
            // Decode the JWT token to get the user ID
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Fetch the user with the decoded ID from database
            const user = await UserModel.findById(decoded.id);
            
            // If no user found with the given ID, respond with an error
            if (!user) {
                return res.status(403).json({ message: "Invalid token." });
            }

            // Check if the user's clearance level meets or exceeds the required clearance
            if (user.clearanceLevel < requiredClearance) {
                return res.status(403).json({ message: "Insufficient clearance." });
            }

            // Attach the user object to the request for use in subsequent route handlers
            req.user = user;
            
            // Proceed to the next middleware or route handler
            next();
        } catch (err) {
            // Error handling: could be token verification failure or database issues
            return res.status(401).json({ message: "Authentication error.", error: err });
        }
    };
}

// Initialize an instance of Express Router
const router = express.Router();

// GET route to fetch data based on user's clearance level
router.get("/", verifyClearance(0), async (req, res) => {
    try {
        // Retrieve data from the database that matches or is below the user's clearance level
        const response = await DataModel.find({ clearanceLevel: { $lte: req.user.clearanceLevel } });
        res.json(response);
    } catch (err) {
        // Error handling for data retrieval
        res.json(err);
    }
});

// POST route to add new data, with clearance check
router.post("/", verifyClearance(1), async (req, res) => {
    const data = new DataModel(req.body);  // Create a new data instance from the request body
    
    // Check if user's clearance is sufficient to add the given data
    if (req.user.clearanceLevel < data.clearanceLevel) {
        return res.status(403).json({ message: "Insufficient clearance level to add this data." });
    }
    
    try {
        // Persist the data to the database
        const response = await data.save();
        res.json(response);
    } catch (err) {
        // Error handling for data insertion
        res.json(err);
    }
});

// PUT route to update data, with clearance check
router.put("/", verifyClearance(2), async (req, res) => {
    try {
        // Fetch the data to be updated using its ID from the request body
        const data = await DataModel.findById(req.body.dataID);
        
        // Ensure the user has sufficient clearance to update the data
        if (req.user.clearanceLevel < data.clearanceLevel) {
            return res.status(403).json({ message: "Insufficient clearance level to save this data." });
        }

        // Fetch user's current savedData
        const user = await UserModel.findById(req.user._id);

        // Append the data to the user's savedData array
        user.savedData.push(data);
        await user.save();
        
        // Return the updated savedData array
        res.json({ savedData: user.savedData });
    } catch (err) {
        // Error handling for data update process
        res.json(err);
    }
});

// GET route to fetch IDs of saved data for the user
router.get("/saved-data/ids/:userID", verifyClearance(0), async (req, res) => { 
    try {
        // Retrieve user's saved data IDs based on user ID from the decoded token
        const user = await UserModel.findById(req.params.userID);
        res.json({ savedData: user?.savedData });
    } catch (err) {
        // Error handling for fetching saved data IDs
        res.status(500).json({ message: "Internal server error", error: err });
    }
});

// GET route to fetch IDs of saved data for the user
router.get("/saved-data/:userID", verifyClearance(0), async (req, res) => { 
    try {
        // Retrieve user's saved data IDs based on user ID from the decoded token
        const user = await UserModel.findById(req.params.userID);
        const savedData = await DataModel.find({
            _id: { $in: user.savedData },
        })
        res.json({ savedData });
    } catch (err) {
        // Error handling for fetching saved data IDs
        res.status(500).json({ message: "Internal server error", error: err });
    }
});

// DELETE route to remove IDs of saved data for the user
router.delete("/saved-data/:userID/:dataID", verifyClearance(2), async (req, res) => {
    try {
        const { userID, dataID } = req.params;

        // Fetch the user
        const user = await UserModel.findById(userID);

        // If no user is found, return an error
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Remove the dataID from the user's savedData array
        user.savedData = user.savedData.filter(id => id.toString() !== dataID);
        await user.save();

        // Return a success message
        res.json({ message: "Data removed from saved list successfully." });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err });
    }
});

// DELETE route to delete main data, with Level 3 clearance check
router.delete("/:dataID", verifyClearance(3), async (req, res) => {
    try {
        const { dataID } = req.params;
        
        // Delete the data with the provided ID
        await DataModel.findByIdAndDelete(dataID);
        
        // Return a success message
        res.json({ success: true, message: "Data deleted successfully." });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", error: err });
    }
});


// Export the router so it can be mounted in the main server/application
export { router as dataRouter };
