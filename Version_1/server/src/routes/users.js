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

// login endpoint
router.post("/login", async (req, res) => {
  const { username, password } = req.body; // Check login info
  const user = await UserModel.findOne({ username: username }); // See if user exists

  if (!user) { // Error handle non-existent user
      return res.json({ message: "User Doesn't Exist!" })
  }

  // Since we can't unhash something, we do the following
  // Check if what you entered, when hashed equals your hashed password. (since the algorithm will always return the same value)
  // true is the same, false is not.
  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) // Handle incorrect password
      return res.json({ message: "Username or Password is Incorrect! " })

  // Make a web token
  const token = jwt.sign({
      id: user._id,
      clearanceLevel: user.clearanceLevel
  }, process.env.JWT_SECRET);

  // Set the token as an HttpOnly and Secure cookie
  res.cookie('token', token, { httpOnly: true, secure: true });

  res.json({ token, userID: user._id });
});


// Define the '/auth/check-clearance' route
router.get('/check-clearance', async (req, res) => {
    // Extract the requested clearance level from the query parameters
    const requestedClearanceLevel = parseInt(req.query.clearanceLevel);
  
    // Verify the user's JWT token
    const token = req.header('Authorization'); // Assuming you send the token in the 'Authorization' header
  
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    try {
      // Verify the token and decode the user information
      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          return res.status(403).json({ message: 'Token is not valid' });
        }
  
        // Fetch the user's clearance level from the database based on the decoded user ID
        const user = await UserModel.findById(decoded.id);
  
        if (!user) {
          return res.status(404).json({ message: 'User not found.' });
        }
  
        const userClearanceLevel = user.clearanceLevel;
  
        // Compare the user's clearance level with the requested clearance level
        if (userClearanceLevel >= requestedClearanceLevel) {
          res.json({ message: 'Clearance level is sufficient.' });
        } else {
          res.json({ message: 'Insufficient clearance level.' });
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });
  
// Export the router to be used in the main server file
export { router as userRouter }
