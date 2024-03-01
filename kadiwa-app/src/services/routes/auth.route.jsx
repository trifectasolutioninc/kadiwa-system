
import { Route, Routes } from 'react-router-dom';
import React, { useEffect } from 'react';
import SignInPages from '../../pages/authentication/SignInPage';
import Registration from '../../pages/authentication/RegisterPage';


const AuthRoute  = () => {


  return (
    <div>
      <Routes>
        <Route path="/" element={<SignInPages />} /> 
        <Route path="/register" element={<Registration />} /> 
       
      </Routes>
    </div>
  );
};

export default AuthRoute;