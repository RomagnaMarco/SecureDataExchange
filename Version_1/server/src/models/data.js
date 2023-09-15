// Importing the mongoose library for MongoDB object modeling.
import mongoose from "mongoose";

// Defining a schema for the Data collection in MongoDB.
// The schema describes the structure of the documents within this collection.
const DataSchema = new mongoose.Schema({
    clearanceLevel: { type: Number, required: true },
    description: { type: String, required: true },
    tags: [{ type: String, required: true }], // Array of strings for tags
    info: { type: String, required: false },
    date: { type: Date, default: Date.now },
    userOwner: {
        type: mongoose.Schema.Types.ObjectId, // Using ObjectId to reference a user document.
        ref: "users", // Establishing a reference to the 'users' collection.
        required: true, // Mandatory field to track the original user who added the data.
    },
});

// Creating a model named 'data' based on the DataSchema.
// This model represents the 'data' collection in MongoDB.
// We'll use this model for CRUD operations on the 'data' collection.
export const DataModel = mongoose.model("data", DataSchema);
