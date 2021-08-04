const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('Connected to the database');

    } catch (err) {
        console.log(err);
        throw new Error('Can not connect to database');
    }
} 

module.exports = {
    connectDB
}