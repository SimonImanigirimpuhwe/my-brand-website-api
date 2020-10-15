import bcrypt from 'bcryptjs';
import User from '../../models/user';
import generateToken from '../../helpers/jwToken';


const loginController = async(req, res) => {
    const { email, password } = req.body;

    const loginUser = await User.findOne({email});
    if (!loginUser) return res.status(400).json({error: 'Invalid Email or Password!'})

    try {
        const validPass = await bcrypt.compare(password, loginUser.password);
        if (!validPass) return res.status(400).json({error: 'Invalid Email or Password!'})

        const token = generateToken(loginUser);
        const { name, email, _id } = loginUser;
        return res.status(200)
                  .json({
                      message: 'Logged in successfully!',
                      body:{ name, email, _id },
                      token
                    })
    } catch(err) {
        return res.status(500).json({error: err.message})
    }
};


export default loginController;