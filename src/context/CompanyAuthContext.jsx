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
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/companyAuth/login`, { email, password });
    const { token, company } = res.data;
    localStorage.setItem('companyToken', token);
    localStorage.removeItem('isAdminImpersonating');
    setCompanyUser(company);
  };

  const signup = async (formData) => {
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/companyAuth/signup`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    const { token, company } = res.data;
    localStorage.setItem('companyToken', token);
    localStorage.removeItem('isAdminImpersonating');
    setCompanyUser(company);
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
