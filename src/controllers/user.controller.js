import usermodel from "../models/user.mode.js"
import crypto from 'crypto'

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
            username,email,hashed_password
        })
        res.status(201).json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
    
}

export {register}
