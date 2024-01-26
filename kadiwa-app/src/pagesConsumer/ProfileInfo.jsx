import React from 'react';
import { Avatar, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

const ProfileInfo = () => {

    const logout = () => {
        // Your logout logic here
        console.log('Logout function called');
      };

  return (
    <div>
      {/* Top Navigation with Search and Notification */}
      {/* <div className="p-4 flex items-center justify-between bg-gray-100">
  
        <div className="flex-grow">
          <TextField
            placeholder="Search..."
            variant="outlined"
            fullWidth
            InputProps={{ className: 'bg-gray-300 text-gray-600' }}
          />
        </div>

    
        <div className="ml-4">
          <Badge badgeContent={1} color="primary">
            <NotificationsIcon className="text-gray-700" />
          </Badge>
        </div>
      </div> */}

      <div className="p-4 flex justify-between">
        <h1 variant="h5" className="font-bold text-lg text-green-600">
          Profile
        </h1>
        <div></div>
      </div>

      {/* Profile Information */}
      <div className="relative p-4 flex justify-between items-center bg-white m-4 rounded-md shadow-md">
        <div>
          {/* Display Picture */}
          <Avatar
            id="profileImg"
            alt="Profile Picture"
            className="w-12 h-12 rounded-full"
          />
        </div>
        <div className="ml-4 mt-2">
          {/* Display Name */}
          <p id="fullname" variant="h6" className="font-bold">
            ......
          </p>
          {/* Display Contact */}
          <p
            id="infostatus"
            variant="body2"
            className="text-gray-400 text-xs bg-gray-200 rounded-3xl text-center"
          >
            ......
          </p>
        </div>
        <div className="flex items-center">
          <div className="absolute top-0 right-0 p-2">
            {/* Display User Type */}
            <p
              id="typeofuser"
              variant="body2"
              className="rounded-3xl p-1 text-xs text-gray-800"
              style={{ backgroundColor: '#54FC6F' }}
            >
              Consumer
            </p>
          </div>
          {/* Make the edit icon clickable */}
          <a href="./editprofile.html">
            <div className="ml-2 mt-4">
              {/* MUI Edit Icon */}
              <EditIcon className="text-gray-500" />
            </div>
          </a>
        </div>
      </div>

      <div className="px-4 py-2">
        <p variant="body2" className="font-bold text-gray-500">
          Email (Optional):
          <span id="email" className="font-normal">
            No email
          </span>
        </p>
        <p
          variant="body2"
          className="font-bold text-gray-500 mb-2"
        >
          Contact:
          <span id="contact" className="font-normal">
            No contact
          </span>
        </p>
        <p
          id="reminderofcompletion"
          variant="body2"
          className="font-bold text-gray-700 text-xs bg-gray-300 rounded p-1"
        >
          Reminder:
          <span className="font-normal">
            Complete the information requirements to access the consumer features.
          </span>
        </p>
      </div>

      <div className="px-4 flex justify-between">
        <p variant="body2" className="font-bold text-sm">
          Delivery Information
        </p>
        <div>
          <p variant="body2" className="text-sm">
            Add
          </p>
        </div>
      </div>

      <div className="p-4 bg-gray-200 m-4 rounded-md shadow-md">
        <div className="flex justify-between w-full">
          {/* Receipt's Name on the left */}
          <p variant="body1" className="text-gray-700 flex-grow">
            John Doe
          </p>

          {/* Phone Number on the right */}
          <p variant="body1" className="text-gray-700">
            09012345678
          </p>
        </div>

        <p variant="body1" className="text-gray-800 flex font-semibold">
          <LocationOnIcon className="text-gray-500" />
          123 Street, Cityville
        </p>
      </div>

      {/* Footer with Google Icons */}
      <footer className="p-4 flex justify-around fixed bottom-0 w-full">
        <button
          onClick={() => logout()}
          className="flex w-full text-center items-center justify-center rounded-md p-2  text-white bg-red-600"
        >
          Logout
          <ExitToAppIcon />
        </button>
      </footer>
    </div>
  );
};

export default ProfileInfo;
