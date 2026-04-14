import mongoose from "mongoose";
import express from 'express'
import { register,getme } from "../controllers/user.controller.js";

const authrouter = express.Router()

authrouter.post('/register',register)
authrouter.get('/get-me',getme)


export default authrouter;