import dotenv from 'dotenv'

dotenv.config()

if(!process.env.MONGO_URI){
    console.log("No Mongo db url in env file")
}

if(!process.env.JWT_SECRET_KEY){
    console.log("No JWT secret key in env file")
}

const config = {
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET_KEY:process.env.JWT_SECRET_KEY
}

export default config;