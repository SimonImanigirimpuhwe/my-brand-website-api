import User from '../../models/user';
import uploader from '../../utils/uploader';

export default {
    updateProfile: async (req, res) => {
        try {
            const { name, biograph } = req.body;
            const { _id } = req.user;

            const userToUpdate = await User.findByIdAndUpdate({_id}, {
                name,
                biograph
            }, { new: true});

            const { isAdmin, isActive, registeredAt, email} = userToUpdate;

            return res.status(200).json({
                message: 'Profile updated successfully',
                updatedProfile: {
                    name,
                    email,
                    biograph,
                    _id,
                    isAdmin,
                    isActive,
                    registeredAt
                }})

        } catch (err) {
            return res.status(500).json({erorr: err.messsage})
        }
    },

    updateProfileImage: async (req, res) => {
        try {
            const { _id } = req.user;
            if (!req.file) return res.status(400).json({error: 'No file selected'});

            const uploaded = await uploader(req.file.path)
            const userProfileToUpdate = await User.findByIdAndUpdate({_id}, {
                profileImag: uploaded.secure_url
            }, { new: true});


            const { isAdmin, isActive, registeredAt, email, name, biograph, profileImag} = userProfileToUpdate;

            return res.status(200).json({
                message: 'Profile image updated successfully',
                updatedProfile: {
                    name,
                    email,
                    biograph,
                    _id,
                    isAdmin,
                    isActive,
                    profileImag,
                    registeredAt
                }})

        } catch (err) {
            return res.status(500).json({error: err.messsage})
        }
    },

    getProfile: async (req, res) => {
        try {
            const { email } = req.user;
            const userProfile = await User.findOne({email}, {'password': 0});

            return res.status(200).json({userProfile})
        } catch (err) {
            return res.status(500).json({error: err.messsage})
        }
    }
}