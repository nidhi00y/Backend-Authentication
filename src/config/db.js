import config from './config.js'
import mongoose from 'mongoose'

async function dbconnect(){
    await mongoose.connect(config.MONGO_URI)
    console.log("Database connected succesfully")
}

export default dbconnect;