import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const addFavoritesField = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/recipe-share');
    console.log('Connected to MongoDB');

    // Update all users to have an empty favorites array if they don't have one
    const result = await User.updateMany(
      { favorites: { $exists: false } },
      { $set: { favorites: [] } }
    );

    console.log(`Updated ${result.modifiedCount} users with favorites field`);

    // Also check and log current users
    const users = await User.find({}, 'email fullName favorites');
    console.log('\nCurrent users:');
    users.forEach(user => {
      console.log(`- ${user.email}: ${user.favorites ? user.favorites.length : 0} favorites`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error updating users:', error);
    process.exit(1);
  }
};

addFavoritesField();
