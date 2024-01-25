import React, { useState } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import configFirebaseDB from '../Configuration/config'
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
    const [contact, setContact] = useState('');
    const [password, setPassword] = useState('');
  
    const handleSignIn = async (event) => {
      event.preventDefault();
  
      try {
        const db = configFirebaseDB();
        const usersRef = ref(db, 'kadiwa_users_account');
  
        // Retrieve user data based on the provided contact number
        const snapshot = await get(child(usersRef, contact));
  
        if (snapshot.exists()) {
          const userData = snapshot.val();
  
          // Check if the provided password matches the stored password
          if (userData.password === password) {
            // Handle successful login
            sessionStorage.setItem('kdwconnect', contact);
            console.log('Successfully logged in', userData);
  
            // Open another page (replace "/main" with the desired URL)
            window.location.href = '/main';
          } else {
            console.error('Incorrect password');
          }
        } else {
          console.error('User not found');
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
              Contact
            </label>
            <input
              type="tel"
              id="contact"
              name="contact"
              placeholder="Contact"
              className="w-full p-2 border rounded-md"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
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
