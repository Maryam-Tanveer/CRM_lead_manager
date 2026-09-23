const mongoose = require('mongoose');

let memoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && uri.trim() !== '') {
    try {
      const conn = await mongoose.connect(uri);
      return conn;
    } catch (error) {
      if (process.env.NODE_ENV === 'production') {
        throw error;
      }
    }
  }

  const { MongoMemoryServer } = require('mongodb-memory-server');
  memoryServer = await MongoMemoryServer.create();
  const memoryUri = memoryServer.getUri();
  const conn = await mongoose.connect(memoryUri);
  return conn;
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};

module.exports = {
  connectDB,
  disconnectDB
};
