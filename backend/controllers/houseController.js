const House = require("../models/House");
const User = require("../models/User")
const mongoose = require('mongoose');
// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public

exports.fetchAllHouses = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    const skip = (page - 1) * limit;

    const houses = await House.find({ visibility: true })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);
    res.json(houses);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public

exports.fetchHousesForConnectedUser = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Get page and limit from query parameters
    const skip = (page - 1) * limit;
    // Assuming you have req.user.id set from authentication middleware
    const userId = req.user._id;
    const likedPosts = req.user.likedPosts;
    // Fetch houses excluding those created by the current user
    const houses = await House.find({
      user: { $ne: userId },
      _id: { $nin: likedPosts },
      visibility: true,
    })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

  
    res.json(houses);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public

exports.fetchOneHouse = async (req, res) => {
  const { id } = req.params;
  try {
    const house = await House.findById(id);
    if (house) {
      res.json(house);
    } else {
      res.status(404).json({ message: "House not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public

exports.fetchOnePost =async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;
  try {
      const post = await House.findById(id);
      console.log(post.user.toString())
      console.log(userId.toString())
      console.log(post.user.toString() !== userId)
      if (!post) {
          // Post not found
          return res.status(404).json({ message: "Post not found." });
      }

      // Check if the logged-in user is the owner of the post
      if (post.user.toString() !== userId.toString()) {
          return res.status(403).json({ message: "You are not authorized to edit this post." });
      }

      res.json(post);
  } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "An unexpected error occurred." });
  }
};


// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public

exports.fetchHousesByFilter = async (req, res) => {
  const { wilaya, mo3tamdiya, lchkon, chambre } = req.body;

  let query = {};
  query.visibility=true;
  if (wilaya && wilaya !== "wilaya") {
    query.wilaya = wilaya;
  }
  if (mo3tamdiya && mo3tamdiya !== "mo3tamdiya") {
    query.mo3tamdiya = mo3tamdiya;
  }
  if (lchkon && lchkon !== "lchkon dar") {
    query.lchkon = lchkon;
  }
  if (chambre && chambre !== "nbr de chambres") {
    query.Byout = Number(chambre);
  }

  try {
    const houses = await House.find(query).sort({ _id: -1 })
    
    res.json(houses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching houses", error: err });
  }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public

exports.fetchHousesByMultipleFilters = async (req, res) => {
  const {
    wilaya,
    mo3tamdiya,
    lchkon,
    chambre,
    typeDar,
    prixMin,
    prixMax,
    prixOption,
    autres,
  } = req.body;

  let query = {};
  query.visibility=true;
  if (wilaya && wilaya !== "wilaya") {
    query.wilaya = wilaya;
  }
  if (mo3tamdiya && mo3tamdiya !== "mo3tamdiya") {
    query.mo3tamdiya = mo3tamdiya;
  }
  if (lchkon && lchkon !== "lchkon dar") {
    query.lchkon = lchkon;
  }
  if (chambre && chambre !== "nbr de chambres") {
    query.Byout = Number(chambre);
  }
  if (typeDar) {
    query.houseType = typeDar;
  }
  if (prixMin && prixMax) {
    query.prix = { $gte: Number(prixMin), $lte: Number(prixMax) };
  }
  if (prixOption && prixOption !== "jour/semaine/moins") {
    query.prixOption = prixOption;
  }

  if (Array.isArray(autres)) {
    autres.forEach((attr) => {
      switch (attr) {
        case "gaz de ville":
          query.gaz = true;
          break;
        case "Climatiseur":
          query.climatiseur = true;
          break;
        case "Jarda":
          query.jarda = true;
          break;
        case "Balcon":
          query.balcon = true;
          break;
        case "meublé":
          query.meuble = true;
          break;
        default:
          break;
      }
    });
  }

  try {
    const houses = await House.find(query).sort({ _id: -1 }); // 'House' is your MongoDB model
    res.json(houses);
  } catch (err) {
    res.status(500).json({ message: "Error fetching houses", error: err });
  }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public

exports.updateHouseVisibility = async (req, res) => {
  const { postId } = req.params;
  const { visibility } = req.body;

  try {
    const updatedPost = await House.findByIdAndUpdate(
      postId,
      { visibility },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: "Error updating visibility", error: err });
  }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public

exports.deleteHouse = async (req, res) => {
  const userId = req.user._id;
  const houseId = req.params.id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Check if the house exists and belongs to the user
    const house = await House.findOne({ _id: houseId, user: userId }).session(session);
    if (!house) {
      await session.abortTransaction();
      session.endSession();
      return res
        .status(404)
        .json({ message: "House not found or not authorized to delete" });
    }

    // Delete the house
    await House.deleteOne({ _id: houseId, user: userId }).session(session);

    // Remove the house ID from the user's posts
    await User.findByIdAndUpdate(
      userId,
      { $pull: { posts: houseId } },
      { session }
    );

    await session.commitTransaction();
    session.endSession();
    res.status(200).json({ message: "House deleted successfully" });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    console.error("Error deleting house:", err);
    res.status(500).json({ message: "Error deleting house", error: err });
  }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public

exports.updateHouseVisibility = async (req, res) => {
  const { postId } = req.params;
  const { visibility } = req.body;

  try {
    const updatedPost = await House.findByIdAndUpdate(
      postId,
      { visibility },
      { new: true }
    );

    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: "Error updating visibility", error: err });
  }
};
