import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";
import ProfileSidebar from "./ChatComponents/ProfileSidebar";
import AudioCallComponent from "./ChatComponents/AudioCallComponent";
import VideoComponent from "./ChatComponents/VideoCallComponent";
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

function ChatArea({ activeContact }) {
  const [message, setMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [muteModalOpen, setMuteModalOpen] = useState(false);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [isAudioCallOpen, setIsAudioCallOpen] = useState(false);

  const [messages, setMessages] = useState([
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
  ]);
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);

  const fileInputRef = useRef(null);
  const mediaInputRef = useRef(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  }, [isRecording]);

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
    }
  };

  const stopRecording = () => {
    if (audioRef.current && audioRef.current.state !== "inactive") {
      audioRef.current.stop();
    }
  };

  const handleSend = () => {
    if (message.trim() || audioBlob) {
      const newMessage = {
        id: messages.length + 1,
        sender: "user",
        content: message.trim() || "Audio message",
        type: audioBlob ? "audio" : "text",
        media: audioBlob,
      };
      setMessages([...messages, newMessage]);
      setMessage("");
      setAudioBlob(null);
    }
  };

  const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newMessage = {
          id: messages.length + 1,
          sender: "user",
          content: file.name,
          type: type,
          media: e.target.result,
        };
        setMessages([...messages, newMessage]);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderMessage = (msg) => {
    switch (msg.type) {
      case "image":
        return (
          <img
            src={msg.media}
            alt={msg.content}
            className="max-w-xs cursor-pointer"
            onClick={() => handleMediaClick(msg)}
          />
        );
      case "video":
        return (
          <video
            src={msg.media}
            controls
            className="max-w-xs cursor-pointer"
            onClick={() => handleMediaClick(msg)}
          />
        );
      case "audio":
        return <audio src={URL.createObjectURL(msg.media)} controls />;
      case "document":
        return (
          <div>
            <span>{msg.content}</span>
            <a
              href={msg.media}
              download={msg.content}
              className="ml-2 text-blue-500"
            >
              Download
            </a>
          </div>
        );
      default:
        return msg.content;
    }
  };
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleAudioCallClick = () => {
    setIsAudioCallOpen(true);
  };
  const handleMediaClick = (msg) => {
    console.log("Open full-size view for:", msg);
  };

  return (
    <div
      className="flex-1 flex flex-col"
      style={{ backgroundColor: activeContact ? "white" : "#E0F2F1" }}
    >
      {activeContact && (
        <>
          {/* Header */}
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
                onClick={handleAudioCallClick}
              >
                <AudioCallIcon />
              </button>
              <button
                className="text-gray-600 hover:text-gray-800"
                style={{ backgroundColor: "#E0F2F1", borderRadius: "60px" }}
                onClick={() => setIsVideoCallOpen(true)}
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

          {/* Messages */}
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
                  {renderMessage(msg)}
                </div>
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="msgInputComponent">
            <div className="bg-white p-4 flex items-center space-x-2 relative">
              <button
                className="text-gray-600 hover:text-gray-300"
                style={{ backgroundColor: "#E0F2F1", borderRadius: "60px" }}
                onClick={() => fileInputRef.current.click()}
              >
                <AddIcon />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={(e) => handleFileUpload(e, "document")}
                accept=".pdf,.doc,.docx,.txt"
              />
              <button
                className="text-gray-600 hover:text-gray-300"
                style={{ backgroundColor: "#E0F2F1", borderRadius: "60px" }}
                onClick={() => setShowEmojis(!showEmojis)}
              >
                <EmojiIcon />
              </button>
              {showEmojis && (
                <div className="absolute bottom-16 left-0">
                  <EmojiPicker
                    onEmojiClick={(emojiObject) =>
                      setMessage((prev) => prev + emojiObject.emoji)
                    }
                  />
                </div>
              )}
              <button
                className="text-gray-600 hover:text-gray-800"
                style={{ backgroundColor: "#E0F2F1", borderRadius: "60px" }}
                onClick={() => mediaInputRef.current.click()}
              >
                <PhotoIcon />
              </button>
              <input
                type="file"
                ref={mediaInputRef}
                style={{ display: "none" }}
                onChange={(e) =>
                  handleFileUpload(
                    e,
                    e.target.files[0].type.startsWith("image/")
                      ? "image"
                      : "video"
                  )
                }
                accept="image/*,video/*"
              />
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                className="flex-1 border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-grey-500"
              />
              <button
                onClick={() => setIsRecording(!isRecording)}
                className={`text-white rounded-full p-2 hover:bg-gray-300 ${
                  isRecording ? "bg-gray-300" : ""
                }`}
              >
                <RecordIcon />
              </button>
              <button
                onClick={handleSend}
                className="text-white rounded-full p-2 hover:bg-gray-300"
              >
                <SearchIcon />
              </button>
            </div>
          </div>
        </>
      )}
      <ProfileSidebar
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        contact={activeContact}
        muteModalOpen={muteModalOpen}
        onMuteClick={() => setMuteModalOpen(true)}
        onMuteClose={() => setMuteModalOpen(false)}
        onMute={(duration) => console.log(`Muted for ${duration} minutes`)}
      />
      <AudioCallComponent
        open={isAudioCallOpen}
        onClose={() => setIsAudioCallOpen(false)}
        contact={activeContact}
      />
      <VideoComponent
        open={isVideoCallOpen}
        onClose={() => setIsVideoCallOpen(false)}
        contact={activeContact}
      />
    </div>
  );
}

