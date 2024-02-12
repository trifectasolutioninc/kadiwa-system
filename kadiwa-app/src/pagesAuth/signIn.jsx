import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import configFirebaseDB from '../Configuration/config';
import { ref, child, get } from 'firebase/database';
import { imageConfig } from '../Configuration/config-file';

const pageStyle = {
  backgroundColor: '#20802F',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
};

const SignInPages = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async (event) => {
    event.preventDefault();
  
    try {
      const db = configFirebaseDB();
      const usersRef = ref(db, 'authentication');
      const snapshot = await get(usersRef);
  
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const userData = childSnapshot.val();
  
          // Check if the provided username/email/contact matches the stored data
          if (
            (userData.username === username ||
              userData.contact === username ||
              userData.email === username) &&
            userData.password === password
          ) {
            // Handle successful login
            sessionStorage.setItem('kdwconnect', userData.contact);
            sessionStorage.setItem('uid', userData.id);
            sessionStorage.setItem('sid', userData.store_id);
            console.log('Successfully logged in', userData);
  
            // Redirect to '/main'
            navigate('/main');
          }
        });
  
        // If no user with provided credentials is found
        console.error('User not found or incorrect credentials');
      } else {
        console.error('No users found');
      }
    } catch (error) {
      // Handle login error
      console.error('Error logging in:', error.message);
    }
  };
  


  return (
    <div style={pageStyle}>
      <div className="text-left items-center p-4">
        <div>
          <span className="text-2xl font-bold" style={{ color: '#FAFF00' }}>
            Welcome to
          </span>
        </div>
        <div>
          <img id="LogoText" src={imageConfig.KadiwaText} alt="Logo" className="h-16" />
        </div>
      </div>

      <div className="mt-8 p-8 rounded">
        <form id="loginForm" className="space-y-4" onSubmit={handleSignIn}>
          <div className="space-y-2 text-left">
            <label htmlFor="contact" className="text-sm text-white">
              Username/Email/Contact
            </label>
            <input
              type="tel"
              id="contact"
              name="contact"
              placeholder="Username"
              className="w-full p-2 border rounded-md"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="space-y-2 text-left">
            <label htmlFor="password" className="text-sm text-white">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Password"
              className="w-full p-2 border rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="items-center justify-center text-center">
            <div>
              <NavLink to="#" className="text-sm text-blue-200">
                Forgot Password?
              </NavLink>
            </div>
            <button
              type="submit"
              className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300"
            >
              Login
            </button>
          </div>
        </form>

        <div className="mt-4 text-gray-700 text-center">
          <p className="text-white">
            Don't have an account?{' '}
            <NavLink to="/tandc" className="text-blue-200">
              Register
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignInPages;
