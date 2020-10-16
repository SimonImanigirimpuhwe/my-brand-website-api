import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const auth = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).json({error: 'Access Denied, login to continue!'});

    try {
        const secretKey = process.env.SECRET_KEY;
        const decoded = jwt.verify(token, secretKey);
        req.user = decoded;
        
        return next();
    } catch(err) {
        return res.status(403).json({error: 'Invalid Token'})
    }
}
export const adminAuth = (req, res, next) => {
    const { isAdmin } = req.user;
    if (!isAdmin) return res.status(401).json({error: 'Access Denied, cannot perform the action unless you are an Admin!'});

    return next();
};