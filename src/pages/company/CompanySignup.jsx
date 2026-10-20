import React, { useState, useEffect } from 'react';
import { useCompanyAuth } from '../../context/CompanyAuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Building2, Globe, MapPin, Briefcase, Image as ImageIcon, Eye, EyeOff, CreditCard, CheckCircle2, AlertCircle, Tag, X } from 'lucide-react';
import CompanyPendingApproval from './CompanyPendingApproval';
import DownloadReceipt from '../../components/DownloadReceipt';

export default function CompanySignup() {
  const [step, setStep] = useState(1);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [registrationFee, setRegistrationFee] = useState(199);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    logo: null,
    email: '',
    password: '',
    industry: '',
    website: '',
    location: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingApprovalData, setPendingApprovalData] = useState(null);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [showPendingApproval, setShowPendingApproval] = useState(false);
  const { signup } = useCompanyAuth();
  const navigate = useNavigate();

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  // Fetch registration fee from settings
  useEffect(() => {
    const fetchFee = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/public/fees?t=${Date.now()}`);
        const data = await res.json();
        if (data.success && data.fees?.companyRegistrationFee !== undefined) {
          setRegistrationFee(Number(data.fees.companyRegistrationFee));
        }
      } catch (err) {
        console.error('Failed to fetch registration fee:', err);
      }
    };
    fetchFee();
    // Refetch fee every 2 seconds to get latest from admin settings
    const interval = setInterval(fetchFee, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setError('');
    // Validate required fields
    if (!formData.name || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }
    // Move to payment step
    setStep(2);
  };

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }
    setCouponError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/public/coupons/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCode.toUpperCase(),
          applicableTo: 'Company',
          amount: registrationFee
        })
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(data.coupon);
        setCouponDiscount(data.discountAmount);
        setCouponError('');
      } else {
        setCouponError(data.message || 'Invalid coupon code');
        setAppliedCoupon(null);
        setCouponDiscount(0);
      }
    } catch (err) {
      setCouponError('Failed to validate coupon');
      setAppliedCoupon(null);
      setCouponDiscount(0);
    }
  };

  const removeCoupon = () => {
    setCouponCode('');
    setAppliedCoupon(null);
    setCouponDiscount(0);
    setCouponError('');
  };

  const finalAmount = Math.max(0, registrationFee - couponDiscount);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setPaymentProcessing(true);
    setError('');

    try {
      // Step 1: Create Razorpay order
      const orderRes = await fetch(`${import.meta.env.VITE_API_URL}/payments/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          companyName: formData.name,
          amount: finalAmount
        })
      });

      const orderData = await orderRes.json();
      if (!orderData.success) {
        setError(orderData.message || 'Failed to create payment order');
        setPaymentProcessing(false);
        return;
      }

      // Step 2: Open Razorpay checkout
      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.orderId,
        name: 'MyCastNow',
        description: `Company Registration Fee - ${formData.name}`,
        prefill: {
          email: formData.email,
          name: formData.name
        },
        handler: async (response) => {
          try {
            // Step 3: Verify payment
            const verifyRes = await fetch(`${import.meta.env.VITE_API_URL}/payments/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyRes.json();
            if (!verifyData.success) {
              setError('Payment verification failed. Please try again.');
              setPaymentProcessing(false);
              return;
            }

            // Step 4: Complete company registration
            setLoading(true);
            const data = new FormData();
            Object.keys(formData).forEach(key => {
              if (formData[key] !== null) {
                data.append(key, formData[key]);
              }
            });
            // Add payment info
            data.append('paymentId', response.razorpay_payment_id);
            data.append('orderId', response.razorpay_order_id);
            data.append('registrationFee', String(finalAmount));
            data.append('couponCode', appliedCoupon?.code || '');
            data.append('discountAmount', String(couponDiscount));

            setPaymentDetails({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              amount: finalAmount,
              originalAmount: registrationFee,
              discount: couponDiscount,
              couponCode: appliedCoupon?.code || null,
              timestamp: new Date().toLocaleString('en-IN')
            });
            
            const result = await signup(data);
            if (result?.pendingApproval) {
              setPendingApprovalData(result.company || { name: formData.name, email: formData.email });
              setStep(3);
            } else {
              navigate('/company/dashboard');
            }
          } catch (err) {
            console.error('Registration error:', err);
            setError('Registration failed after payment. Please contact support.');
            setPaymentProcessing(false);
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPaymentProcessing(false);
            setError('Payment cancelled. Please try again.');
          }
        },
        theme: {
          color: '#2563eb'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Payment error:', err);
      setError('Failed to initiate payment. Please try again.');
      setPaymentProcessing(false);
    }
  };

  // Step 3: Receipt Download
  if (step === 3 && paymentDetails && pendingApprovalData && !showPendingApproval) {
    return (
      <div className="min-h-screen bg-[#F3F7FC] flex items-center justify-center p-4 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Payment Successful</h2>
            <p className="text-gray-500 mt-2">Your registration has been processed</p>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-emerald-800 font-medium">✓ Payment received and verified</p>
            <p className="text-xs text-emerald-700 mt-1">Your company profile is now under review</p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Amount Paid</span>
              <span className="font-bold text-gray-900">₹{paymentDetails.amount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Payment ID</span>
              <span className="font-mono text-xs text-gray-700">{paymentDetails.paymentId.substring(0, 12)}...</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Date</span>
              <span className="text-gray-700">{paymentDetails.timestamp}</span>
            </div>
          </div>

          <DownloadReceipt receipt={{
            paymentId: paymentDetails.paymentId,
            orderId: paymentDetails.orderId,
            amount: paymentDetails.amount,
            name: pendingApprovalData.name,
            phone: formData.email,
            date: paymentDetails.timestamp
          }} />

          <button
            onClick={() => setShowPendingApproval(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition-all mt-4"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  // Show pending approval screen after successful signup
  if (showPendingApproval && pendingApprovalData) {
    return <CompanyPendingApproval companyData={pendingApprovalData} onBackToLogin={() => navigate('/company/login')} />;
  }

  // Step 1: Details Form
  if (step === 1) {
    return (
      <div className="min-h-screen bg-[#F3F7FC] flex items-center justify-center p-4 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Register Company</h2>
            <p className="text-gray-500 mt-2">Join the platform to start casting talent</p>
          </div>
          
          {error && <div className="bg-red-50 text-red-500 border border-red-100 p-3 rounded-lg mb-6 text-sm text-center font-medium">{error}</div>}
          
          <form onSubmit={handleDetailsSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="e.g. Acme Corp" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} required
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="company@example.com" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleInputChange} required
                      className="w-full pl-10 pr-12 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="••••••••" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="text" name="industry" value={formData.industry} onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="e.g. Technology" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="url" name="website" value={formData.website} onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="https://example.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input type="text" name="location" value={formData.location} onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="City, Country" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Logo</label>
              <div className="flex items-center gap-4">
                {formData.logo && (
                  <div className="w-16 h-16 rounded-xl border border-gray-200 overflow-hidden shrink-0 bg-gray-50 flex items-center justify-center p-1">
                    <img src={URL.createObjectURL(formData.logo)} alt="Preview" className="w-full h-full object-contain" />
                  </div>
                )}
                <div className="relative flex-1">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="file" name="logo" accept="image/*" onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                </div>
              </div>
            </div>
            
            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-opacity shadow-md"
            >
              Continue to Payment
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account? <Link to="/company/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    );
  }

  // Step 2: Payment
  if (step === 2) {
    return (
      <div className="min-h-screen bg-[#F3F7FC] flex items-center justify-center p-4 py-12">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <CreditCard className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Complete Registration</h2>
            <p className="text-gray-500 mt-2">One-time registration fee to activate your account</p>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 border border-red-200 p-4 rounded-lg mb-6 flex items-start gap-3">
              <AlertCircle size={20} className="shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700 font-medium">Company Name</span>
              <span className="text-gray-900 font-semibold">{formData.name}</span>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700 font-medium">Email</span>
              <span className="text-gray-900 font-semibold text-sm">{formData.email}</span>
            </div>
            <div className="border-t border-blue-200 pt-4 flex items-center justify-between">
              <span className="text-gray-700 font-medium">Registration Fee</span>
              <span className="text-2xl font-bold text-blue-600">₹{registrationFee}</span>
            </div>
          </div>

          {/* Coupon Section */}
          <div className="mb-6 p-4 bg-purple-50 border border-purple-200 rounded-xl">
            <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Tag size={16} className="text-purple-600" />
              Have a Coupon Code?
            </label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-lg">
                <div>
                  <p className="text-sm font-bold text-green-700">{appliedCoupon.code}</p>
                  <p className="text-xs text-green-600">Discount: ₹{couponDiscount}</p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-green-600 hover:text-green-700"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="flex-1 px-3 py-2 border border-purple-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={validateCoupon}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors"
                >
                  Apply
                </button>
              </div>
            )}
            {couponError && <p className="text-xs text-red-600 mt-2">{couponError}</p>}
          </div>

          {/* Price Breakdown */}
          {couponDiscount > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Original Price</span>
                <span className="text-gray-900 font-semibold">₹{registrationFee}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-600 font-semibold">Discount</span>
                <span className="text-green-600 font-semibold">-₹{couponDiscount}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 flex justify-between">
                <span className="text-gray-800 font-bold">Final Amount</span>
                <span className="text-lg font-bold text-blue-600">₹{finalAmount}</span>
              </div>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle2 size={20} className="text-blue-600 shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-semibold mb-1">What's included:</p>
                <ul className="space-y-1 text-xs">
                  <li>✓ Full access to casting platform</li>
                  <li>✓ Post unlimited casting calls</li>
                  <li>✓ Direct messaging with creators</li>
                  <li>✓ Verified company badge</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            onClick={handlePaymentSubmit}
            disabled={paymentProcessing || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl font-semibold transition-all shadow-md flex items-center justify-center gap-2"
          >
            {paymentProcessing || loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard size={18} />
                Pay ₹{finalAmount} & Complete Registration
              </>
            )}
          </button>

          <button
            onClick={() => { setError(''); setStep(1); }}
            disabled={paymentProcessing || loading}
            className="w-full mt-3 border border-gray-300 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-all disabled:opacity-60"
          >
            Back to Details
          </button>

          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500 mb-2">Need help?</p>
            <div className="flex items-center justify-center gap-3 text-xs">
              <a href="mailto:info@mycastnow.com" className="text-blue-600 hover:text-blue-700">info@mycastnow.com</a>
              <span className="text-gray-300">•</span>
              <a href="tel:+919918309983" className="text-blue-600 hover:text-blue-700">+91 9918309983</a>
            </div>
          </div>
          
          <p className="text-center text-gray-500 text-xs mt-4">
            Already have an account? <Link to="/company/login" className="text-blue-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    );
  }

  return null;
}
