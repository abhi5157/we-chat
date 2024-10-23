// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const User = require("./models/user");
// const crypto = require("crypto");
// const PasswordReset = require("./models/passReset");
// const http = require("http");
// const cors = require("cors");
// const socketIo = require("socket.io");
// const signalingServer = require("./services/signaling");
// const chatRoutes = require("./routes/chat");
// const Chat = require("./models/chat");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
// require("dotenv").config();

// const app = express();
// const server = http.createServer(app);

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(
//   cors({
//     origin: "*",
//     credentials: true,
//   })
// );

// const io = socketIo(server, {
//   cors: {
//     origin: "*",
//     methods: ["GET", "POST"],
//   },
// });

// app.use(bodyParser.json());
// app.use("/api/chat", chatRoutes);

// mongoose
//   .connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("DB Connetion Successfull");
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

// app.use("/uploads", express.static("uploads"));

// //app.use("/chat", chatRoutes);

// const generateResetToken = () => {
//   const chars =
//     "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//   let token = "";
//   for (let i = 0; i < 5; i++) {
//     token += chars.charAt(Math.floor(Math.random() * chars.length));
//   }
//   return token;
// };

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   socket.on("joinChat", ({ senderId, receiverId }) => {
//     const room = [senderId, receiverId].sort().join("_");
//     socket.join(room);
//     console.log(`User ${senderId} joined chat room: ${room}`);
//   });

//   socket.on("sendMessage", async ({ senderId, receiverId, message }) => {
//     const newMessage = new Chat({
//       sender: senderId,
//       receiver: receiverId,
//       message,
//     });

//     await newMessage.save();

//     const room = [senderId, receiverId].sort().join("_");
//     io.to(room).emit("newMessage", { senderId, receiverId, message });
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

// app.post("/api/users", async (req, res) => {
//   const { firstName, lastName, email, mobile, password } = req.body;

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ message: "User with this email already exists." });
//     }

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     const newUser = new User({
//       firstName,
//       lastName,
//       email,
//       mobile,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     res.status(201).json({
//       message: "User registered successfully",
//       token,
//       user: { id: newUser._id, email: newUser.email },
//     });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ message: `Error registering user: ${error.message}` });
//   }
// });

// app.post("/api/auth/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
//       expiresIn: "1h",
//     });

//     res.json({ token, user: { id: user._id, email: user.email } });
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// app.post("/forgot-password", async (req, res) => {
//   const { userName } = req.body;

//   try {
//     const user = await User.findOne({ userName });

//     if (!user) {
//       return res.status(404).send("User not found.");
//     }

//     const resetToken = generateResetToken();

//     let passwordReset = await PasswordReset.findOne({ userName });

//     if (passwordReset) {
//       passwordReset.resetToken = resetToken;
//       passwordReset.createdAt = Date.now();
//     } else {
//       passwordReset = new PasswordReset({
//         userName,
//         newPassCode: "",
//         resetToken,
//       });
//     }

//     await passwordReset.save();
//     res
//       .status(200)
//       .send(
//         `Password reset requested. Use this token to reset your password: ${resetToken}`
//       );
//   } catch (error) {
//     res.status(500).send(`Error requesting password reset: ${error.message}`);
//   }
// });

// app.post("/reset-password", async (req, res) => {
//   const { userName, newPassCode, resetToken } = req.body;

//   if (newPassCode.length !== 4 || isNaN(newPassCode)) {
//     return res.status(400).send("PassCode must be a 4-digit number.");
//   }

//   try {
//     const passCodeReset = await PasswordReset.findOne({ userName, resetToken });

//     if (!passCodeReset) {
//       return res.status(400).send("Invalid or expired token.");
//     }

//     const user = await User.findOne({ userName });
//     user.passCode = newPassCode;
//     await user.save();

//     await PasswordReset.deleteOne({ userName, resetToken });

//     res.status(200).send("Password has been reset successfully.");
//   } catch (error) {
//     res.status(500).send(`Error resetting password: ${error.message}`);
//   }
// });

// app.get("/users", async (req, res) => {
//   try {
//     const users = await User.find();
//     res.status(200).json(users);
//   } catch (error) {
//     res.status(500).send(`Error fetching users: ${error.message}`);
//   }
// });

// require("./sockets/groupChat")(server);

// const Server = http.createServer(app);
// signalingServer(server);

// const port = process.env.PORT || 3001;
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const User = require("./models/user");
const crypto = require("crypto");
const PasswordReset = require("./models/passReset");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");
const signalingServer = require("./services/signaling");
const chatRoutes = require("./routes/chat");
const Chat = require("./models/chat");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// CORS configuration
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Socket.IO setup with CORS
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api/chat", chatRoutes);
app.use("/uploads", express.static("uploads"));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successful");
  })
  .catch((err) => {
    console.log(err.message);
  });

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinRoom", (room) => {
    socket.join(room);
    console.log(`User ${socket.id} joined room ${room}`);
  });

  socket.on("sendMessage", ({ room, message }) => {
    // Broadcast to room except sender
    socket.to(room).emit("receiveMessage", message);
    console.log(`Message sent to room ${room}:`, message);
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Helper function for password reset
const generateResetToken = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 5; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

// Authentication Routes
app.post("/api/users", async (req, res) => {
  const { firstName, lastName, email, mobile, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      mobile,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: { id: newUser._id, email: newUser.email },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: `Error registering user: ${error.message}` });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user: { id: user._id, email: user.email } });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Password Reset Routes
app.post("/forgot-password", async (req, res) => {
  const { userName } = req.body;

  try {
    const user = await User.findOne({ userName });

    if (!user) {
      return res.status(404).send("User not found.");
    }

    const resetToken = generateResetToken();

    let passwordReset = await PasswordReset.findOne({ userName });

    if (passwordReset) {
      passwordReset.resetToken = resetToken;
      passwordReset.createdAt = Date.now();
    } else {
      passwordReset = new PasswordReset({
        userName,
        newPassCode: "",
        resetToken,
      });
    }

    await passwordReset.save();
    res
      .status(200)
      .send(
        `Password reset requested. Use this token to reset your password: ${resetToken}`
      );
  } catch (error) {
    res.status(500).send(`Error requesting password reset: ${error.message}`);
  }
});

app.post("/reset-password", async (req, res) => {
  const { userName, newPassCode, resetToken } = req.body;

  if (newPassCode.length !== 4 || isNaN(newPassCode)) {
    return res.status(400).send("PassCode must be a 4-digit number.");
  }

  try {
    const passCodeReset = await PasswordReset.findOne({ userName, resetToken });

    if (!passCodeReset) {
      return res.status(400).send("Invalid or expired token.");
    }

    const user = await User.findOne({ userName });
    user.passCode = newPassCode;
    await user.save();

    await PasswordReset.deleteOne({ userName, resetToken });

    res.status(200).send("Password has been reset successfully.");
  } catch (error) {
    res.status(500).send(`Error resetting password: ${error.message}`);
  }
});

// User Routes
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(`Error fetching users: ${error.message}`);
  }
});

// Start the server
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
