import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProduct, addReview } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { formatPrice, getDiscountPercent, formatDate } from '../utils/helpers';
import StarRating from '../components/ui/StarRating';
import Loader from '../components/ui/Loader';
import Alert from '../components/ui/Alert';

const ProductDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProduct: product, loading, error } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    dispatch(fetchProduct(id));
  }, [dispatch, id]);

  if (loading) return <Loader fullPage size="lg" />;
  if (error) return <Alert type="error" message={error} />;
  if (!product) return null;

  const effectivePrice = product.discountPrice || product.price;
  const discount = getDiscountPercent(product.price, product.discountPrice);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
  };

  const handleBuyNow = () => {
    dispatch(addToCart({ product, quantity }));
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setReviewError('');
    const result = await dispatch(addReview({ id: product._id, data: { rating: reviewRating, comment: reviewComment } }));
    if (addReview.fulfilled.match(result)) {
      setReviewSuccess('Review added successfully!');
      setReviewComment('');
      dispatch(fetchProduct(id));
    } else {
      setReviewError(result.payload);
    }
  };

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        {/* Image Gallery */}
        <div className="product-gallery">
          <div className="main-image">
            <img
              src={product.images?.[selectedImage]?.url || '/placeholder-product.jpg'}
              alt={product.images?.[selectedImage]?.alt || product.name}
            />
            {discount > 0 && <span className="discount-badge-lg">-{discount}%</span>}
          </div>
          {product.images?.length > 1 && (
            <div className="thumbnail-strip">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img.url}
                  alt={img.alt || product.name}
                  className={`thumbnail ${selectedImage === idx ? 'active' : ''}`}
                  onClick={() => setSelectedImage(idx)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="product-info">
          <p className="product-brand-lg">{product.brand}</p>
          <h1 className="product-name-lg">{product.name}</h1>

          <div className="product-rating-row">
            <StarRating rating={product.rating} numReviews={product.numReviews} size="md" />
          </div>

          <div className="product-pricing">
            <span className="price-current-lg">{formatPrice(effectivePrice)}</span>
            {discount > 0 && (
              <>
                <span className="price-original-lg">{formatPrice(product.price)}</span>
                <span className="discount-percent">{discount}% off</span>
              </>
            )}
          </div>

          <p className="product-short-desc">{product.shortDescription || product.description?.slice(0, 150)}</p>

          <div className="product-stock">
            {product.stock > 0 ? (
              <span className="in-stock">&#10003; In Stock ({product.stock} available)</span>
            ) : (
              <span className="out-of-stock-text">&#10007; Out of Stock</span>
            )}
          </div>

          {product.stock > 0 && (
            <div className="quantity-selector">
              <label>Quantity:</label>
              <div className="qty-controls">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}>+</button>
              </div>
            </div>
          )}

          <div className="product-actions">
            <button
              className="btn-add-cart"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>
            <button
              className="btn-buy-now"
              onClick={handleBuyNow}
              disabled={product.stock === 0}
            >
              Buy Now
            </button>
          </div>

          <div className="product-meta">
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Brand:</strong> {product.brand}</p>
            {product.tags?.length > 0 && (
              <div className="product-tags">
                {product.tags.map((tag) => <span key={tag} className="tag">{tag}</span>)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="product-tabs">
        <div className="tab-header">
          {['description', 'specifications', 'reviews'].map((tab) => (
            <button
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'reviews' && ` (${product.numReviews})`}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {activeTab === 'description' && (
            <div className="description-content">
              <p>{product.description}</p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="specifications-content">
              {product.specifications?.length > 0 ? (
                <table className="specs-table">
                  <tbody>
                    {product.specifications.map((spec, i) => (
                      <tr key={i}>
                        <td className="spec-key">{spec.key}</td>
                        <td className="spec-value">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No specifications available.</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-content">
              {reviewError && <Alert type="error" message={reviewError} />}
              {reviewSuccess && <Alert type="success" message={reviewSuccess} />}

              {user && (
                <form className="review-form" onSubmit={handleReviewSubmit}>
                  <h3>Write a Review</h3>
                  <div className="review-rating-select">
                    <label>Rating:</label>
                    <StarRating
                      rating={reviewRating}
                      interactive
                      onRate={setReviewRating}
                      size="lg"
                    />
                  </div>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    rows={4}
                    required
                    className="review-textarea"
                  />
                  <button type="submit" className="btn-submit-review">Submit Review</button>
                </form>
              )}

              <div className="reviews-list">
                {product.reviews?.length === 0 ? (
                  <p>No reviews yet. Be the first to review!</p>
                ) : (
                  product.reviews?.map((review) => (
                    <div key={review._id} className="review-card">
                      <div className="review-header">
                        <div className="reviewer-info">
                          {review.avatar ? (
                            <img src={review.avatar} alt={review.name} className="reviewer-avatar" />
                          ) : (
                            <div className="reviewer-avatar-placeholder">
                              {review.name?.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="reviewer-name">{review.name}</span>
                        </div>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      <p className="review-comment">{review.comment}</p>
                      <p className="review-date">{formatDate(review.createdAt)}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
