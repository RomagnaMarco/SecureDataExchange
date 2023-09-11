import { express } from "express";
import mongoose from "mongoose";
import { DataModel } from "../models/data.js";

const router = express.router()

export { router as dataRouter }