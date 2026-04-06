import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../redux/slices/authSlice';
import { userAPI } from '../utils/api';
import Alert from '../components/ui/Alert';

const ProfilePage = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState('profile');
  const [success, setSuccess] = useState('');
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    password: '',
    confirmPassword: '',
  });
  const [formError, setFormError] = useState('');
  const [addressForm, setAddressForm] = useState({
    fullName: '', phone: '', addressLine1: '', addressLine2: '',
    city: '', state: '', postalCode: '', country: 'India', isDefault: false,
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (profileForm.password && profileForm.password !== profileForm.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    const updateData = { name: profileForm.name, phone: profileForm.phone };
    if (profileForm.password) updateData.password = profileForm.password;
    const result = await dispatch(updateProfile(updateData));
    if (updateProfile.fulfilled.match(result)) setSuccess('Profile updated successfully!');
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      await userAPI.addAddress(addressForm);
      setSuccess('Address added!');
      setAddressForm({ fullName: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', postalCode: '', country: 'India', isDefault: false });
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to add address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    try {
      await userAPI.deleteAddress(addressId);
      setSuccess('Address removed');
    } catch {
      setFormError('Failed to remove address');
    }
  };

  return (
    <div className="profile-page">
      <h1>My Profile</h1>

      <div className="profile-layout">
        <div className="profile-sidebar">
          <div className="profile-avatar-section">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="profile-avatar" />
            ) : (
              <div className="profile-avatar-placeholder">{user?.name?.charAt(0).toUpperCase()}</div>
            )}
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>
            {user?.role === 'admin' && <span className="admin-badge">Admin</span>}
          </div>

          <nav className="profile-nav">
            {['profile', 'addresses', 'security'].map((tab) => (
              <button
                key={tab}
                className={`profile-nav-btn ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="profile-content">
          {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
          {(error || formError) && <Alert type="error" message={error || formError} onClose={() => setFormError('')} />}

          {activeTab === 'profile' && (
            <div className="profile-section">
              <h2>Personal Information</h2>
              <form onSubmit={handleProfileSubmit} className="profile-form">
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input type="text" className="form-input" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input type="email" className="form-input" value={user?.email} disabled />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" className="form-input" value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })} />
                </div>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="profile-section">
              <h2>Saved Addresses</h2>
              <div className="addresses-list">
                {user?.addresses?.map((addr) => (
                  <div key={addr._id} className={`address-card ${addr.isDefault ? 'default-address' : ''}`}>
                    {addr.isDefault && <span className="default-badge">Default</span>}
                    <p><strong>{addr.fullName}</strong></p>
                    <p>{addr.addressLine1}{addr.addressLine2 ? ', ' + addr.addressLine2 : ''}</p>
                    <p>{addr.city}, {addr.state} {addr.postalCode}</p>
                    <p>{addr.country} | {addr.phone}</p>
                    <button className="btn-danger-sm" onClick={() => handleDeleteAddress(addr._id)}>Remove</button>
                  </div>
                ))}
              </div>

              <h3>Add New Address</h3>
              <form onSubmit={handleAddAddress} className="address-form">
                {['fullName', 'phone', 'addressLine1', 'addressLine2', 'city', 'state', 'postalCode', 'country'].map((field) => (
                  <div key={field} className="form-group">
                    <label className="form-label">{field.replace(/([A-Z])/g, ' $1').replace(/^./, c => c.toUpperCase())}</label>
                    <input
                      type="text"
                      className="form-input"
                      value={addressForm[field]}
                      onChange={(e) => setAddressForm({ ...addressForm, [field]: e.target.value })}
                      required={field !== 'addressLine2'}
                    />
                  </div>
                ))}
                <label className="checkbox-label">
                  <input type="checkbox" checked={addressForm.isDefault} onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })} />
                  Set as default address
                </label>
                <button type="submit" className="btn-primary">Add Address</button>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="profile-section">
              <h2>Change Password</h2>
              <form onSubmit={handleProfileSubmit} className="profile-form">
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input type="password" className="form-input" value={profileForm.password} onChange={(e) => setProfileForm({ ...profileForm, password: e.target.value })} placeholder="Min 6 characters" minLength={6} />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input type="password" className="form-input" value={profileForm.confirmPassword} onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })} placeholder="Confirm password" />
                </div>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
