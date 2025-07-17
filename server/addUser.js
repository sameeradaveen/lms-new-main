const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/nextgenfreeedu')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

async function addUser(username, password, role) {
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.log(`User '${username}' already exists!`);
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const user = new User({
      username,
      password: hashedPassword,
      role
    });

    await user.save();
    console.log(`User '${username}' created successfully with role '${role}'`);
  } catch (error) {
    console.error('Error creating user:', error.message);
  } finally {
    mongoose.connection.close();
  }
}

// Get command line arguments
const args = process.argv.slice(2);
if (args.length !== 3) {
  console.log('Usage: node addUser.js <username> <password> <role>');
  console.log('Example: node addUser.js admin admin123 admin');
  console.log('Example: node addUser.js student student123 student');
  process.exit(1);
}

const [username, password, role] = args;

// Validate role
if (!['student', 'admin'].includes(role)) {
  console.log('Role must be either "student" or "admin"');
  process.exit(1);
}

addUser(username, password, role); 