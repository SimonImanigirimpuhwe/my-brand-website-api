import mongoose from 'mongoose';
import config from '../../config/config';

const options = {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true
}
const {
    db:{ name }
} = config;

const url = config.db.database_url || `mongodb://localhost:27017/${name}`


export default mongoose
    .connect(url, options)
    // eslint-disable-next-line
    .then(() => console.log('MongoDB connected......'))
    .catch((err) => { throw new Error(err)})