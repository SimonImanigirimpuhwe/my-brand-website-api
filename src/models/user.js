import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    platform: {
        type: String,
        enum: ['google', 'email']
    },
    profileId: {
        type: String
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required() {return  this.platform === 'email';}
    },
    biograph: {
        type: String
    },
    profileImag: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    registeredAt: {
        type: Date,
        default: new Date()
    }
});

const User = mongoose.model('User', userSchema);

export default User;