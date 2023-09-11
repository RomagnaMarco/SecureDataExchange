import { express } from "express";
import mongoose from "mongoose";
import { DataModel } from "../models/data.js";

const router = express.router()

router.get("/", async (req, res) => {
    try {
        const response = await RecipeModel.find({ clearanceLevel: 0 }) //finds all data with level 0 clearance
        res.json(response)
    } catch (err) {
        res.json(err)
    }
})

export { router as dataRouter }