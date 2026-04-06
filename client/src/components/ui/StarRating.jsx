import React from 'react';

const StarRating = ({ rating = 0, numReviews, size = 'md', interactive = false, onRate }) => {
  const stars = [1, 2, 3, 4, 5];
  const sizeClass = size === 'sm' ? 'stars-sm' : size === 'lg' ? 'stars-lg' : 'stars-md';

  return (
    <div className={`star-rating ${sizeClass}`}>
      <div className="stars">
        {stars.map((star) => (
          <span
            key={star}
            className={`star ${star <= Math.round(rating) ? 'filled' : 'empty'} ${interactive ? 'interactive' : ''}`}
            onClick={() => interactive && onRate && onRate(star)}
          >
            &#9733;
          </span>
        ))}
      </div>
      {numReviews !== undefined && (
        <span className="review-count">({numReviews})</span>
      )}
    </div>
  );
};

export default StarRating;
