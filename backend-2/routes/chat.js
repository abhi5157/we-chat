const express = require('express');
const router = express.Router();
const Chat = require('../models/chat');
const User = require('../models/user');
const {initiateCall, endCall } = require('../controllers/chat');
const upload = require('../multerConfig');
const Media = require('../models/media');


router.post('/upload', upload.single('mediaFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    
    const newMedia = new Media({
        sender: req.body.sender,
        receiver: req.body.receiver,
        filePath: req.file.path
    });

    newMedia.save()
        .then(() => res.status(200).json({ message: 'File uploaded successfully' }))
        .catch(err => res.status(500).json({ message: 'Database error', error: err }));
});




router.post('/send', async (req, res) => {
    const{senderId, receiverId, message} = req.body;

    try{
        const newMessage = new Chat({
            sender: senderId,
            receiver: receiverId,
            //message 
        });

        await newMessage.save();
        res.status(201).json({success: true, message: 'Sent Successfully'});
    }catch(error){
        res.status(500).json({success: false, error: error.message});

    }
});

router.get('/history/:senderId/:receiverId', async(req, res)=>{
    const{senderId, receiverId} = req.params;

    try{
        const chatHistory = await Chat.find({
            $or:[
                {sender: senderId, receiver: receiverId
                },
                {sender: receiverId, receiver: senderId}
            ]
        }).sort({createdAt: 1});

        res.status(200).json(chatHistory);
    }catch(error){
        res.status(500).json({success: false, error: error.message});

    }
});

router.post('/read', async(req, res) =>{
    const{senderId, receiverId} = req.body;

    try{
        await Chat.updateMany(
            { sender: senderId, receiver: receiverId, isRead: false },
            {$set : {isRead: true}} 
            );
            res.status(200).json({success: true, message: 'messages are marked as read'});

        }catch(error){
            res.status(500).json({success: false, error: error.message});
        }
    
});

module.exports = router;
