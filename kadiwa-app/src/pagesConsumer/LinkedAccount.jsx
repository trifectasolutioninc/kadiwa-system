import React, { useEffect, useState } from 'react';
import configFirebaseDB from '../Configuration/config';
import { paymentImg } from '../Configuration/config-file';

const LinkedAccount = () => {
  const [linkedAccounts, setLinkedAccounts] = useState([]);

  // Sample data for different account types
  const sampleData = {
    MasterCard: {
      owner: 'Juan Dela Cruz',
      number: '1234 5678 9123 4567',
      type: 'MasterCard',
    },
    Megapay: {
      owner: 'Juan Dela Cruz',
      number: '9876 5432 1098 7654',
      type: 'Megapay',
    },
    Gcash: {
      owner: 'Juan Dela Cruz',
      number: '2468 1357 8024 6913',
      type: 'Gcash',
    },
    Paymaya: {
      owner: 'Juan Dela Cruz',
      number: '1357 2468 9132 8046',
      type: 'Paymaya',
    },
    Bank: {
      owner: 'Juan Dela Cruz',
      number: '7890 1234 5678 9012',
      type: 'Bank',
    },
  };

  // Fetch linked accounts when the component mounts
  useEffect(() => {
    fetchLinkedAccounts();
  }, []);

  // Function to fetch linked accounts
  const fetchLinkedAccounts = () => {
    // Simulate fetching from Firebase using sample data
    const accounts = Object.values(sampleData);
    setLinkedAccounts(accounts);
  };

  const getAccountImageSrc = (accountType) => {
    // Replace these paths with the actual paths to your images
    switch (accountType) {
      case 'MasterCard':
        return `${paymentImg.MasterCard}`;
      case 'Megapay':
        return `${paymentImg.Megapay}`;
      case 'Gcash':
        return `${paymentImg.Gcash}`;
      case 'Paymaya':
        return `${paymentImg.Maya}`;
      case 'Bank':
        return `${paymentImg.Bank}`;
      default:
        return `${paymentImg.Bank}`; // Provide a default image path
    }
  };

  return (
    <div className="h-screen bg-gray-200">
      <div className="h-full overflow-y-auto p-4">
        <div className="flex justify-between">
          <h1 className="font-bold text-lg text-green-600">Linked Accounts</h1>
          <div>
            <span className="text-sm">Change</span>
          </div>
        </div>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4'>
        {linkedAccounts.map((account, index) => (
          <div key={index} className="bg-white shadow-lg rounded-2xl m-4 ">
            <div className="p-4 ">
              <div className="grid grid-cols-10">
                <img
                  src={getAccountImageSrc(account.type)}
                  alt={account.type}
                  className="w-10 h-10 object-contain col-span-3"
                />
                <div className=' col-span-7 items-center'>
                  <p className="font-bold text-sm text-gray-700">{account.owner}</p>
                  <p className="font-bold text-xs text-gray-500">{account.number}</p>
                </div>
              </div>

              <span className="text-sm">{account.type}</span>

              {/* Render additional information based on account type */}
              {account.type === 'MasterCard' && <span className="text-sm"></span>}
              {account.type === 'Megapay' && <span className="text-sm"></span>}
              {account.type === 'Gcash' && <span className="text-sm"></span>}
              {account.type === 'Paymaya' && <span className="text-sm"></span>}
              {account.type === 'Bank' && <span className="text-sm"></span>}
            </div>
          </div>
          
        ))}
        </div>
      </div>
    </div>
  );
};

export default LinkedAccount;
