import React from 'react';
import SignupBrandPanel from '../components/signup/SignupBrandPanel/SignupBrandPanel';
import SignupForm from '../components/signup/SignupForm/SignupForm';
import '../styles/signup.css';
import '../styles/signup-responsive.css';

const PosterSignupPage = () => {
  return (
    <div className="signup-page">
      <div className="signup-left">
        <SignupBrandPanel />
      </div>
      <div className="signup-right">
        <SignupForm />
      </div>
    </div>
  );
};

export default PosterSignupPage;
