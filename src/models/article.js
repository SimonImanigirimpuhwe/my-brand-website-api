import { string } from '@hapi/joi';
import mongoose from 'mongoose';


const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true
    },
    author: {
        name: String,
        _id: mongoose.Schema.Types.ObjectId
    },
    content: {
        type: String,
        required: true
    },
    articleImage: {
        type: String
    },
    comments: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    unlikes: {
        type: Number,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    shares: {
        type: Number,
        default: 0
    },
    postedAt: {
        type: Date,
        default: new Intl.DateTimeFormat('en-US', { dateStyle: 'medium'}).format(new Date())
    }
});

const Article = mongoose.model('Article', articleSchema);

export default Article;