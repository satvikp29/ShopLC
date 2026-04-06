import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../redux/slices/productSlice';
import { formatPrice } from '../../utils/helpers';
import AdminSidebar from '../../components/admin/AdminSidebar';
import Loader from '../../components/ui/Loader';
import Alert from '../../components/ui/Alert';

const CATEGORIES = ['Electronics', 'Clothing', 'Footwear', 'Home & Kitchen', 'Books', 'Sports', 'Toys', 'Beauty', 'Jewelry', 'Accessories', 'Other'];

const defaultForm = {
  name: '', description: '', shortDescription: '', price: '', discountPrice: '',
  category: 'Electronics', brand: '', stock: '', isFeatured: false,
  images: [{ url: '', alt: '' }],
  specifications: [{ key: '', value: '' }],
  tags: '',
};

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { items: products, loading, error, pages, page } = useSelector((state) => state.products);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [success, setSuccess] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchProducts({ page: currentPage, limit: 20 }));
  }, [dispatch, currentPage]);

  const handleEdit = (product) => {
    setEditingId(product._id);
    setForm({
      ...product,
      tags: product.tags?.join(', ') || '',
      images: product.images?.length ? product.images : [{ url: '', alt: '' }],
      specifications: product.specifications?.length ? product.specifications : [{ key: '', value: '' }],
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
      stock: Number(form.stock),
      tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
      images: form.images.filter((img) => img.url),
      specifications: form.specifications.filter((s) => s.key && s.value),
    };

    let result;
    if (editingId) {
      result = await dispatch(updateProduct({ id: editingId, data }));
    } else {
      result = await dispatch(createProduct(data));
    }

    if (createProduct.fulfilled.match(result) || updateProduct.fulfilled.match(result)) {
      setSuccess(editingId ? 'Product updated!' : 'Product created!');
      setShowForm(false);
      setEditingId(null);
      setForm(defaultForm);
      dispatch(fetchProducts({ page: currentPage, limit: 20 }));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this product?')) {
      const result = await dispatch(deleteProduct(id));
      if (deleteProduct.fulfilled.match(result)) setSuccess('Product deleted');
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <div className="admin-page-header">
          <h1>Products</h1>
          <button className="btn-primary" onClick={() => { setShowForm(true); setEditingId(null); setForm(defaultForm); }}>
            + Add Product
          </button>
        </div>

        {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
        {error && <Alert type="error" message={error} />}

        {showForm && (
          <div className="admin-form-overlay">
            <div className="admin-form-modal">
              <div className="modal-header">
                <h2>{editingId ? 'Edit Product' : 'Add Product'}</h2>
                <button onClick={() => setShowForm(false)}>&#10005;</button>
              </div>
              <form onSubmit={handleSubmit} className="admin-product-form">
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>Name *</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Brand *</label>
                    <input type="text" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} required className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="form-input">
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Price *</label>
                    <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required min="0" step="0.01" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Discount Price</label>
                    <input type="number" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} min="0" step="0.01" className="form-input" />
                  </div>
                  <div className="form-group">
                    <label>Stock *</label>
                    <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required min="0" className="form-input" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={4} className="form-input" />
                </div>
                <div className="form-group">
                  <label>Short Description</label>
                  <input type="text" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="form-input" />
                </div>
                <div className="form-group">
                  <label>Tags (comma separated)</label>
                  <input type="text" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="form-input" placeholder="tag1, tag2, tag3" />
                </div>
                <div className="form-group">
                  <label>Image URL</label>
                  <input type="text" value={form.images[0]?.url || ''} onChange={(e) => setForm({ ...form, images: [{ url: e.target.value, alt: form.name }] })} className="form-input" placeholder="https://..." />
                </div>
                <div className="form-group">
                  <label className="checkbox-label">
                    <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} />
                    Featured Product
                  </label>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {loading && !showForm ? <Loader /> : (
          <table className="admin-table">
            <thead>
              <tr><th>Image</th><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td><img src={product.images?.[0]?.url || '/placeholder-product.jpg'} alt={product.name} className="admin-product-thumb" /></td>
                  <td>{product.name.slice(0, 40)}</td>
                  <td>{product.category}</td>
                  <td>{formatPrice(product.discountPrice || product.price)}</td>
                  <td className={product.stock < 5 ? 'low-stock-cell' : ''}>{product.stock}</td>
                  <td>⭐ {product.rating?.toFixed(1)} ({product.numReviews})</td>
                  <td>
                    <button className="btn-edit-sm" onClick={() => handleEdit(product)}>Edit</button>
                    <button className="btn-delete-sm" onClick={() => handleDelete(product._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {pages > 1 && (
          <div className="pagination">
            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setCurrentPage(p)}>{p}</button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
