import React from 'react';
import LoginBrandSection from '../components/login/LoginBrandSection/LoginBrandSection';
import LoginFormCard from '../components/login/LoginFormCard/LoginFormCard';
import '../styles/login.css';
import '../styles/login-responsive.css';

const LoginPage = () => (
  <div className="login-page">
    <div className="login-page__left">
      <LoginBrandSection />
    </div>
    <div className="login-page__right">
      <LoginFormCard />
    </div>
  </div>
);

export default LoginPage;
