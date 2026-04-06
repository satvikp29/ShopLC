import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder } from '../redux/slices/orderSlice';
import { clearCart } from '../redux/slices/cartSlice';
import { paymentAPI } from '../utils/api';
import OrderSummary from '../components/checkout/OrderSummary';
import Alert from '../components/ui/Alert';

const STEPS = ['Shipping', 'Payment', 'Review'];

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totals } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.orders);

  const [step, setStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [processing, setProcessing] = useState(false);
  const [payError, setPayError] = useState('');

  const defaultAddress = user?.addresses?.find((a) => a.isDefault) || user?.addresses?.[0];
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine1: defaultAddress?.addressLine1 || '',
    addressLine2: defaultAddress?.addressLine2 || '',
    city: defaultAddress?.city || '',
    state: defaultAddress?.state || '',
    postalCode: defaultAddress?.postalCode || '',
    country: defaultAddress?.country || 'India',
  });

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    setStep(1);
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);
    setPayError('');

    try {
      const orderData = {
        items: items.map((item) => ({
          product: item._id,
          name: item.name,
          image: item.images?.[0]?.url || '',
          price: item.discountPrice || item.price,
          quantity: item.quantity,
        })),
        shippingAddress,
        paymentMethod,
        ...totals,
      };

      const result = await dispatch(createOrder(orderData));
      if (!createOrder.fulfilled.match(result)) {
        setPayError(result.payload);
        setProcessing(false);
        return;
      }

      const order = result.payload.order;

      if (paymentMethod === 'cod') {
        dispatch(clearCart());
        navigate(`/orders/${order._id}?success=true`);
        return;
      }

      if (paymentMethod === 'razorpay') {
        const rpResult = await paymentAPI.createRazorpayOrder({ amount: totals.totalPrice });
        const rpOrder = rpResult.data.order;

        const options = {
          key: process.env.REACT_APP_RAZORPAY_KEY_ID,
          amount: rpOrder.amount,
          currency: rpOrder.currency,
          name: 'ShopLC',
          description: `Order #${order.orderNumber}`,
          order_id: rpOrder.id,
          handler: async (response) => {
            try {
              await paymentAPI.verifyRazorpayPayment({
                ...response,
                orderId: order._id,
              });
              dispatch(clearCart());
              navigate(`/orders/${order._id}?success=true`);
            } catch {
              setPayError('Payment verification failed. Contact support.');
            }
          },
          prefill: { name: user.name, email: user.email },
          theme: { color: '#2563eb' },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
        return;
      }

      if (paymentMethod === 'stripe') {
        navigate(`/checkout/stripe-payment?orderId=${order._id}&amount=${totals.totalPrice}`);
        return;
      }
    } catch (err) {
      setPayError(err.message || 'Something went wrong');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-stepper">
        {STEPS.map((s, i) => (
          <div key={s} className={`step ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
            <span className="step-number">{i + 1}</span>
            <span className="step-label">{s}</span>
          </div>
        ))}
      </div>

      <div className="checkout-layout">
        <div className="checkout-main">
          {step === 0 && (
            <form className="shipping-form" onSubmit={handleShippingSubmit}>
              <h2>Shipping Address</h2>
              {['fullName', 'phone', 'addressLine1', 'addressLine2', 'city', 'state', 'postalCode', 'country'].map((field) => (
                <div key={field} className="form-group">
                  <label className="form-label">
                    {field.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase())}
                    {field !== 'addressLine2' && ' *'}
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    value={shippingAddress[field]}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, [field]: e.target.value })}
                    required={field !== 'addressLine2'}
                  />
                </div>
              ))}
              <button type="submit" className="btn-next">Continue to Payment</button>
            </form>
          )}

          {step === 1 && (
            <div className="payment-step">
              <h2>Payment Method</h2>
              <div className="payment-options">
                {[
                  { value: 'stripe', label: 'Credit/Debit Card (Stripe)', icon: '💳' },
                  { value: 'razorpay', label: 'Razorpay (UPI, Cards, NetBanking)', icon: '📱' },
                  { value: 'cod', label: 'Cash on Delivery', icon: '💵' },
                ].map((opt) => (
                  <label key={opt.value} className={`payment-option ${paymentMethod === opt.value ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value={opt.value}
                      checked={paymentMethod === opt.value}
                      onChange={() => setPaymentMethod(opt.value)}
                    />
                    <span>{opt.icon} {opt.label}</span>
                  </label>
                ))}
              </div>
              <div className="payment-nav">
                <button className="btn-back" onClick={() => setStep(0)}>Back</button>
                <button className="btn-next" onClick={() => setStep(2)}>Review Order</button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="review-step">
              <h2>Review Your Order</h2>

              <div className="review-section">
                <h3>Shipping To</h3>
                <p>{shippingAddress.fullName}</p>
                <p>{shippingAddress.addressLine1}{shippingAddress.addressLine2 ? ', ' + shippingAddress.addressLine2 : ''}</p>
                <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}</p>
                <p>{shippingAddress.country}</p>
                <button className="btn-edit" onClick={() => setStep(0)}>Edit</button>
              </div>

              <div className="review-section">
                <h3>Payment</h3>
                <p>{paymentMethod === 'stripe' ? 'Credit/Debit Card (Stripe)' : paymentMethod === 'razorpay' ? 'Razorpay' : 'Cash on Delivery'}</p>
                <button className="btn-edit" onClick={() => setStep(1)}>Edit</button>
              </div>

              {payError && <Alert type="error" message={payError} />}
              {error && <Alert type="error" message={error} />}

              <button
                className="btn-place-order"
                onClick={handlePlaceOrder}
                disabled={processing || loading}
              >
                {processing || loading ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          )}
        </div>

        <div className="checkout-sidebar">
          <OrderSummary items={items} totals={totals} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
