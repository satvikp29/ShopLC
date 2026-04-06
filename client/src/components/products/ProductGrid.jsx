import React from 'react';
import ProductCard from '../ui/ProductCard';
import Loader from '../ui/Loader';

const ProductGrid = ({ products, loading }) => {
  if (loading) return <Loader size="lg" fullPage />;

  if (!products || products.length === 0) {
    return (
      <div className="no-products">
        <p>No products found.</p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;
