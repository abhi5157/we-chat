// const express = require("express");
// const router = express.Router();
// const Chat = require("../models/chat");
// const User = require("../models/user");
// const { initiateCall, endCall } = require("../controllers/chat");
// const upload = require("../multerConfig");
// const Media = require("../models/media");

// router.post("/upload", upload.single("mediaFile"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send("No file uploaded");
//   }

//   const newMedia = new Media({
//     sender: req.body.sender,
//     receiver: req.body.receiver,
//     filePath: req.file.path,
//   });

//   newMedia
//     .save()
//     .then(() => res.status(200).json({ message: "File uploaded successfully" }))
//     .catch((err) =>
//       res.status(500).json({ message: "Database error", error: err })
//     );
// });

// router.post("/send", async (req, res) => {
//   const { senderId, receiverId, message } = req.body;

//   try {
//     const newMessage = new Chat({
//       sender: senderId,
//       receiver: receiverId,
//       //message
//     });

//     await newMessage.save();
//     res.status(201).json({ success: true, message: "Sent Successfully" });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// router.get("/history/:senderId/:receiverId", async (req, res) => {
//   const { senderId, receiverId } = req.params;

//   try {
//     const chatHistory = await Chat.find({
//       $or: [
//         { sender: senderId, receiver: receiverId },
//         { sender: receiverId, receiver: senderId },
//       ],
//     }).sort({ createdAt: 1 });

//     res.status(200).json(chatHistory);
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// router.post("/read", async (req, res) => {
//   const { senderId, receiverId } = req.body;

//   try {
//     await Chat.updateMany(
//       { sender: senderId, receiver: receiverId, isRead: false },
//       { $set: { isRead: true } }
//     );
//     res
//       .status(200)
//       .json({ success: true, message: "messages are marked as read" });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// router.put("/block-user/:id", async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const { blocked } = req.body;

//     const user = await User.findById(userId);

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     user.blocked = blocked;
//     await user.save();

//     return res
//       .status(200)
//       .json({ message: "User has been ${blocked ? 'blocked' : 'unblocked'}" });
//   } catch (error) {
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// });

// module.exports = router;

const express = require("express");
const router = express.Router();
const Chat = require("../models/chat");
const User = require("../models/user");
const { initiateCall, endCall } = require("../controllers/chat");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "video/mp4",
      "audio/mpeg",
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type"));
    }
  },
});

// Helper function to determine file type
const getFileType = (mimetype) => {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  if (mimetype.startsWith("audio/")) return "audio";
  return "document";
};

// Media upload route
router.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    const { senderId, receiverId } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;
    const fileType = getFileType(req.file.mimetype);

    // Create new chat message with file
    const newMessage = new Chat({
      sender: senderId,
      receiver: receiverId,
      content: fileUrl,
      type: fileType,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      isRead: false,
    });

    await newMessage.save();

    // Return the file URL and details for the frontend
    res.status(200).json({
      url: fileUrl,
      type: fileType,
      fileName: req.file.originalname,
      fileSize: req.file.size,
      messageId: newMessage._id,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res
      .status(500)
      .json({ message: "Error uploading file", error: error.message });
  }
});

// Send message route
router.post("/send", async (req, res) => {
  const { senderId, receiverId, message, type = "text" } = req.body;

  try {
    const newMessage = new Chat({
      sender: senderId,
      receiver: receiverId,
      content: message,
      type,
      isRead: false,
    });

    await newMessage.save();

    // Emit the message through Socket.IO
    const io = req.app.get("io"); // Access Socket.IO instance
    const receiverSocketId = req.app.get("userSocketMap").get(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive-message", {
        messageId: newMessage._id,
        senderId,
        content: message,
        type,
        timestamp: newMessage.createdAt,
      });
    }

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get chat history
router.get("/history/:senderId/:receiverId", async (req, res) => {
  const { senderId, receiverId } = req.params;

  try {
    const chatHistory = await Chat.find({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    })
      .sort({ createdAt: 1 })
      .select("-__v")
      .lean();

    // Add full URLs to file paths
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const formattedHistory = chatHistory.map((msg) => ({
      ...msg,
      content: msg.type !== "text" ? `${baseUrl}${msg.content}` : msg.content,
    }));

    res.status(200).json(formattedHistory);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Mark messages as read
router.post("/read", async (req, res) => {
  const { senderId, receiverId } = req.body;

  try {
    await Chat.updateMany(
      { sender: senderId, receiver: receiverId, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Block/Unblock user
router.put("/block-user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { blocked } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.blocked = blocked;
    await user.save();

    res.status(200).json({
      message: `User has been ${blocked ? "blocked" : "unblocked"}`,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
