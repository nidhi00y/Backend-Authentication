import usermodel from "../models/user.mode.js"
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import config from '../config/config.js'


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
        const token = jwt.sign({ id: user._id }, config.JWT_SECRET_KEY, { expiresIn: '1h' })
        res.status(201).json({ message:"User registered successfully",user, token })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
    
}

async function getme(req,res){
    const token = req.headers.authorization?.split(' ')[1]
    if(!token){
        return res.status(401).json({ message: "Unauthorized" })
    }
    const decoded = jwt.verify(token, config.JWT_SECRET_KEY)
    const user = await usermodel.findById(decoded.id).select('-password')
    if(!user){
        return res.status(404).json({ message: "User not found" })
    }   
    res.status(200).json({message:"User found", user })

}

export {register,getme}
