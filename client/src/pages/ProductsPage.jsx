import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../redux/slices/productSlice';
import ProductGrid from '../components/products/ProductGrid';
import ProductFilter from '../components/products/ProductFilter';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { items: products, loading, pages, page, total } = useSelector((state) => state.products);

  const currentPage = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());
    dispatch(fetchProducts({ ...params, page: currentPage }));
  }, [dispatch, searchParams]);

  const handlePageChange = (newPage) => {
    const params = Object.fromEntries(searchParams.entries());
    setSearchParams({ ...params, page: newPage });
    window.scrollTo(0, 0);
  };

  const keyword = searchParams.get('keyword');
  const category = searchParams.get('category');

  return (
    <div className="products-page">
      <div className="products-page-header">
        <h1>
          {keyword ? `Search: "${keyword}"` : category ? category : 'All Products'}
        </h1>
        <p className="results-count">{total} products found</p>
      </div>

      <div className="products-layout">
        <ProductFilter />

        <div className="products-main">
          <ProductGrid products={products} loading={loading} />

          {pages > 1 && (
            <div className="pagination">
              <button
                className="page-btn"
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
              >
                &laquo; Prev
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`page-btn ${p === page ? 'active' : ''}`}
                  onClick={() => handlePageChange(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className="page-btn"
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= pages}
              >
                Next &raquo;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
