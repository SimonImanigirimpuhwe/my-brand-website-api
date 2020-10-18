import mongoose from 'mongoose';
import Message from '../../models/message';

export default {
    sendMessage: async (req, res) => {
        try {
            const { name, email, message } = req.body;
            const messageToSend = await Message.findOne({message});
    
            if (messageToSend) return res.status(400).json({error: 'Message has been sent before!'});

            const newMessage = new Message({
                name,
                email,
                message
            });
            const savedMessage = await newMessage.save();

            return res.status(201).json({message: 'Message Sent!', savedMessage});
    
        } catch(err) {
            return res.status(500).json({error: err.message});
        }
    },

    getMessages: async (req, res) => {
        try {
            const allMessages = await Message.find().sort({sentAt: -1});
            if (allMessages.length === 0) return res.status(404).json({error: 'No message yet!'});

            return res.status(200).json({allMessages});
        } catch(err) {
            return res.status(500).json({error: err.message})
        }      
    },

    deleteMessage: async (req, res) => {
        try {
            const { _id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).json({error: 'Invalid ID'});

            const messageToDelete = await Message.findByIdAndDelete(_id);
            
            if (!messageToDelete) return res.status(404).json({error: 'No message with the given ID'});

            return res.status(200).json({message: 'Message deleted successfully!', messageToDelete})
        } catch(err) {
            return res.status(500).json({error: err.message})
        }
    }
};