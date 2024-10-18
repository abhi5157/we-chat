const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const User = require('./models/user');
const crypto = require('crypto');
const PasswordReset = require('./models/passReset');
const http = require('http');
const socketIo = require('socket.io');
const signalingServer = require('./services/signaling');
const chatRoutes = require('./routes/chat');
const Chat = require('./models/chat');


const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({extended:true}));

const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", 'POST']
    }
});


app.use(bodyParser.json());
app.use('/api/chat', chatRoutes);




mongoose.connect('mongodb://localhost:27017/chat-app', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

app.use('/uploads', express.static('uploads'));

app.use('/chat',chatRoutes);


const generateResetToken = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 5; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
};


io.on('connection', (socket) => {
    console.log('User connected:', socket.id);


    socket.on('joinChat', ({ senderId, receiverId }) => {
        const room = [senderId, receiverId].sort().join('_');
        socket.join(room);
        console.log(`User ${senderId} joined chat room: ${room}`);
    });


    socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
        const newMessage = new Chat({
            sender: senderId,
            receiver: receiverId,
            message
        });

        await newMessage.save();

        const room = [senderId, receiverId].sort().join('_');
        io.to(room).emit('newMessage', { senderId, receiverId, message });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

app.post('/register', async (req, res) => {
    const { userName, passCode } = req.body;

    if (passCode.length !== 4 || isNaN(passCode)) {
        return res.status(400).send('Password must be a 4-digit number.');
    }

    try {
        const newUser = new User({
            userName,
            // email,
            // phoneNumber,
            passCode
        });
        await newUser.save();
        res.status(201).send('User registered successfully');
    } catch (error) {
        res.status(400).send(`Error registering user: ${error.message}`);
    }
});


app.post('/forgot-password', async (req, res) => {
    const { userName } = req.body;

    try {
        const user = await User.findOne({ userName });

        if (!user) {
            return res.status(404).send('User not found.');
        }


        const resetToken = generateResetToken();


        let passwordReset = await PasswordReset.findOne({ userName });

        if (passwordReset) {

            passwordReset.resetToken = resetToken;
            passwordReset.createdAt = Date.now();
        } else {

            passwordReset = new PasswordReset({
                userName,
                newPassCode: '',
                resetToken
            });
        }

        await passwordReset.save();
        res.status(200).send(`Password reset requested. Use this token to reset your password: ${resetToken}`);


    } catch (error) {
        res.status(500).send(`Error requesting password reset: ${error.message}`);
    }
});


app.post('/reset-password', async (req, res) => {
    const { userName, newPassCode, resetToken } = req.body;

    if (newPassCode.length !== 4 || isNaN(newPassCode)) {
        return res.status(400).send('PassCode must be a 4-digit number.');
    }

    try {
        const passCodeReset = await PasswordReset.findOne({ userName, resetToken });

        if (!passCodeReset) {
            return res.status(400).send('Invalid or expired token.');
        }


        const user = await User.findOne({ userName });
        user.passCode = newPassCode;
        await user.save();


        await PasswordReset.deleteOne({ userName, resetToken });

        res.status(200).send('Password has been reset successfully.');
    } catch (error) {
        res.status(500).send(`Error resetting password: ${error.message}`);
    }
});


app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send(`Error fetching users: ${error.message}`);
    }
});

require('./sockets/groupChat')(server);

const Server = http.createServer(app);
signalingServer(server);

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
