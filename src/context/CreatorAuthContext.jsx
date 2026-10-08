import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const CreatorAuthContext = createContext();

export const CreatorAuthProvider = ({ children }) => {
  const [creatorUser, setCreatorUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreatorUser = async () => {
      const token = localStorage.getItem('creatorToken');
      if (token) {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/creatorAuth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCreatorUser(res.data);
        } catch (error) {
          console.error("Failed to fetch creator user:", error);
          localStorage.removeItem('creatorToken');
        }
      }
      setLoading(false);
    };

    fetchCreatorUser();
  }, []);

  const sendOtp = async (phone) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/creatorAuth/send-otp`, { phone });
      return res.data;
    } catch (err) {
      return err.response?.data || { success: false, message: 'Failed to send OTP' };
    }
  };

  const resendOtp = async (phone) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/creatorAuth/resend-otp`, { phone });
      return res.data;
    } catch (err) {
      return err.response?.data || { success: false, message: 'Failed to resend OTP' };
    }
  };

  const verifyOtp = async (phone, otp) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/creatorAuth/verify-otp`, { phone, otp });
      if (res.data.success && res.data.token) {
        localStorage.setItem('creatorToken', res.data.token);
        setCreatorUser(res.data.creator);
      }
      return res.data;
    } catch (err) {
      return err.response?.data || { success: false, message: 'Failed to verify OTP' };
    }
  };

  const updateProfile = async (updateData) => {
    const token = localStorage.getItem('creatorToken');
    const res = await axios.put(`${import.meta.env.VITE_API_URL}/creatorAuth/update-profile`, updateData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.data.success) {
      setCreatorUser(res.data.creator);
    }
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('creatorToken');
    setCreatorUser(null);
  };

  return (
    <CreatorAuthContext.Provider value={{ 
      creatorUser, 
      setCreatorUser, 
      loading, 
      sendOtp, 
      resendOtp,
      verifyOtp, 
      updateProfile,
      logout 
    }}>
      {children}
    </CreatorAuthContext.Provider>
  );
};

export const useCreatorAuth = () => useContext(CreatorAuthContext);
