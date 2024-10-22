// import { useState, useRef, useEffect } from "react";
// import EmojiPicker from "emoji-picker-react";
// import ProfileSidebar from "./ChatComponents/ProfileSidebar";
// import AudioCallComponent from "./ChatComponents/AudioCallComponent";
// import VideoComponent from "./ChatComponents/VideoCallComponent";

// import {
//   SearchIcon,
//   SidebarIcon,
//   VideosIcon,
//   AddIcon,
//   EmojiIcon,
//   PhotoIcon,
//   RecordIcon,
//   AudioCallIcon,
// } from "./Icons";

// function ChatArea({ activeUser, users }) {
//   const [message, setMessage] = useState("");
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [showEmojis, setShowEmojis] = useState(false);
//   const [muteModalOpen, setMuteModalOpen] = useState(false);
//   const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
//   const [isAudioCallOpen, setIsAudioCallOpen] = useState(false);

//   const [messages, setMessages] = useState([]);

//   const [isRecording, setIsRecording] = useState(false);
//   const [audioBlob, setAudioBlob] = useState(null);

//   const fileInputRef = useRef(null);
//   const mediaInputRef = useRef(null);
//   const audioRef = useRef(null);

//   useEffect(() => {
//     if (isRecording) {
//       startRecording();
//     } else {
//       stopRecording();
//     }
//   }, [isRecording]);

//   useEffect(() => {
//     // Here you would typically fetch messages for the active user
//     // For now, we'll just set some dummy messages
//     setMessages([
//       { id: 1, sender: "user", content: "Hello!" },
//       { id: 2, sender: "other", content: "Hi there!" },
//     ]);
//   }, [activeUser]);

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       audioRef.current = new MediaRecorder(stream);
//       const chunks = [];
//       audioRef.current.ondataavailable = (e) => chunks.push(e.data);
//       audioRef.current.onstop = () => {
//         const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
//         setAudioBlob(blob);
//       };
//       audioRef.current.start();
//     } catch (error) {
//       console.error("Error starting recording:", error);
//     }
//   };

//   const stopRecording = () => {
//     if (audioRef.current && audioRef.current.state !== "inactive") {
//       audioRef.current.stop();
//     }
//   };

//   const handleSend = () => {
//     if (message.trim() || audioBlob) {
//       const newMessage = {
//         id: messages.length + 1,
//         sender: "user",
//         content: message.trim() || "Audio message",
//         type: audioBlob ? "audio" : "text",
//         media: audioBlob,
//       };
//       setMessages([...messages, newMessage]);
//       setMessage("");
//       setAudioBlob(null);
//     }
//   };

