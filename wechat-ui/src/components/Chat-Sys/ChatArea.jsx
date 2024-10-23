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

const SOCKET_URL = "http://localhost:5000";
const ALLOWED_FILE_TYPES = {
  image: ["image/jpeg", "image/png", "image/gif"],
  video: ["video/mp4", "video/webm"],
  audio: ["audio/mp3", "audio/wav", "audio/mpeg"],
  document: [".pdf", ".doc", ".docx", ".txt"],
};

function ChatArea({ activeUser }) {
  const userId = localStorage.getItem("Puser");
  const [message, setMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [muteModalOpen, setMuteModalOpen] = useState(false);
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);
  const [isAudioCallOpen, setIsAudioCallOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [messagesByContact, setMessagesByContact] = useState({});

  // useEffect(() => {
  //   console.log("Socket initialized:", socket);
  // }, [socket]);

  // Initialize socket connection
  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to socket server");
      newSocket.emit("register", userId);
    });

    // Listen for incoming messages
    newSocket.on("receive-message", (data) => {
      setMessagesByContact((prev) => ({
        ...prev,
        [data.senderId]: [
          ...(prev[data.senderId] || []),
          {
            senderId: data.senderId,
            content: data.message,
            timestamp: data.timestamp,
            type: "text",
          },
        ],
      }));
    });
    // const scrollToBottom = () => {
    //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    // };

    // File upload handler
    // Fetch chat history when component mounts
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`${SOCKET_URL}/chat-history/${userId}`);
        const history = await response.json();

        // Organize messages by contact
        const messagesByContactId = {};
        history.forEach((msg) => {
          const contactId =
            msg.senderId === userId ? msg.receiverId : msg.senderId;
          if (!messagesByContactId[contactId]) {
            messagesByContactId[contactId] = [];
          }
          messagesByContactId[contactId].push({
            senderId: msg.senderId,
            content: msg.content,
            timestamp: msg.timestamp,
            type: msg.type,
          });
        });

        setMessagesByContact(messagesByContactId);
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();

    return () => newSocket.close();
  }, [userId]);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // const fileType = file.type;

    // const isValidType = Object.values(ALLOWED_FILE_TYPES)
    //   .flat()
    //   .includes(fileType);

    // if (!isValidType) {
    //   alert("Invalid file type");
    //   return;
    // }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("senderId", userId);
    formData.append("receiverId", activeUser._id);

    try {
      const response = await fetch(`${SOCKET_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.url) {
        const messageData = {
          senderId: userId,
          receiverId: activeUser._id,
          message: data.url,
          type: getFileType(file.type),
          fileName: file.name,
        };

        socket.emit("private-message", messageData);

        setMessagesByContact((prev) => ({
          ...prev,
          [activeUser._id]: [
            ...(prev[activeUser._id] || []),
            {
              senderId: userId,
              content: data.url,
              type: getFileType(file.type),
              fileName: file.name,
              timestamp: new Date(),
            },
          ],
        }));
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  const getFileType = (mimeType) => {
    if (ALLOWED_FILE_TYPES.image.includes(mimeType)) return "image";
    if (ALLOWED_FILE_TYPES.video.includes(mimeType)) return "video";
    if (ALLOWED_FILE_TYPES.audio.includes(mimeType)) return "audio";
    return "document";
  };

  const renderMessage = (msg) => {
    switch (msg.type) {
      case "image":
        return (
          <img src={msg.content} alt="Shared" className="max-w-xs rounded" />
        );
      case "video":
        return (
          <video controls className="max-w-xs">
            <source src={msg.content} type="video/mp4" />
            Your browser does not support video playback.
          </video>
        );
      case "audio":
        return (
          <audio controls className="max-w-xs">
            <source src={msg.content} type="audio/mpeg" />
            Your browser does not support audio playback.
          </audio>
        );
      case "document":
        return (
          <a
            href={msg.content}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-blue-500 hover:underline"
          >
            <AddIcon className="w-5 h-5" />
            <span>{msg.fileName}</span>
          </a>
        );
      default:
        return <div className="break-words">{msg.content}</div>;
    }
  };

  const handleSend = () => {
    if (!message.trim() || !socket || !activeUser) return;

    const messageData = {
      senderId: userId,
      receiverId: activeUser._id,
      message: message.trim(),
    };

    socket.emit("private-message", messageData);

    // Add message to the specific contact's message list
    setMessagesByContact((prev) => ({
      ...prev,
      [activeUser._id]: [
        ...(prev[activeUser._id] || []),
        {
          senderId: userId,
          content: message.trim(),
          timestamp: new Date(),
          type: "text",
        },
      ],
    }));

    setMessage("");
  };

  // Get messages for the current active user
  const currentMessages = messagesByContact[activeUser?._id] || [];

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
        {currentMessages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.senderId === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md xl:max-w-lg rounded-lg p-3 ${
                msg.senderId === userId
                  ? "bg-[#26A69A] text-white"
                  : "bg-gray-100"
              }`}
            >
              {renderMessage(msg)}
              <div className="text-xs text-gray-500 mt-1">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area with File Upload */}
      <div className="border-t p-4">
        <div className="flex items-center space-x-2">
          <button
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
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

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            multiple={false}
          />

          <button
            className="p-2 rounded-full bg-gray-100 hover:bg-[#26A69A]"
            onClick={() => fileInputRef.current?.click()}
          >
            <AddIcon />
          </button>

          {isUploading && (
            <div className="h-1 w-20 bg-gray-200 rounded">
              <div
                className="h-full bg-[#26A69A] rounded"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Type a message"
            className="flex-1 border rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#26A69A]"
          />

          <button
            className="p-2 rounded-full bg-gray-500 hover:bg-[#26A69A] text-white"
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
