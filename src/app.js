import express from 'express';
import './models/db';
import authRouter from './routes/auth';

const app = express();
app.use(express.json())
app.use('/users', authRouter)

app.use('/', (req, res) => {
    res.status(200).json({message: 'Welcome to Simon-tech website!'})
});

export default app;