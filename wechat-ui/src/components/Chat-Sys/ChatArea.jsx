import { useState } from "react";

import ProfileSidebar from "./ProfileSidebar";

import {
  SearchIcon,
  SidebarIcon,
  VideosIcon,
  ChatAddIcon,
  AddIcon,
  EmojiIcon,
  PhotoIcon,
  RecordIcon,
} from "./Icons";

function ChatArea({ activeContact }) {
  const [message, setMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const messages = [
    { id: 1, sender: "user", content: "I hope these articles help." },
    {
      id: 2,
      sender: "other",
      content: "https://www.envato.com/atomic-power-plant-engine/",
    },
    { id: 3, sender: "user", content: "I hope these articles help." },
    {
      id: 4,
      sender: "other",
      content: "Do you know which App or feature it will require to set up.",
    },
  ];

  const handleSend = () => {
    if (message.trim()) {
      console.log("Sending message:", message);
      setMessage("");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div
      className="flex-1 flex flex-col "
      style={{
        backgroundColor: activeContact ? "white" : "#E0F2F1",
      }}
    >
      {activeContact && (
        <>
          <div className="bg-white p-4 flex justify-between items-center border-b">
            <div className="flex items-center">
              <img
                src={activeContact.avatar}
                alt={activeContact.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h2 className="font-semibold" style={{ color: "#0AB64C" }}>
                  {activeContact.name}
                </h2>
                <p className="text-sm text-gray-500">Online</p>
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                className="text-gray-600 hover:text-gray-800"
                style={{ backgroundColor: "#E0F2F1", borderRadius: "60px" }}
              >
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect width="40" height="40" rx="6" fill="#E0F2F1" />
                  <path
                    fill-rule="evenodd"
                    d="M13.885 12.511C14.06 12.3363 14.2701 12.2008 14.5014 12.1134C14.7327 12.026 14.9799 11.9888 15.2267 12.0042C15.4735 12.0197 15.7142 12.0873 15.9328 12.2028C16.1515 12.3183 16.3431 12.4789 16.495 12.674L18.29 14.98C18.619 15.403 18.735 15.954 18.605 16.474L18.058 18.664C18.0299 18.7775 18.0315 18.8962 18.0627 19.0089C18.0939 19.1215 18.1536 19.2242 18.236 19.307L20.693 21.764C20.7759 21.8466 20.8788 21.9064 20.9916 21.9376C21.1044 21.9688 21.2234 21.9703 21.337 21.942L23.526 21.395C23.7826 21.3312 24.0504 21.3264 24.3091 21.381C24.5679 21.4356 24.8109 21.548 25.02 21.71L27.326 23.504C28.155 24.149 28.231 25.374 27.489 26.115L26.455 27.149C25.715 27.889 24.609 28.214 23.578 27.851C20.9387 26.9236 18.5425 25.4128 16.568 23.431C14.5864 21.4568 13.0755 19.061 12.148 16.422C11.786 15.392 12.111 14.285 12.851 13.545L13.885 12.511Z"
                    fill="#475569"
                  />
                </svg>
              </button>
              <button
                className="text-gray-600 hover:text-gray-800"
                style={{ backgroundColor: "#E0F2F1", borderRadius: "60px" }}
              >
                <VideosIcon />
              </button>
              <button
                className="text-gray-600 hover:text-gray-800"
                style={{ backgroundColor: "#E0F2F1", borderRadius: "60px" }}
                onClick={toggleSidebar}
              >
                <SidebarIcon />
              </button>
            </div>
          </div>

          {/* chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md xl:max-w-lg ${
                    msg.sender === "user" ? "" : "bg-white"
                  } rounded-lg p-3 shadow`}
                  style={{
                    backgroundColor:
                      msg.sender === "user" ? "#26A69A" : "white",
                    color: msg.sender === "user" ? "#FFFFFF" : "#64748B",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-4 flex items-center space-x-2">
            <button
              className="text-gray-600 hover:text-gray-300"
              style={{ backgroundColor: "#E0F2F1", borderRadius: "60px" }}
            >
              <AddIcon />
            </button>
            <button
              className="text-gray-600 hover:text-gray-300"
              style={{ backgroundColor: "#E0F2F1", borderRadius: "60px" }}
            >
              <EmojiIcon />
            </button>
            <button
              className="text-gray-600 hover:text-gray-800"
              style={{ backgroundColor: "#E0F2F1", borderRadius: "60px" }}
            >
              <PhotoIcon />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
              className="flex-1 border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-grey-500"
            />

            <button
              onClick={handleSend}
              className=" text-white rounded-full p-2 hover:bg-gray-300"
            >
              <RecordIcon />
            </button>
            <button
              onClick={handleSend}
              className=" text-white rounded-full p-2 hover:bg-gray-300"
            >
              <SearchIcon />
            </button>
          </div>
        </>
      )}
      <ProfileSidebar
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        contact={activeContact}
      />
    </div>
  );
}

export default ChatArea;
