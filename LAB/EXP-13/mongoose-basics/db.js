// Section 5 and 8: connecting to MongoDB with Mongoose.
//
// The sheet passes { useNewUrlParser: true, useUnifiedTopology: true }. Those options were
// removed: with Mongoose 9 they stop the connection with
// "MongoParseError: options usenewurlparser, useunifiedtopology are not supported".
// They are simply left out here (they have been the default behaviour since driver 4).

const mongoose = require('mongoose');

// Local server by default. For Atlas or a server with a password, set MONGODB_URI, e.g.
//   mongodb://myuser:PASSWORD@127.0.0.1:27017/schoolDB?authSource=admin
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/schoolDB';

const connectDB = async () => {
  try {
    // serverSelectionTimeoutMS: give up after 5 s instead of the default 30 s if mongod is not running
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    const { host, port, name } = mongoose.connection;
    console.log(`Database connected: ${host}:${port}/${name}`);
  } catch (error) {
    console.error('Connection error:', error.message);
    process.exit(1);          // nothing else can work without the database
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  console.log('Database disconnected');
};

// Ctrl + C: close the connection cleanly before exiting
process.on('SIGINT', async () => {
  await disconnectDB();
  process.exit(0);
});

module.exports = { connectDB, disconnectDB };
