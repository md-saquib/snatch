import mongoose from "mongoose";


const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Name is required'],
        minLength: 2
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/],
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minLength: 6,
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'seller']
    },
    refreshToken: {
        type: String,

    },

}, {
    timeStamp: true
})

const userModel = mongoose.model('user', userSchema)

export default userModel