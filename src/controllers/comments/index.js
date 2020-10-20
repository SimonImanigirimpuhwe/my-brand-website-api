import mongoose from 'mongoose';
import Article from '../../models/article';
import Comment from '../../models/comment';

export default {
    addComment: async (req, res) => {
        try {
            const { commentContent } = req.body;
            const { email } = req.user;
            const { _id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).json({error: 'Invalid ID'});

            const articleToCommentOn = await Article.findByIdAndUpdate({_id}, {$inc: {comments: 1}});
            if (!articleToCommentOn) return res.status(404).json({error: 'No article with the given ID found!'});

            const commentToSave = new Comment({
                sender: { email },
                commentContent,
                articleId: {_id}
            });

            const savedComment = await commentToSave.save();

            return res.status(200).json({message: 'Comment added successfully', savedComment})

        } catch (err) {
            return res.status(500).json({error: err.message})
        }
    },

    getComment: async (req, res) => {
        try {
            const { _id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).json({error: 'Invalid ID'});

            const allComments = await Comment.find().where('articleId._id', {$eq: _id});
            if (allComments.length === 0) return res.status(400).json({error: 'No comments for this article yet!'});
            
            return res.status(200).json(allComments)
        } catch (err) {
            return res.status(500).json({error: err.message})
        }
    }
}