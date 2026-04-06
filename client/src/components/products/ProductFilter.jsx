import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const CATEGORIES = ['Electronics', 'Clothing', 'Footwear', 'Home & Kitchen', 'Books', 'Sports', 'Toys', 'Beauty', 'Jewelry', 'Accessories'];

const ProductFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    sort: searchParams.get('sort') || '',
  });

  const applyFilters = () => {
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.rating) params.rating = filters.rating;
    if (filters.sort) params.sort = filters.sort;
    const keyword = searchParams.get('keyword');
    if (keyword) params.keyword = keyword;
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({ category: '', minPrice: '', maxPrice: '', rating: '', sort: '' });
    const keyword = searchParams.get('keyword');
    setSearchParams(keyword ? { keyword } : {});
  };

  return (
    <aside className="product-filter">
      <div className="filter-header">
        <h3>Filters</h3>
        <button className="clear-filters-btn" onClick={clearFilters}>Clear All</button>
      </div>

      <div className="filter-section">
        <h4>Sort By</h4>
        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
          className="filter-select"
        >
          <option value="">Relevance</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="newest">Newest First</option>
          <option value="rating">Top Rated</option>
          <option value="popular">Most Popular</option>
        </select>
      </div>

      <div className="filter-section">
        <h4>Category</h4>
        {CATEGORIES.map((cat) => (
          <label key={cat} className="filter-checkbox">
            <input
              type="radio"
              name="category"
              value={cat}
              checked={filters.category === cat}
              onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            />
            {cat}
          </label>
        ))}
      </div>

      <div className="filter-section">
        <h4>Price Range</h4>
        <div className="price-range">
          <input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            className="price-input"
          />
          <span>-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            className="price-input"
          />
        </div>
      </div>

      <div className="filter-section">
        <h4>Minimum Rating</h4>
        {[4, 3, 2, 1].map((r) => (
          <label key={r} className="filter-checkbox">
            <input
              type="radio"
              name="rating"
              value={r}
              checked={filters.rating === String(r)}
              onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
            />
            {r}+ Stars
          </label>
        ))}
      </div>

      <button className="apply-filters-btn" onClick={applyFilters}>Apply Filters</button>
    </aside>
  );
};

export default ProductFilter;