export default ChatArea;

// import { useState, useRef } from "react";
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

// function ChatArea({ activeContact }) {
//   const [message, setMessage] = useState("");
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [showEmojis, setShowEmojis] = useState(false);
//   const [muteModalOpen, setMuteModalOpen] = useState(false);
//   const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);

//   const handleOpenVideoCall = () => {
//     setIsVideoCallOpen(true);
//   };

//   const handleCloseVideoCall = () => {
//     setIsVideoCallOpen(false);
//   };

//   const handleMuteClick = () => {
//     setMuteModalOpen(true);
//   };

//   const handleMuteClose = () => {
//     setMuteModalOpen(false);
//   };

//   const handleMute = (duration) => {
//     console.log(`Muted for ${duration} minutes`);
//   };

//   const handleAudioCallClick = () => {
//     setIsAudioCallOpen(true);
//   };

//   const [isAudioCallOpen, setIsAudioCallOpen] = useState(false);

//   const [messages, setMessages] = useState([
//     { id: 1, sender: "user", content: "I hope these articles help." },
//     {
//       id: 2,
//       sender: "other",
//       content: "https://www.envato.com/atomic-power-plant-engine/",
//     },
//     { id: 3, sender: "user", content: "I hope these articles help." },
//     {
//       id: 4,
//       sender: "other",
//       content: "Do you know which App or feature it will require to set up.",
//     },
//   ]);

//   const fileInputRef = useRef(null);

//   const handleSend = () => {
//     if (message.trim()) {
//       setMessages([
//         ...messages,
//         {
//           id: messages.length + 1,
//           sender: "user",
//           content: message,
//         },
//       ]);
//       setMessage("");
//     }
//   };

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const handleEmojiClick = (emojiObject) => {
//     setMessage((prevMessage) => prevMessage + emojiObject.emoji);
//     setShowEmojis(false);
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (file) {
//       setMessages([
//         ...messages,
//         {
//           id: messages.length + 1,
//           sender: "user",
//           content: `File uploaded: ${file.name}`,
//         },
//       ]);
//     }
//   };

//   return (
//     <div
//       className="flex-1 flex flex-col"
//       style={{
//         backgroundColor: activeContact ? "white" : "#E0F2F1",
//       }}
//     >
//       {activeContact && (
//         <>
//           <div className="bg-white p-4 flex justify-between items-center border-b">
//             <div className="flex items-center">
//               <img
//                 src={activeContact.avatar}
//                 alt={activeContact.name}
//                 className="w-10 h-10 rounded-full mr-3"
//               />
//               <div>
//                 <h2 className="font-semibold" style={{ color: "#0AB64C" }}>
//                   {activeContact.name}
//                 </h2>
//                 <p className="text-sm text-gray-500">Online</p>
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
//                   {msg.content}
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="msgInputComponent">
//             <div className="bg-white p-4 flex items-center space-x-2 relative">
//               <button
//                 className="text-gray-600 hover:text-gray-300"
//                 style={{ backgroundColor: "#E0F2F1", borderRadius: "60px" }}
//               >
//                 <AddIcon />
//               </button>
//               <button
//                 className="text-gray-600 hover:text-gray-300"
//                 style={{ backgroundColor: "#E0F2F1", borderRadius: "60px" }}
//                 onClick={() => setShowEmojis(!showEmojis)}
//               >
//                 <EmojiIcon />
//               </button>
//               {showEmojis && (
//                 <div className="absolute bottom-16 left-0">
//                   <EmojiPicker onEmojiClick={handleEmojiClick} />
//                 </div>
//               )}
//               <button
//                 className="text-gray-600 hover:text-gray-800"
//                 style={{ backgroundColor: "#E0F2F1", borderRadius: "60px" }}
//                 onClick={() => fileInputRef.current.click()}
//               >
//                 <PhotoIcon />
//               </button>
//               <input
//                 type="file"
//                 ref={fileInputRef}
//                 style={{ display: "none" }}
//                 onChange={handleFileUpload}
//               />
//               <input
//                 type="text"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Type a message"
//                 className="flex-1 border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-grey-500"
//               />
//               <button
//                 onClick={handleSend}
//                 className="text-white rounded-full p-2 hover:bg-gray-300"
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
//         contact={activeContact}
//         muteModalOpen={muteModalOpen}
//         onMuteClick={handleMuteClick}
//         onMuteClose={handleMuteClose}
//         onMute={handleMute}
//       />

//       <AudioCallComponent
//         open={isAudioCallOpen}
//         onClose={() => setIsAudioCallOpen(false)}
//         contact={activeContact}
//       />

//       <VideoComponent
//         open={isVideoCallOpen}
//         onClose={() => setIsVideoCallOpen(false)}
//         contact={activeContact}
//       />
//     </div>
//   );
// }

// export default ChatArea;
