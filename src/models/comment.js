import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
    sender: {
        email: String 
    },
    commentContent: {
        type: String,
        required: true
    },
    articleId: {
        _id: mongoose.Schema.Types.ObjectId
    }
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;