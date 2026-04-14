import dotenv from 'dotenv'

dotenv.config()

if(!process.env.MONGO_URI){
    console.log("No Mongo db url in env file")
}

const config = {
    MONGO_URI: process.env.MONGO_URI
}

export default config;