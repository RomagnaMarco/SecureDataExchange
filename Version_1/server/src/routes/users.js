// This module handles authentication processes like registration and login.

import express from 'express'      // Express library for web routing
import jwt from 'jsonwebtoken'     // Library for generating and decoding JSON Web Tokens
import bcrypt from 'bcrypt'        // Library for hashing passwords securely

import { UserModel } from '../models/Users.js'  // Import the User model schema

// Initialize an Express router instance
const router = express.Router()

// Define a POST endpoint for user registration
router.post("/register", async (req, res) => {
    // Extract username and password from the request body
    const { username, password } = req.body;

    // Try to find an existing user with the given username
    const user = await UserModel.findOne({ username: username });

    // If a user is found, they've already registered
    if (user) {
        return res.json({ message: "User already exists!" });
    }

    // If no existing user is found, hash the provided password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user using the User model, setting the provided username and hashed password
    const newUser = new UserModel({ username, password: hashedPassword });
    
    // Save this new user to the database
    await newUser.save();

    // Respond indicating successful registration
    res.json({ message: "User Registered Successfully" });
})

// Placeholder for a login endpoint
router.post("/login", async (req, res) => {
    const { username, password } = req.body; //check login info
    const user = await UserModel.findOne({ username: username }); //see if user exists

    if(!user) { //error handle non-existant user
        return res.json({message: "User Doesn't Exist!" })
    }

    //since we can't unhash somethng, we do the following
    //check if what you entered, when hashed equals your hashed password. (since the algorithm will always return the same value)
    //true is same, false is not.
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) //handle inccorect password
        return res.json({message: "Username or Password is Incorrect! "})

    //make a webtoken
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({token, userID: user._id })

});

// Export the router to be used in the main server file
export { router as userRouter }