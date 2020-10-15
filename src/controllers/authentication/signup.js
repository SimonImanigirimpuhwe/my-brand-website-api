import User from '../../models/user';
import generateToken from '../../helpers/jwToken';
import hashedPass from '../../helpers/hashPass';

const signupController = async(req, res) => {
    const { name, email, password } = req.body;

    const userEmail = await User.findOne({email});
    if (userEmail) res.status(400).json({error: 'Email in use'});

    const hashedPswd = await hashedPass(password);
    const user = new User({
        name,
        email,
        password: hashedPswd
    });

    try {
        const newUser = await user.save();
        const { name, email, _id, registeredAt } = newUser;
        const token = generateToken(newUser);

        return res
               .status(201)
               .json({
                   message: 'Account created successfully!',
                   Body: { name, email, _id, registeredAt },
                   token
                })
    } catch(err) {
        res.status(500).json({error: err.message})
    }
};


export default signupController;