import mongoose from 'mongoose';

async function connectWithRetry() {
  mongoose.set('useFindAndModify', false);
  mongoose.Promise = require('bluebird');
  mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  mongoose.set('useCreateIndex', true);
}

connectWithRetry();

mongoose.connection.on('connected', () => {
  console.log(`Mongoose connection open to ${process.env.MONGO_URI}`);
});

mongoose.connection.on('error', (error) => {
  console.log(`Mongoose connection error: ${error}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection disconnected');
});

export default mongoose;
