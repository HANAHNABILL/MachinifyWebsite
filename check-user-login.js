const mongoose = require('mongoose');
const User = require('./models/Users');
require('dotenv').config();
(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    const user = await User.findOne({ email: 'manager@fmps1.local' }).lean();
    console.log('found manager@fmps1.local', user ? 'yes' : 'no');
    if (user) console.log(user);
    const admin = await User.findOne({ email: 'admin@fmps1.local' }).lean();
    console.log('found admin@fmps1.local', admin ? 'yes' : 'no');
    if (admin) console.log(admin);
    const all = await User.find({}, 'email role isVerified').lean();
    console.log('all users:', all);
    await mongoose.disconnect();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
})();
