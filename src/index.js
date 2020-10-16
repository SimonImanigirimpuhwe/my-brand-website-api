import app from './app';


const PORT = process.env.PORT || 3000;

// eslint-disable-next-line
app.listen(PORT, () => console.log(`App running on port ${PORT}`));