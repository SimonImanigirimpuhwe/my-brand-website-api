import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
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
        required: true
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