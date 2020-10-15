import mongoose from 'mongoose';
import config from '../../config/config';

const options = {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true
}
const {
    db:{ username, password, name }
} = config;

const url = config.db.database_url || `mongodb+srv://${username}:${password}@cluster0.zjvfn.mongodb.net/${name}`;

export default mongoose
.connect(url, options)
.then(() => console.log('MongoDB connected......'))
.catch((err) => { throw new Error(err)})