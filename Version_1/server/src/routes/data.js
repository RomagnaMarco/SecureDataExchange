import express from "express";
import mongoose from "mongoose";
import { DataModel } from "../models/data.js";

const router = express.Router()

router.get("/", async (req, res) => {
    try {
        const response = await DataModel.find( { clearanceLevel:0 }) //finds all data with level 0 clearance
        res.json(response)
    } catch (err) {
        res.json(err)
    }
})

router.post("/", async (req, res) => {
    const data = new DataModel( req.body )

    try {
        const response = await data.save()
        res.json(response)
    } catch (err) {
        res.json(err)
    }
})

export { router as dataRouter }