import express from "express";
import mongoose from "mongoose";
import { DataModel } from "../models/data.js";
import { UserModel } from "../models/Users.js";
import jwt from 'jsonwebtoken'

//middleware to check clearance for data
function verifyClearance(requiredClearance) {
    return async (req, res, next) => {
        const token = req.headers.authorization.split(" ")[1];  // Assuming you're sending token as a Bearer token

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);  // decode the token
            const user = await UserModel.findById(decoded.id);  // find the user by id from the decoded token

            if (!user) {
                return res.status(403).json({ message: "Invalid token." });
            }

            if (user.clearanceLevel < requiredClearance) {
                return res.status(403).json({ message: "Insufficient clearance." });
            }

            req.user = user;  // you can also store the user in the request for subsequent middleware or route logic
            next();  // move to the next middleware or route handler

        } catch (err) {
            return res.status(401).json({ message: "Authentication error.", error: err });
        }
    };
}


const router = express.Router()

router.get("/", verifyClearance(0), async (req, res) => { // The middleware will authenticate the user and add them to the request.
    try {
        // Fetch data with clearance level <= user's clearance level
        const response = await DataModel.find({ clearanceLevel: { $lte: req.user.clearanceLevel } });
        res.json(response);
    } catch (err) {
        res.json(err);
    }
});

router.post("/", verifyClearance(0), async (req, res) => { 
    // For the POST, make sure the data they're trying to add doesn't exceed their clearance.
    const data = new DataModel(req.body);
    if (req.user.clearanceLevel < data.clearanceLevel) {
        return res.status(403).json({ message: "Insufficient clearance level to add this data." });
    }
    
    try {
        const response = await data.save();
        res.json(response);
    } catch (err) {
        res.json(err);
    }
});

router.put("/", verifyClearance(0), async (req, res) => {
    try {
        const data = await DataModel.findById(req.body.dataID);
        
        // Check if user's clearance is >= data's clearance
        if (req.user.clearanceLevel < data.clearanceLevel) {
            return res.status(403).json({ message: "Insufficient clearance level to update this data." });
        }

        const user = await UserModel.findById(req.user._id);  // We can use req.user since we have already decoded the JWT in the middleware

        user.savedData.push(data);
        await user.save();
        res.json({ savedData: user.savedData });
    } catch (err) {
        res.json(err);
    }
});



export { router as dataRouter }