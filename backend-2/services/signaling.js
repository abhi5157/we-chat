const WebSocket = require("ws");
const { initiateCall, endCall } = require("../controllers/chat");
const { json } = require("body-parser");

const signalingServer = (server) => {
  const wss = new WebSocket.Server({ server });

  const activeCalls = {};

  wss.on("connection", (socket) => {
    socket.on("message", async (data) => {
      const message = JSON.parse(data);

      switch (message.type) {
        case "offer":
          await initiateCall(message.senderId, message.receiverId);
          handleOffer(message, socket);
          break;
        case "answer":
          handleAnswer(message, socket);
          break;
        case "ice-candidate":
          handleICECandidate(message, socket);
          break;
        case "endCall":
          await endCall(message.senderId, message.receiverId);
          handleEndCall(message, socket);
        default:
          console.log("Unknown message type");
      }
    });
    socket.on("close", () => {
      console.log("User disconnected");
    });
  });

  const handleOffer = (message, socket) => {
    activeCalls[message.receiverId] = {
      offer: message.offer,
      callerSocket: socket,
    };
    if (activeCalls[message.receiverId]) {
      activeCalls[message.receiverId].callerSocket.send(
        JSON.stringify({
          type: "offer",
          offer: message.offer,
          senderId: message.senderId,
        })
      );
    }
  };

  const handleAnswer = (message, socket) => {
    if (activeCalls[message.senderId]) {
      activeCalls[message.senderId].callerSocket.send(
        JSON.stringify({
          type: "answer",
          answer: message.answer,
        })
      );
    }
  };

  const handleICECandidate = (message, socket) => {
    if (activeCalls[message.peerId]) {
      activeCalls[message.peerId].callerSocket.send(
        JSON.stringify({
          type: "ice-candidate",
          candidate: message.candidate,
        })
      );
    }
  };

  const handleEndCall = (message, socket) => {
    if (activeCalls[message.receiverId]) {
      activeCalls[message.receiverId].callerSocket.send(
        JSON.stringify({
          type: "endCall",
        })
      );
      delete activeCalls[message.receiverId];
    }
  };
};

module.exports = signalingServer;

// // signaling.js (Backend)

// services/signaling.js
// const initializeSignalingServer = (io) => {
//   // Keep track of online users and active calls
//   const onlineUsers = new Map();
//   const activeCallRequests = new Map();

//   io.on("connection", (socket) => {
//     console.log("New WebRTC connection:", socket.id);

//     // Handle user registration
//     socket.on("register", (userId) => {
//       console.log(`User registered: ${userId}`);
//       onlineUsers.set(userId, socket.id);
//       socket.userId = userId; // Store userId in socket for easy access
//     });

//     // Handle initial call request
//     socket.on("call-request", ({ callerId, receiverId, callerName }) => {
//       console.log(`Call request from ${callerId} to ${receiverId}`);
//       const receiverSocketId = onlineUsers.get(receiverId);

//       if (receiverSocketId) {
//         // Store call request details
//         activeCallRequests.set(receiverId, {
//           callerId,
//           callerName,
//           timestamp: Date.now(),
//         });

//         // Notify receiver
//         io.to(receiverSocketId).emit("incoming-call-request", {
//           callerId,
//           callerName,
//         });
//       } else {
//         // Receiver is offline
//         socket.emit("call-failed", {
//           message: "User is offline",
//           receiverId,
//         });
//       }
//     });

//     // Handle call acceptance
//     socket.on("call-accepted", ({ callerId, receiverId }) => {
//       const callerSocketId = onlineUsers.get(callerId);
//       if (callerSocketId) {
//         console.log(`Call accepted by ${receiverId}`);
//         activeCallRequests.delete(receiverId);
//         io.to(callerSocketId).emit("call-accepted", { receiverId });
//       }
//     });

//     // Handle call rejection
//     socket.on("call-rejected", ({ callerId, receiverId }) => {
//       const callerSocketId = onlineUsers.get(callerId);
//       if (callerSocketId) {
//         console.log(`Call rejected by ${receiverId}`);
//         activeCallRequests.delete(receiverId);
//         io.to(callerSocketId).emit("call-rejected", {
//           receiverId,
//           message: "Call was rejected",
//         });
//       }
//     });

//     // Handle WebRTC signaling
//     socket.on("webrtc-offer", ({ callerId, receiverId, offer }) => {
//       const receiverSocketId = onlineUsers.get(receiverId);
//       if (receiverSocketId) {
//         io.to(receiverSocketId).emit("webrtc-offer", {
//           callerId,
//           offer,
//         });
//       }
//     });

//     socket.on("webrtc-answer", ({ callerId, receiverId, answer }) => {
//       const callerSocketId = onlineUsers.get(callerId);
//       if (callerSocketId) {
//         io.to(callerSocketId).emit("webrtc-answer", { answer });
//       }
//     });

//     socket.on("ice-candidate", ({ userId, candidate }) => {
//       const userSocketId = onlineUsers.get(userId);
//       if (userSocketId) {
//         io.to(userSocketId).emit("ice-candidate", { candidate });
//       }
//     });

//     // Handle call end
//     socket.on("end-call", ({ userId }) => {
//       const userSocketId = onlineUsers.get(userId);
//       if (userSocketId) {
//         io.to(userSocketId).emit("call-ended");
//       }
//     });

//     // Handle disconnection
//     socket.on("disconnect", () => {
//       if (socket.userId) {
//         console.log(`User disconnected: ${socket.userId}`);
//         onlineUsers.delete(socket.userId);

//         // Clean up any active call requests
//         if (activeCallRequests.has(socket.userId)) {
//           const request = activeCallRequests.get(socket.userId);
//           const callerSocketId = onlineUsers.get(request.callerId);
//           if (callerSocketId) {
//             io.to(callerSocketId).emit("call-failed", {
//               message: "User disconnected",
//               receiverId: socket.userId,
//             });
//           }
//           activeCallRequests.delete(socket.userId);
//         }
//       }
//     });
//   });

//   // Cleanup old call requests periodically
//   setInterval(() => {
//     const now = Date.now();
//     for (const [receiverId, request] of activeCallRequests.entries()) {
//       if (now - request.timestamp > 60000) {
//         // Remove requests older than 1 minute
//         const callerSocketId = onlineUsers.get(request.callerId);
//         if (callerSocketId) {
//           io.to(callerSocketId).emit("call-failed", {
//             message: "Call request timed out",
//             receiverId,
//           });
//         }
//         activeCallRequests.delete(receiverId);
//       }
//     }
//   }, 30000); // Run every 30 seconds
// };

// module.exports = initializeSignalingServer;
