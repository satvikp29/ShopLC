const express = require('express');
const router = express.Router();
const {
  createStripeIntent,
  stripeWebhook,
  createRazorpayOrder,
  verifyRazorpayPayment,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/stripe/create-intent', protect, createStripeIntent);
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
router.post('/razorpay/create-order', protect, createRazorpayOrder);
router.post('/razorpay/verify', protect, verifyRazorpayPayment);

module.exports = router;
