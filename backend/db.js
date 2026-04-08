const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error('MONGODB_URI is missing in .env');
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    if (error.message.includes('querySrv')) {
      console.error('TIP: This looks like a DNS/SRV record issue. Try the Atlas "Standard Connection String" URI (mongodb://...) instead of the SRV URI.');
    }
    if (error.message.includes('whitelist')) {
      console.error('TIP: Add your current IP in Atlas Network Access, or allow 0.0.0.0/0 temporarily for development.');
    }
    process.exit(1);
  }
};

module.exports = connectDB;
