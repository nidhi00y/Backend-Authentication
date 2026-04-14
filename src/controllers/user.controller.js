import usermodel from "../models/user.mode.js"
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import config from '../config/config.js'
import cookie from "cookie-parser"


async function register(req,res){
    const {username,email,password} = req.body

    if(!username || !email || !password){
        return res.status(400).json({ message: "All fields are required" })
    }

    const Already_registered = await usermodel.findOne({
        $or:[
             {email},
             {username}
        ]
        
    })

    if(Already_registered){
        return res.status(400).json({ message: "User already exists" })
    }

    const hashed_password = crypto.createHash('sha256').update(password).digest('hex')

    try{
        const user = await usermodel.create({
            username,email,password:hashed_password
        })
        const accesstoken = jwt.sign({ id: user._id }, config.JWT_SECRET_KEY, { expiresIn: '15m' })
        const refreshtoken = jwt.sign({ id: user._id }, config.JWT_SECRET_KEY, { expiresIn: '1h' })
        user.refreshToken = refreshtoken
        await user.save()
        res.cookie('refreshToken', refreshtoken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 3600000 
        })

        res.status(201).json({ message:"User registered successfully",user, accesstoken, refreshtoken })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
    
}

async function login(req,res){
        const {email,password} = req.body
        const hashed_password = crypto.createHash('sha256').update(password).digest('hex')
        const user = await usermodel.findOne({ email, password: hashed_password })
        if(!user){
            return res.status(401).json({ message: "Invalid credentials" })
        }
        const accesstoken = jwt.sign({ id: user._id }, config.JWT_SECRET_KEY, { expiresIn: '15m' })
        const refreshtoken = jwt.sign({ id: user._id }, config.JWT_SECRET_KEY, { expiresIn: '1h' })
        user.refreshToken = refreshtoken
        await user.save()
        res.cookie('refreshToken', refreshtoken, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 3600000 
        })
        res.status(200).json({ message:"User logged in successfully",user, accesstoken, refreshtoken })

}

async function getme(req,res){
    const token = req.headers.authorization?.split(' ')[1]
    if(!token){
        return res.status(401).json({ message: "Unauthorized" })
    }
    const decoded = jwt.verify(token, config.JWT_SECRET_KEY)
    const user = await usermodel.findById(decoded.id).select('-password')
    if(!user || user.refreshToken==null){
        return res.status(404).json({ message: "User not found" })
    }   
    res.status(200).json({message:"User found", user })

}

async function refresh(req,res){
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken){
        return res.status(401).json({ message: "Unauthorized" })
    }
    const decoded = jwt.verify(refreshToken, config.JWT_SECRET_KEY)
    const user = await usermodel.findById(decoded.id) 
    if(!user){
        return res.status(404).json({ message: "User not found" })
    }   
    const accesstoken = jwt.sign({ id: user._id }, config.JWT_SECRET_KEY, { expiresIn: '15m' })
    res.status(200).json({message:"Access token refreshed",user, accesstoken })  

}

async function logout(req,res){
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken){
        return res.status(401).json({ message: "Unauthorized" })
    }
    const decoded = jwt.verify(refreshToken, config.JWT_SECRET_KEY)
    const user = await usermodel.findById(decoded.id) 
    if(!user){
        return res.status(404).json({ message: "User not found" })
    }   
    user.refreshToken = null
    await user.save()
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
    })
    res.status(200).json({ message: "Logged out successfully" })

}

export {register,getme,refresh,logout,login}
