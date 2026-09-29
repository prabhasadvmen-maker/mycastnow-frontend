import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CompanyAuthContext = createContext();

export const useCompanyAuth = () => useContext(CompanyAuthContext);

export const CompanyAuthProvider = ({ children }) => {
  const [companyUser, setCompanyUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkCompanyUser = async () => {
      const token = localStorage.getItem('companyToken');
      if (token) {
        try {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/companyAuth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCompanyUser(res.data);
        } catch (err) {
          console.error('Company session expired or invalid token');
          localStorage.removeItem('companyToken');
        }
      }
      setLoading(false);
    };
    checkCompanyUser();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/companyAuth/login`, { email, password });
      const { token, company, pendingApproval } = res.data;

      // If account pending admin approval - don't set company user, throw so caller shows waiting screen
      if (pendingApproval || !token) {
        const err = new Error('Pending Approval');
        err.response = { status: 202, data: res.data };
        throw err;
      }

      localStorage.setItem('companyToken', token);
      localStorage.removeItem('isAdminImpersonating');
      setCompanyUser(company);
    } catch (error) {
      // Re-throw so CompanyLogin.jsx can inspect error.response.status
      throw error;
    }
  };

  const signup = async (formData) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/companyAuth/signup`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    // Signup now returns pendingApproval: true (no token), just return the data
    return res.data;
  };

  const adminLoginAsCompany = async (companyId) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/companyAuth/admin-login/${companyId}`);
    const { token, company } = res.data;
    localStorage.setItem('companyToken', token);
    localStorage.setItem('isAdminImpersonating', 'true');
    setCompanyUser(company);
  };

  const logout = () => {
    localStorage.removeItem('companyToken');
    localStorage.removeItem('isAdminImpersonating');
    setCompanyUser(null);
  };

  return (
    <CompanyAuthContext.Provider value={{ companyUser, setCompanyUser, loading, login, signup, adminLoginAsCompany, logout }}>
      {children}
    </CompanyAuthContext.Provider>
  );
};
