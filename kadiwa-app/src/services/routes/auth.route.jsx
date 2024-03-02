
import { Route, Routes } from 'react-router-dom';
import React, { useEffect } from 'react';
import SignInPages from '../../pages/authentication/SignInPage';
import Registration from '../../pages/authentication/RegisterPage';
import ForgotPassword from '../../pages/authentication/ForgotPassword';


const AuthRoute  = () => {


  return (
    <div>
      <Routes>
        <Route path="/" element={<SignInPages />} /> 
        <Route path="/register" element={<Registration />} /> 
        <Route path="/forget-password" element={<ForgotPassword />} /> 
       
      </Routes>
    </div>
  );
};

export default AuthRoute;