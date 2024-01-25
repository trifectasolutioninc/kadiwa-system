import React, { useEffect, useState } from 'react';
import configFirebaseDB from '../Configuration/config';

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

  return (
    <div className="h-screen bg-gray-200">
      <div className="h-full overflow-y-auto p-4">
        <div className="flex justify-between">
          <h1 className="font-bold text-lg text-green-600">Linked Accounts</h1>
          <div>
            <span className="text-sm">Change</span>
          </div>
        </div>

        {linkedAccounts.map((account, index) => (
          <div key={index} className="bg-white shadow-lg rounded-2xl m-4">
            <div className="p-4">
              <div className="justify-between flex">
                <span className="font-bold text-sm">{account.owner}</span>
                <span className="font-bold text-sm">{account.number}</span>
              </div>

              <span className="text-sm">{account.type}</span>

              {/* Render additional information based on account type */}
              {account.type === 'MasterCard' && (
                <span className="text-sm"></span>
              )}

              {account.type === 'Megapay' && (
                <span className="text-sm"></span>
              )}

              {account.type === 'Gcash' && (
                <span className="text-sm"></span>
              )}

              {account.type === 'Paymaya' && (
                <span className="text-sm"></span>
              )}

              {account.type === 'Bank' && (
                <span className="text-sm"></span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LinkedAccount;
