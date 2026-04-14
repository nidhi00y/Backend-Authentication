import mongoose from "mongoose";
import express from 'express'
import { register,getme,refresh,logout,login } from "../controllers/user.controller.js";

const authrouter = express.Router()

authrouter.post('/register',register)
authrouter.get('/get-me',getme)
authrouter.get('/refresh',refresh)
authrouter.get('/logout',logout)
authrouter.get('/login',login)





export default authrouter;