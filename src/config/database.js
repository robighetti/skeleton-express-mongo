import mongoose from 'mongoose';

const mongoURI = 'mongodb://localhost:27017/vdv-mongo';

async function connectWithRetry() {
  mongoose.set('useFindAndModify', false);
  mongoose.Promise = require('bluebird');
  mongoose.connect(mongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });
  mongoose.set('useCreateIndex', true);
}

connectWithRetry();

mongoose.connection.on('connected', () => {
  console.log(`Mongoose connection open to ${mongoURI}`);
});

mongoose.connection.on('error', (error) => {
  console.log(`Mongoose connection error: ${error}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose connection disconnected');
});

export default mongoose;