//   const handleFileUpload = (event, type) => {
//     const file = event.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const newMessage = {
//           id: messages.length + 1,
//           sender: "user",
//           content: file.name,
//           type: type,
//           media: e.target.result,
//         };
//         setMessages([...messages, newMessage]);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const renderMessage = (msg) => {
//     switch (msg.type) {
//       case "image":
//         return (
//           <img
//             src={msg.media}
//             alt={msg.content}
//             className="max-w-xs cursor-pointer"
//             onClick={() => handleMediaClick(msg)}
//           />
//         );
//       case "video":
//         return (
//           <video
//             src={msg.media}
//             controls
//             className="max-w-xs cursor-pointer"
//             onClick={() => handleMediaClick(msg)}
//           />
//         );
//       case "audio":
//         return <audio src={URL.createObjectURL(msg.media)} controls />;
//       case "document":
//         return (
//           <div>
//             <span>{msg.content}</span>
//             <a
//               href={msg.media}
//               download={msg.content}
//               className="ml-2 text-blue-500"
//             >
//               Download
//             </a>
//           </div>
//         );
//       default:
//         return msg.content;
//     }
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const handleAudioCallClick = () => {
//     setIsAudioCallOpen(true);
//   };

//   const handleMediaClick = (msg) => {
//     console.log("Open full-size view for:", msg);
//   };

//   return (
//     <div
//       className="flex-1 flex flex-col"
//       style={{ backgroundColor: activeUser ? "white" : "#E0F2F1" }}
//     >
//       {activeUser && (
//         <>
//           {/* Header */}
//           <div className="bg-white p-4 flex justify-between items-center border-b">
//             <div className="flex items-center">
//               <div className="w-10 h-10 rounded-full mr-3 bg-gray-300 flex items-center justify-center">
//                 <span className="text-xl text-gray-600">
//                   {activeUser.firstName[0]}
//                 </span>
//               </div>
//               <div>
//                 <h2 className="font-semibold" style={{ color: "#0AB64C" }}>
//                   {activeUser.firstName} {activeUser.lastName}
//                 </h2>
//                 <p className="text-sm text-gray-500">{activeUser.email}</p>
//               </div>
//             </div>
//             <div className="flex space-x-4">
//               <button
//                 className="text-gray-600 hover:text-gray-800"
//                 style={{ backgroundColor: "#E0F2F1", borderRadius: "60px" }}
//                 onClick={handleAudioCallClick}
//               >
//                 <AudioCallIcon />
//               </button>
//               <button
//                 className="text-gray-600 hover:text-gray-800"
//                 style={{ backgroundColor: "#E0F2F1", borderRadius: "60px" }}
//                 onClick={() => setIsVideoCallOpen(true)}
//               >
//                 <VideosIcon />
//               </button>
//               <button
//                 className="text-gray-600 hover:text-gray-800"
//                 style={{ backgroundColor: "#E0F2F1", borderRadius: "60px" }}
//                 onClick={toggleSidebar}
//               >
//                 <SidebarIcon />
//               </button>
//             </div>
//           </div>

//           {/* Messages */}
//           <div className="flex-1 overflow-y-auto p-4 space-y-4">
//             {messages.map((msg) => (
//               <div
//                 key={msg.id}
//                 className={`flex ${
//                   msg.sender === "user" ? "justify-end" : "justify-start"
//                 }`}
//               >
//                 <div
//                   className={`max-w-xs lg:max-w-md xl:max-w-lg ${
//                     msg.sender === "user" ? "" : "bg-white"
//                   } rounded-lg p-3 shadow`}
//                   style={{
//                     backgroundColor:
//                       msg.sender === "user" ? "#26A69A" : "white",
//                     color: msg.sender === "user" ? "#FFFFFF" : "#64748B",
//                   }}
//                 >
//                   {renderMessage(msg)}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Input Area */}
//           <div className="msgInputComponent">
//             <div className="bg-white p-4 flex items-center space-x-2 relative">
//               <button
//                 className="text-gray-600 hover:text-gray-300"
//                 style={{ backgroundColor: "#E0F2F1", borderRadius: "60px" }}
//                 onClick={() => fileInputRef.current.click()}
//               >
//                 <AddIcon />
//               </button>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 style={{ display: "none" }}
//                 onChange={(e) => handleFileUpload(e, "document")}
//                 accept=".pdf,.doc,.docx,.txt"
//               />
//               <button
//                 className="text-gray-600 hover:text-gray-300"
//                 style={{ backgroundColor: "#E0F2F1", borderRadius: "60px" }}
//                 onClick={() => setShowEmojis(!showEmojis)}
//               >
//                 <EmojiIcon />
//               </button>
//               {showEmojis && (
//                 <div className="absolute bottom-16 left-0">
//                   <EmojiPicker
//                     onEmojiClick={(emojiObject) =>
//                       setMessage((prev) => prev + emojiObject.emoji)
//                     }
//                   />
//                 </div>
//               )}
//               <button
//                 className="text-gray-600 hover:text-gray-800"
//                 style={{ backgroundColor: "#E0F2F1", borderRadius: "60px" }}
//                 onClick={() => mediaInputRef.current.click()}
//               >
//                 <PhotoIcon />
//               </button>
//               <input
//                 type="file"
//                 ref={mediaInputRef}
//                 style={{ display: "none" }}
//                 onChange={(e) =>
//                   handleFileUpload(
//                     e,
//                     e.target.files[0].type.startsWith("image/")
//                       ? "image"
//                       : "video"
//                   )
//                 }
//                 accept="image/*,video/*"
//               />
//               <input
//                 type="text"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Type a message"
//                 className="flex-1 border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-grey-500"
//               />
//               <button
//                 onClick={() => setIsRecording(!isRecording)}
//                 className={`text-white rounded-full p-2 hover:bg-gray-300 ${
//                   isRecording ? "bg-gray-300" : ""
//                 }`}
//               >
//                 <RecordIcon />
//               </button>
//               <button
//                 onClick={handleSend}
//                 className="text-white rounded-full p-2 hover:bg-gray-300"
//               >
//                 <SearchIcon />
//               </button>
//             </div>
//           </div>
//         </>
//       )}

//       <ProfileSidebar
//         open={isSidebarOpen}
//         onClose={() => setIsSidebarOpen(false)}
//         contact={activeUser}
//         muteModalOpen={muteModalOpen}
//         onMuteClick={() => setMuteModalOpen(true)}
//         onMuteClose={() => setMuteModalOpen(false)}
//         onMute={(duration) => console.log(`Muted for ${duration} minutes`)}
//       />
//       <AudioCallComponent
//         open={isAudioCallOpen}
//         onClose={() => setIsAudioCallOpen(false)}
//         contact={activeUser}
//       />
//       <VideoComponent
//         open={isVideoCallOpen}
//         onClose={() => setIsVideoCallOpen(false)}
//         contact={activeUser}
//       />
//     </div>
//   );
// }

// export default ChatArea;

import { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import ProfileSidebar from "./ChatComponents/ProfileSidebar";
import AudioCallComponent from "./ChatComponents/AudioCallComponent";
import VideoComponent from "./ChatComponents/VideoCallComponent";
import { io } from "socket.io-client";

import {
  SearchIcon,
  SidebarIcon,
  VideosIcon,
  AddIcon,
  EmojiIcon,
  PhotoIcon,
  RecordIcon,
  AudioCallIcon,
} from "./Icons";

const API_URL = "http://localhost:5000/api";
const SOCKET_URL = "http://localhost:5000";

function ChatArea({ activeUser }) {
  const currentUser = localStorage.getItem("profileUser");
  const userId = localStorage.getItem("Puser");
  console.log("userId  ->", userId);
  // console.log(activeUser);
  console.log("chatArea currentUser", currentUser?.id);
  const [message, setMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [muteModalOpen, setMuteModalOpen] = useState(false);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [isAudioCallOpen, setIsAudioCallOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const mediaInputRef = useRef(null);
  const audioRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on("newMessage", (message) => {
      console.log("Received new message:", message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (socket && activeUser && userId) {
      socket.emit("joinChat", {
        senderId: userId,
        receiverId: activeUser._id,
      });
    }
  }, [socket, activeUser, userId]);

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }
  }, [socket]);

  useEffect(() => {
    if (activeUser?._id && userId) {
      fetchChatHistory();
    }
  }, [activeUser?._id, userId]);

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [isRecording]);

  // Scroll to bottom when new messages arrive
  // useEffect(() => {
  //   scrollToBottom();
  // }, [messages]);

  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  const fetchChatHistory = async () => {
    setIsLoading(true);
    try {
      console.log("Fetching chat history for:", userId, activeUser._id);
      const response = await fetch(
        `${API_URL}/chat/history/${userId}/${activeUser._id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Chat history received:", data);
      setMessages(data);
    } catch (err) {
      console.error("Error fetching chat history:", err);
      setError("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioRef.current = new MediaRecorder(stream);
      const chunks = [];

      audioRef.current.ondataavailable = (e) => chunks.push(e.data);
      audioRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        setAudioBlob(blob);
      };

      audioRef.current.start();
    } catch (error) {
      console.error("Error starting recording:", error);
      setError("Failed to start recording");
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (audioRef.current && audioRef.current.state !== "inactive") {
      audioRef.current.stop();
      audioRef.current.stream.getTracks().forEach((track) => track.stop());
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !socket) return;

    try {
      const messageData = {
        senderId: userId,
        receiverId: activeUser._id,
        content: message.trim(),
      };

      console.log("Sending message:", messageData);

      // Send to backend
      const response = await fetch(`${API_URL}/chat/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Message send result:", result);

      // Emit to socket
      socket.emit("sendMessage", messageData);

      // Update local state
      setMessages((prev) => [...prev, messageData]);
      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
      setError("Failed to send message");
    }
  };

  const handleFileUpload = async (event, type) => {
    const file = event.target.files[0];
    if (!file || !socket) return;

    try {
      const formData = new FormData();
      formData.append("mediaFile", file);
      formData.append("sender", userId);
      formData.append("receiver", activeUser._id);

      console.log("Uploading file:", file.name);

      const response = await fetch(`${API_URL}/chat/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      const result = await response.json();
      console.log("File upload result:", result);

      const messageData = {
        senderId: userId,
        receiverId: activeUser._id,
        content: file.name,
        type: type,
        media: result.filePath,
      };

      // Send message with file info
      const msgResponse = await fetch(`${API_URL}/chat/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(messageData),
      });

      if (!msgResponse.ok) {
        throw new Error("Failed to send message with file");
      }

      socket.emit("sendMessage", messageData);
      setMessages((prev) => [...prev, messageData]);
    } catch (err) {
      console.error("Error handling file upload:", err);
      setError("Failed to upload file");
    }
  };

  const renderMessage = (msg) => {
    const isOwnMessage = msg.senderId === userId || msg.sender === userId;

    switch (msg.type) {
      case "image":
        return (
          <img
            src={`${API_URL}/${msg.media}`}
            alt="Image"
            className="max-w-xs rounded-lg"
          />
        );
      case "video":
        return (
          <video
            src={`${API_URL}/${msg.media}`}
            controls
            className="max-w-xs rounded-lg"
          />
        );
      case "audio":
        return (
          <audio
            src={`${API_URL}/${msg.media}`}
            controls
            className="max-w-xs"
          />
        );
      case "document":
        return (
          <div className="flex items-center space-x-2">
            <span>{msg.content}</span>
            <a
              href={`${API_URL}/${msg.media}`}
              download
              className="text-blue-500 hover:text-blue-600"
            >
              Download
            </a>
          </div>
        );
      default:
        return (
          <div className="break-words">
            {msg.content}
            <div className="text-xs text-gray-500 mt-1">
              {new Date(msg.timestamp || msg.createdAt).toLocaleTimeString()}
            </div>
          </div>
        );
    }
  };

  const handleMediaClick = (msg) => {
    console.log("Opening media preview for:", msg);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!activeUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a contact to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="bg-white p-4 flex justify-between items-center border-b">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full mr-3 bg-gray-300 flex items-center justify-center">
            <span className="text-xl text-gray-600">
              {activeUser.firstName?.[0]}
            </span>
          </div>
          <div>
            <h2 className="font-semibold text-green-600">
              {activeUser.firstName} {activeUser.lastName}
            </h2>
            <p className="text-sm text-gray-500">{activeUser.email}</p>
          </div>
        </div>
        <div className="flex space-x-4">
          <button
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            onClick={() => setIsAudioCallOpen(true)}
          >
            <AudioCallIcon />
          </button>
          <button
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            onClick={() => setIsVideoCallOpen(true)}
          >
            <VideosIcon />
          </button>
          <button
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            onClick={() => setIsSidebarOpen(true)}
          >
            <SidebarIcon />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading && (
          <div className="text-center">
            <p>Loading messages...</p>
          </div>
        )}
        {error && (
          <div className="text-center text-red-500">
            <p>{error}</p>
          </div>
        )}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md xl:max-w-lg rounded-lg p-3 ${
                msg.sender === userId
                  ? "bg-[#26A69A] text-white"
                  : "bg-gray-100 "
              }`}
            >
              {renderMessage(msg)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-2">
          <button
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            onClick={() => fileInputRef.current.click()}
          >
            <AddIcon />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={(e) => handleFileUpload(e, "document")}
            accept=".pdf,.doc,.docx,.txt"
          />

          <button
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            onClick={() => setShowEmojis(!showEmojis)}
          >
            <EmojiIcon />
          </button>
          {showEmojis && (
            <div className="absolute bottom-20 left-0">
              <EmojiPicker
                onEmojiClick={(emojiObject) =>
                  setMessage((prev) => prev + emojiObject.emoji)
                }
              />
            </div>
          )}

          <button
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            onClick={() => mediaInputRef.current.click()}
          >
            <PhotoIcon />
          </button>
          <input
            type="file"
            ref={mediaInputRef}
            className="hidden"
            onChange={(e) =>
              handleFileUpload(
                e,
                e.target.files[0]?.type.startsWith("image/") ? "image" : "video"
              )
            }
            accept="image/*,video/*"
          />

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message"
            className="flex-1 border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <button
            className={`p-2 rounded-full ${
              isRecording ? "bg-red-500" : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => setIsRecording(!isRecording)}
          >
            <RecordIcon />
          </button>

          <button
            className="p-2 rounded-full bg-gray-500 hover:bg-green-600 text-white"
            onClick={handleSend}
          >
            <SearchIcon />
          </button>
        </div>
      </div>

      <ProfileSidebar
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        contact={activeUser}
        muteModalOpen={muteModalOpen}
        onMuteClick={() => setMuteModalOpen(true)}
        onMuteClose={() => setMuteModalOpen(false)}
        onMute={(duration) => console.log(`Muted for ${duration} minutes`)}
      />
      <AudioCallComponent
        open={isAudioCallOpen}
        onClose={() => setIsAudioCallOpen(false)}
        contact={activeUser}
      />
      <VideoComponent
        open={isVideoCallOpen}
        onClose={() => setIsVideoCallOpen(false)}
        contact={activeUser}
      />
    </div>
  );
}

export default ChatArea;
