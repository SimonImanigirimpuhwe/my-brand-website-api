import express from 'express';
import './models/db';
import authRouter from './routes/auth';
import messageRoute from './routes/message.route';
import articleRoutes from './routes/articles.route';
import usersRoute from './routes/users.route';
import commentRoutes from './routes/comments.route';
import profileRoutes from './routes/profile.route';
import googleRoutes from './routes/googleOauth.route';


const app = express();
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// routes configuration
app.use('/users', authRouter)
app.use('/users/auth', googleRoutes )
app.use('/message', messageRoute)
app.use('/articles', articleRoutes)
app.use('/users/info', usersRoute)
app.use('/comments', commentRoutes)
app.use('/users/profile', profileRoutes)


app.use('/', (req, res) => {
    res.status(200).json({message: 'Welcome to Simon-tech website!'})
});

export default app;