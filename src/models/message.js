import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    sentAt: {
        type: Date,
        default: new Date()
    }
});

const Message = mongoose.model('Message', messageSchema);

export default Message;