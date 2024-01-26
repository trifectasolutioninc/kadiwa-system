import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const ChatPage = () => {
  const { storeID } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, { sender: 'user', text: newMessage }]);
      setNewMessage('');
    }
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      <div className="flex justify-between p-4 bg-white shadow-md">
        <h1 className="text-gray-700 font-bold text-lg">Chat with Store {storeID}</h1>
        <button className="text-green-600">Back</button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`my-2 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}
          >
            <span
              className={`inline-block p-2 rounded-lg ${
                message.sender === 'user' ? 'bg-green-600 text-white' : 'bg-gray-200'
              }`}
            >
              {message.text}
            </span>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white shadow-md">
        <div className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 mr-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleSendMessage}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
