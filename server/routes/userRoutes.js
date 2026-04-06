const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  toggleWishlist,
  getWishlist,
  getAllUsers,
  updateUser,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/profile').get(protect, getProfile).put(protect, updateProfile);
router.route('/addresses').post(protect, addAddress);
router.route('/addresses/:addressId').put(protect, updateAddress).delete(protect, deleteAddress);
router.route('/wishlist').get(protect, getWishlist);
router.put('/wishlist/:productId', protect, toggleWishlist);
router.route('/').get(protect, admin, getAllUsers);
router.put('/:id', protect, admin, updateUser);

module.exports = router;
