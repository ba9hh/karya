const express = require("express");
const {
  fetchAllHouses,
  fetchHousesForConnectedUser,
  fetchOneHouse,
  fetchOnePost,
  fetchHousesByFilter,
  fetchHousesByMultipleFilters,
  updateHouseVisibility,
  deleteHouse,
} = require("../controllers/houseController");
const authMiddleware = require("../authMidlleware");

const router = express.Router();

router.get("/houses", fetchAllHouses);
router.get("/houses-to-user", authMiddleware, fetchHousesForConnectedUser);
router.get("/house/:id", fetchOneHouse);
router.get("/post/:id",authMiddleware, fetchOnePost);
router.put("/house/:postId/visibility",updateHouseVisibility);
router.delete("/house/:id", authMiddleware, deleteHouse);
router.post("/houses-filter", fetchHousesByFilter);
router.post("/houses-multiple-filter", fetchHousesByMultipleFilters);

module.exports = router;
