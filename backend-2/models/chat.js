// const mongoose = require("mongoose");

// const chatSchema = new mongoose.Schema({
//   sender: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   receiver: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//   // message: {
//   //     type: String,
//   //     required: true,

//   // },
//   isRead: {
//     type: Boolean,
//     default: false,
//   },
// });

// const Chat = mongoose.model("Chat", chatSchema);
// module.exports = Chat;

const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  messageType: {
    type: String,
    enum: ["text", "image", "video", "audio", "document"],
    default: "text",
  },
  fileName: {
    type: String,
    default: null,
  },
  fileSize: {
    type: Number,
    default: null,
  },
  mimeType: {
    type: String,
    default: null,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Chat", chatSchema);
