import express from 'express';
import cors from 'cors';
import './models/db';
import authRouter from './routes/auth';
import messageRoute from './routes/message.route';
import articleRoutes from './routes/articles.route';
import usersRoute from './routes/users.route';
import commentRoutes from './routes/comments.route';
import profileRoutes from './routes/profile.route';


const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use(cors())

// routes configuration
app.use('/users', authRouter)
app.use('/messages', messageRoute)
app.use('/articles', articleRoutes)
app.use('/users/info', usersRoute)
app.use('/comments', commentRoutes)
app.use('/users/profile', profileRoutes)


app.use('/', (req, res) => {
    res.status(200).json({message: 'Welcome to Simon-tech website!'})
});

export default app;