const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    avatar: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0 },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String },
        alt: { type: String },
      },
    ],
    category: {
      type: String,
      required: true,
      enum: [
        'Electronics',
        'Clothing',
        'Footwear',
        'Home & Kitchen',
        'Books',
        'Sports',
        'Toys',
        'Beauty',
        'Jewelry',
        'Accessories',
        'Other',
      ],
    },
    brand: { type: String, required: true },
    stock: { type: Number, required: true, default: 0, min: 0 },
    sold: { type: Number, default: 0 },
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    tags: [{ type: String }],
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    specifications: [{ key: String, value: String }],
    weight: { type: Number },
    dimensions: {
      length: Number,
      width: Number,
      height: Number,
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

productSchema.index({ name: 'text', description: 'text', brand: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1, rating: -1 });

module.exports = mongoose.model('Product', productSchema);
