import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    username:{
        type:'string',
        require:true,
        unique:true
    },
    email:{
        type:'string',
        require:true,
        unique:true
    },
    password:{
        type:'string',
        require:true,
    },
    refreshToken:{
        type:'string',
    }
})

    const usermodel = mongoose.model("User",userSchema)

    export default usermodel;