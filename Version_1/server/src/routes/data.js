import express from "express";
import mongoose from "mongoose";
import { DataModel } from "../models/data.js";
import { UserModel } from "../models/Users.js";

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

router.put("/", async (req, res) => {

    try {
        const data = await DataModel.findById(findbyID(req.body.dataID))
        const user = await UserModel.findById(findbyID(req.body.userID))
        user.savedData.push(data)
        await data.save()
        res.json({ savedData: user.savedData })
    } catch (err) {
        res.json(err)
    }
})

export { router as dataRouter }