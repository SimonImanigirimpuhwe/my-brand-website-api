import mongoose from 'mongoose';
import Article from '../../models/article';
import uploader from '../../utils/uploader';

export default {
    addArticle: async (req, res) =>{
        try {
            const { title, content } = req.body;
            const { _id, name } = req.user;
            const uploadedImg = await uploader(req.file.path);

            const articleToAdd = await Article.findOne({title});
            if (articleToAdd) return res.status(400).json({error: 'Article added before!'});

            const newArticle = new Article({
                title,
                author: { _id, name},
                content,
                articleImage: uploadedImg.secure_url
            });

            const savedArticle = await newArticle.save();

            return res.status(201).json({message: 'Article created successfully', savedArticle})
        } catch(err) {
            return res.status(500).json({error: err.message})
        }
    },

    editArticle: async (req, res) => {
        try {
            const { title, content } = req.body;
            const { _id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).json({error: 'Invalid ID'});

            const articleToEdit = await Article.findById({_id});
            if (!articleToEdit) res.status(404).json({error: 'No article with given ID'});
            
            const uploadedImg = await uploader(req.file.path);

            articleToEdit.set({
                title: title || articleToEdit.title,
                content: content || articleToEdit.content,
                articleImage: uploadedImg.secure_url
            });

            const editedArticle = await articleToEdit.save();

            return res.status(200).json({message: 'Article updated successfully', editedArticle})
        } catch(err) {
            return res.status(500).json({error: err.message})
        }
    },

    deleteArticle: async (req, res) => {
        try {
            const { _id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).json({error: 'Invalid ID'});

            const articleToDelete = await Article.findByIdAndDelete(_id);
            if (!articleToDelete) return res.status(404).json({error: 'No article with the given ID!'});

            return res
                .status(200)
                .json({message: 'Article deleted successfully', articleToDelete});
        } catch(err) {
            return res.status(500).json({error: err.message})
        }
    },

    getArticles: async (req, res) => {
        try {
            const { _id } = req.user;
            if (req.user.isAdmin === true) {
                const savedArticles = await Article.find().sort({postedAt: -1});;
                if (!savedArticles) return res.status(404).json({error: 'No Articles yet in DB!'});
    
                return res.status(200).json({savedArticles});
            } 
            const savedArticles = await Article.find()
                .where({'author._id': {$eq: _id}})
                .sort({postedAt: -1});

            if (savedArticles.length === 0) return res.status(404).json({error: 'No Articles yet in DB!'});

            return res.status(200).json({savedArticles});
        } catch(err) {
            return res.status(500).json({error: err.message});
        }
    },

    adminGetArticles: async (req, res) => {
        try {
            const savedArticles = await Article.find().sort({postedAt: -1});;
            if (!savedArticles) return res.status(404).json({error: 'No Articles yet in DB!'});

            return res.status(200).json({savedArticles});
        } catch(err) {
            return res.status(500).json({error: err.message});
        }
    },

    getSingleArticle: async (req, res) => {
        try {
            const { _id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).json({error: 'Invalid ID'});

            const signleArticle = await Article.findById(_id);
            if (!signleArticle) return res.status(404).json({error: 'No Article with such ID!'});

            return res.status(200).json({signleArticle})
        } catch(err) {
            return res.status(500).json({error: err.message})
        }
    }
}