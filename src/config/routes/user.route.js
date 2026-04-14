import mongoose from "mongoose";
import express from 'express'
import { register } from "../../controllers/user.controller.js";

const authrouter = express.Router()

authrouter.post('/register',register)

export default authrouter;