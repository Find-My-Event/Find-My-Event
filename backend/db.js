const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is missing in .env');
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`\x1b[32m✔ MongoDB Connected: ${conn.connection.host}\x1b[0m`);
  } catch (error) {
    console.error(`\x1b[31m✘ Error connecting to MongoDB: ${error.message}\x1b[0m`);
    
    if (error.message.includes('querySrv') || error.message.includes('ECONNREFUSED')) {
      console.log('\n\x1b[33m--- ACTION REQUIRED ---\x1b[0m');
      console.log('1. Go to https://cloud.mongodb.com/');
      console.log('2. Go to "Network Access" under "Security" on the left sidebar.');
      console.log('3. Add your current IP address, or add "0.0.0.0/0" to allow access from anywhere (recommended for local development).');
      console.log('4. Ensure your connection string in .env is correct.');
      console.log('\x1b[33m------------------------\x1b[0m\n');
    }
    
    process.exit(1);
  }
};

module.exports = connectDB;
