import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (data) => {
    const { name, id, isAdmin } = data;
    const secretKey = process.env.SECRET_KEY;

    try {
        const token =  jwt.sign(
            {name, id, isAdmin}, 
            secretKey, 
            {
                algorithm: 'HS256',
                expiresIn: '5d'
            });
        return token;
    } catch(err) {
        throw new Error('Unable to generate token')
    }
};

export default generateToken;