import express from 'express';
import './model/db';

const app = express();
app.use(express.json())

app.use('/', (req, res) => {
    res.status(200).json({message: 'Welcome to Simon-tech website!'})
});

export default app;