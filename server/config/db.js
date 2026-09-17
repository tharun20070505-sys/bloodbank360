const mongoose = require('mongoose');

let memoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (uri) {
    try {
      console.log('🔄 Attempting connection to specified MONGO_URI...');
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 15000
      });
      console.log(`✅ MongoDB Connected to External Instance: ${conn.connection.host}`);
      return conn;
    } catch (err) {
      console.warn(`⚠️ Could not connect to MONGO_URI (${err.message}). Falling back to In-Memory MongoDB...`);
    }
  }

  try {
    console.log('🚀 Initializing Embedded MongoDB Memory Server (Zero-Setup Mode)...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create({
      instance: {
        launchTimeout: 60000
      }
    });
    const memUri = memoryServer.getUri();
    
    const conn = await mongoose.connect(memUri);
    console.log(`✅ MongoDB Connected to Embedded In-Memory Instance at ${memUri}`);
    return conn;
  } catch (memErr) {
    console.error('❌ Failed to start In-Memory MongoDB Server:', memErr.message);
    throw memErr;
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
