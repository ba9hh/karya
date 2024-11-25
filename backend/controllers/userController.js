const User = require('../models/User');
const House = require('../models/House');
const bcrypt =require('bcryptjs');

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public

exports.fetchUser = async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    console.log(user)
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Send the user data in the response
    res.status(200).json(
      {name:user.name,
        profilePic:user.profilePic
        ,phoneNumber:user.phone_number,
      }
    );
  } catch (err) {
    // Handle errors
    res.status(500).json({ success: false, message: 'Error fetching user details', error: err });
  }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public

exports.fetchUserHouses = async (req, res) => {
    const  userId  = req.user._id;
    try {
  
      const userPosts = await House.find({ user: userId });
      const visiblePosts = userPosts.filter(post => post.visibility === true);
      const invisiblePosts = userPosts.filter(post => post.visibility === false);
      
      res.status(200).json({ visiblePosts, invisiblePosts });
    } catch (err) {
      res.status(500).json({ message: 'Error fetching user posts', error: err });
    }
  };

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public


exports.fetchUserLikedHouses = async (req, res) => {
  try {
      const userId = req.user._id; // Get the user ID from the auth middleware
      const user = await User.findById(userId).select('likedPosts'); // Fetch liked posts from user

      if (!user || !user.likedPosts.length) {
          return res.status(404).json({ message: 'No liked houses found' });
      }

      // Fetch all the liked houses using the likedPosts array
      const likedHouses = await House.find({ _id: { $in: user.likedPosts } });

      res.json(likedHouses); // Return the liked houses
  } catch (error) {
      console.error("Error fetching liked houses:", error);
      res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public

exports.toggleLike = async (req, res) => {
  const { houseId } = req.body;
  const userId = req.user._id;
  
  try {
      const user = await User.findById(userId);
      console.log(user.name)
      if (user.likedPosts.includes(houseId)) {
          user.likedPosts = user.likedPosts.filter(id => id.toString() !== houseId);
      } else {
          user.likedPosts.push(houseId);
      }
      console.log('Before save:', user.likedPosts);
      await user.save();
      console.log('after save:', user.likedPosts);
      res.json({ success: true });
  } catch (error) {
      console.error("Error toggling like:", error);
      res.status(500).json({ success: false, message: "Error toggling like" });
  }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public

exports.updateUserInformations = async (req, res) => {
  const userId = req.user.id; // Assuming `verifyToken` attaches user ID to `req.user`
  const { username, phoneNumber } = req.body;

  try {
    // Find the user and update the username and phone number
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name: username, phone_number: phoneNumber },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User details updated successfully",
      user: updatedUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public

exports.updateUserPhoneNumber = async (req, res) => {
  const userId = req.user.id; 
  const { phoneNumber } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { phone_number: phoneNumber },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public

exports.updatePassword = async (req, res) => {
  const userId = req.user.id; 
  const { currentPassword, newPassword } = req.body;
  const bcryptSalt = bcrypt.genSaltSync(10);

  try {
    // Validate inputs
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters' });
    }

    // Fetch the user from the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the current password with the stored hash
    const isMatch = bcrypt.compareSync(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash the new password using your bcryptSalt logic
    const hashedPassword = bcrypt.hashSync(newPassword, bcryptSalt);

    // Update the user's password in the database
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
exports.deleteUser = async (req, res) => {
    const  userId  = req.user._id;
  
    try {
      // Delete the user
      await User.deleteOne({ _id: userId });
  
      // Delete all posts associated with the user
      await House.deleteMany({ user: userId });
  
      res.status(200).json({ message: 'User and all associated posts deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: 'Error deleting user and posts', error: err });
    }
  }