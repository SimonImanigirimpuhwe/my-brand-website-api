import express from 'express';
import './models/db';
import authRouter from './routes/auth';
import messageRoute from './routes/message.route';
import articleRoutes from './routes/articles.route';
import usersRoute from './routes/users.route';

const app = express();
app.use(express.json())

// routes configuration
app.use('/users', authRouter)
app.use('/message', messageRoute)
app.use('/articles', articleRoutes)
app.use('/users/info', usersRoute)


app.use('/', (req, res) => {
    res.status(200).json({message: 'Welcome to Simon-tech website!'})
});

export default app;