const mongoose = require('mongoose');
const Staff = require('./models/Staff');
const Student = require('./models/Student');
const moment = require('moment');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Helper to format a Date object as DD/MM/YYYY
const formatDOB = (date) => {
  if (!date) return null;
  const d = new Date(date);
  if (isNaN(d.getTime())) return null;
  return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
};

async function updatePasswords() {
  try {
    console.log('Starting password update process...');

    // Update Staff passwords
    const staffUsers = await Staff.find({ dateOfBirth: { $exists: true, $ne: null } });
    console.log(`Found ${staffUsers.length} staff users with dateOfBirth`);

    for (const user of staffUsers) {
      const dobPassword = formatDOB(user.dateOfBirth);
      if (dobPassword) {
        user.password = dobPassword; // Plain text - will be hashed by model
        await user.save();
        console.log(`Updated staff ${user.username}: password set to ${dobPassword}`);
      }
    }

    // Update Student passwords
    const studentUsers = await Student.find({ dateOfBirth: { $exists: true, $ne: null } });
    console.log(`Found ${studentUsers.length} student users with dateOfBirth`);

    for (const user of studentUsers) {
      const dobPassword = formatDOB(user.dateOfBirth);
      if (dobPassword) {
        user.password = dobPassword; // Plain text - will be hashed by model
        await user.save();
        console.log(`Updated student ${user.username}: password set to ${dobPassword}`);
      }
    }

    // Special case: Update hodit@nec.edu.in with DOB from test data
    const hoditUser = await Staff.findOne({ username: 'hodit@nec.edu.in' });
    if (hoditUser) {
      console.log('Found hodit@nec.edu.in, updating with DOB 16/10/1974');
      hoditUser.dateOfBirth = new Date(1974, 9, 16); // October 16, 1974 (month is 0-indexed)
      hoditUser.password = '16/10/1974'; // Plain text - will be hashed by model
      hoditUser.skipHash = true; // Skip hashing for DOB passwords
      await hoditUser.save();
      console.log('Updated hodit@nec.edu.in: dateOfBirth and password set');
    }

    console.log('Password update process completed successfully');
  } catch (error) {
    console.error('Error updating passwords:', error);
  } finally {
    mongoose.connection.close();
  }
}

updatePasswords();
