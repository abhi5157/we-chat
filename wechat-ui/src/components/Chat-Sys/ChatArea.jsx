import  { useState } from 'react';

function ChatArea({  activeContact }) {
  const [message, setMessage] = useState('');

  const messages = [
    { id: 1, sender: 'user', content: 'I hope these articles help.' },
    { id: 2, sender: 'other', content: 'https://www.envato.com/atomic-power-plant-engine/' },
    { id: 3, sender: 'user', content: 'I hope these articles help.' },
    { id: 4, sender: 'other', content: 'Do you know which App or feature it will require to set up.' },
  ];

  const handleSend = () => {
    if (message.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-100">
      {activeContact && (
        <>
          <div className="bg-white p-4 flex justify-between items-center border-b">
            <div className="flex items-center">
              <img src={activeContact.avatar} alt={activeContact.name} className="w-10 h-10 rounded-full mr-3" />
              <div>
                <h2 className="font-semibold" style={{'color' : '#0AB64C' }}>{activeContact.name}</h2>
                <p className="text-sm text-gray-500">Online</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button className="text-gray-600 hover:text-gray-800" style={{'backgroundColor': '#E0F2F1' ,'borderRadius':'60px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </button>
              <button className="text-gray-600 hover:text-gray-800" style={{'backgroundColor': '#E0F2F1' ,'borderRadius':'60px' }}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </button>
              <button className="text-gray-600 hover:text-gray-800"style={{'backgroundColor': '#E0F2F1' ,'borderRadius':'60px' }} >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white'} rounded-lg p-3 shadow`}>
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white p-4 flex items-center space-x-2">
            <button className="text-gray-600 hover:text-gray-800" style={{'backgroundColor': '#E0F2F1' ,'borderRadius':'60px' }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
              className="flex-1 border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={handleSend} className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ChatArea;