// const mongoose = require('mongoose');

// const mediaSchema = new mongoose.Schema({
//     sender : {
//         type: String,
//         required: true
//     },
//     receiver:{
//         type: String,
//         required: true
//     },
//     filePath:{
//         type: String,
//         required: true
//     },

// });

// const Media = mongoose.model('Media', mediaSchema);

// module.exports = Media;

const mongoose = require("mongoose");

const mediaSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  filePath: { type: String, required: true },
  fileType: { type: String, required: true },
  fileName: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Media", mediaSchema);
