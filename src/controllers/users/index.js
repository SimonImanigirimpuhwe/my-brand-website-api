import mongoose from 'mongoose';
import User from '../../models/user';
import Article from '../../models/article';

export default {
    getUsers: async (req, res) => {
        try {
            const user = await User.find({}, {'password': 0}).sort({registeredAt: -1});

            return res.status(200).json({user})
        } catch (err) {
            return res.status(500).json({error: err.message})
        }
    },

    deleteUser: async (req, res) => {
        try {
            const { _id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).json({error: 'Invalid ID!'});
            
            const userToDelete = await User.findByIdAndDelete(_id);
            if (!userToDelete) return res.status(404).json({error: 'No user with the given ID!'});

            // eslint-disable-next-line 
            let deletedUser = [];
            if (userToDelete) {
                const { name, email } = userToDelete;
                deletedUser.push({
                    name, email, _id
                })
                const deleteUserArticles = await Article.deleteMany().where({'author.name': { $eq: name}})
                
                return res.status(200).json({message: 'User deleted successfully', deletedUser, deleteUserArticles})
            }
            
        } catch (err) {
            return res.status(500).json({error: err.message})
        }
    },

    editUser: async (req, res) => {
        try {
            const { isActive, isAdmin } = req.body;
            const { _id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(400).json({error: 'Invalid ID!'});

            const userToUpdate = await User.findById({_id}, {'password': 0});
            if (!userToUpdate) return res.status(404).json({error: 'No user with the given ID'});
            
            userToUpdate.set({
                isAdmin ,
                isActive 
            });

            const updatedUser = await userToUpdate.save();
            
            return res.status(200).json({message: 'User updated successfully', updatedUser})
        } catch (err) {
            return res.status(500).json({error: err.message})
        }
    } 
}