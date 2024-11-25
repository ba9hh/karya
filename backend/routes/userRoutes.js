const express = require("express");
const authMiddleware = require("../authMidlleware");
const {fetchUser,fetchUserHouses,fetchUserLikedHouses,toggleLike,updateUserInformations,updateUserPhoneNumber,updatePassword,deleteUser} = require("../controllers/userController");

const router = express.Router();

router.get('/user/:userId',fetchUser);
router.get('/user-posts',authMiddleware,fetchUserHouses);
router.get('/user-liked-houses', authMiddleware,fetchUserLikedHouses);
router.post('/toggle-like', authMiddleware,toggleLike);
router.put('/update-user', authMiddleware,updateUserInformations)
router.put('/update-user-number', authMiddleware,updateUserPhoneNumber)
router.post('/update-password', authMiddleware,updatePassword)
router.delete('/user', authMiddleware,deleteUser)

module.exports = router;