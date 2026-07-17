require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI is undefined! Check your .env file.');
  process.exit(1);
}

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Atlas connection OK!'))
  .catch(err => {
    console.error('❌ Atlas connection ERROR:');
    if (err.message.includes('Authentication failed')) {
      console.error('-> Authentication failed: Check username/password and DB user permissions.');
    } else if (err.message.includes('getaddrinfo ENOTFOUND')) {
      console.error('-> DNS/hostname error: Check cluster name in the URI.');
    } else {
      console.error(err.message);
    }
    process.exit(1);
  });