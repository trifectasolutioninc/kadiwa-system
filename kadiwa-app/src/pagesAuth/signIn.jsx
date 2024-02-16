import React, { useState, useEffect, useRef } from 'react'; // Import useRef
import { NavLink, useNavigate } from 'react-router-dom';
import configFirebaseDB from '../Configuration/config';
import { getDatabase, ref, get } from 'firebase/database';
import InputMask from 'react-input-mask';
import { imageConfig } from '../Configuration/config-file';

const SignInPages = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [version, setVersion] = useState("");
  const navigate = useNavigate();
  const phoneNumberRef = useRef(null); // Create ref for phone number input
  const passwordRef = useRef(null); // Create ref for password input

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        const database = getDatabase();
        const versionRef = ref(database, '0_config_control/version');
        const snapshot = await get(versionRef);
        if (snapshot.exists()) {
          setVersion(snapshot.val());
        } else {
          console.log("No version found");
        }
      } catch (error) {
        console.error("Error getting version:", error);
      }
    };

    fetchVersion();
  }, []);

  const handleSignIn = async (event) => {
    event.preventDefault();

    try {
      const db = configFirebaseDB();
      const usersRef = ref(db, 'authentication');
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const userData = childSnapshot.val();

          // Access input values using refs
          const inputUsername = phoneNumberRef.current.value;
          const inputPassword = passwordRef.current.value;
          const inputUsername2 = inputUsername.replace(/\s/g, '');

          if (
            (userData.username === inputUsername ||
              userData.contact === inputUsername || userData.contact === inputUsername2.replace(/x/g, "+63") ||
              userData.email === inputUsername) &&
            userData.password === inputPassword
          ) {
            sessionStorage.setItem('kdwconnect', userData.contact);
            sessionStorage.setItem('uid', userData.id);
            sessionStorage.setItem('sid', userData.store_id);
            console.log('Successfully logged in', userData);
            navigate('/main');
          }
        });

        console.error('User not found or incorrect credentials');
      } else {
        console.error('No users found');
      }
    } catch (error) {
      console.error('Error logging in:', error.message);
    }
  };

  return (
    <div className=' bg-white '>
      <div className=' mt-8'>
        <div className=" items-center flex p-4">
          <div className=' mx-auto'>
            <p className="text-2xl text-left font-bold">
              Welcome to
            </p>
            <p className='text-6xl font-bold text-green-700'>
              Kadiwa
            </p>
          </div>
        </div>

        <div className="mt-5 p-8 rounded">
          <form id="loginForm" className="space-y-1" onSubmit={handleSignIn}>
            <div className="text-left">
              <label htmlFor="contact" className="text-sm text-white">
                Phone Number
              </label>
              <InputMask
                id="phoneNumber"
                name="phoneNumber"
                mask="+63 999 999 9999"
                autoComplete="tel"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="+63 9XX XXX XXXX"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                ref={phoneNumberRef} // Attach ref to phone number input
              />
            </div>

            <div className="text-left">
              <label htmlFor="password" className="text-sm text-white">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                ref={passwordRef} // Attach ref to password input
              />
            </div>

            <div className="items-center justify-center text-center">
              <div className='mt-4'>
                <NavLink to="#" className="text-sm text-green-600">
                  Forgot Password?
                </NavLink>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-green-600 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:border-green-300"
              >
                Login
              </button>
            </div>
          </form>

          <div className="mt-4 text-gray-700 text-center">
            <p className="text-gray-500">
              Don't have an account?{' '}
              <NavLink to="/" className="text-green-600 font-semibold">
                Register
              </NavLink>
            </p>
          </div>
        </div>

      </div>
      <div className='fixed bottom-0 text-center py-4 w-full text-xs  text-gray-600'>
        <p> {version}</p>
      </div>

    </div>
  );
};

export default SignInPages;
