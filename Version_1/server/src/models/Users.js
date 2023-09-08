// Importing the mongoose library for MongoDB object modeling
import mongoose from "mongoose";

// Defining a schema for the User collection in MongoDB
// The schema describes the structure of the documents in the collection
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Creating a UserModel using the UserSchema which corresponds to the "users" collection in MongoDB
// Any operations on the "users" collection will use this model
export const UserModel = mongoose.model("users", UserSchema);
