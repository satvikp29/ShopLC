const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  createReview,
  getCategories,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.route('/').get(getProducts).post(protect, admin, createProduct);
router.route('/:id').get(getProductById).put(protect, admin, updateProduct).delete(protect, admin, deleteProduct);
router.post('/:id/reviews', protect, createReview);

module.exports = router;
