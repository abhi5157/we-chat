const WebSocket = require('ws');
const {initiateCall , endCall} = require('../controllers/chat');
const { json } = require('body-parser');

const signalingServer = (server)=>{
    const wss = new WebSocket.Server({server});

    const activeCalls = {};
    
    wss.on('connection', (socket)=>{
        socket.on('message', async(data)=>{
            const message = JSON.parse(data);

            switch (message.type){
                case 'offer':
                    await initiateCall(message.senderId, message.receiverId);
                    handleOffer(message, socket);
                    break;
                case 'answer': 
                    handleAnswer(message, socket);
                    break;
                case 'ice-candidate': 
                    handleICECandidate(message, socket);
                    break;
                case 'endCall':
                    await endCall(message.senderId, message.receiverId);
                    handleEndCall(message, socket);
                default: 
                    console.log('Unknown message type');
            }
        });
        socket.on('close', ()=>{
            console.log('User disconnected');
        });
    });

    const handleOffer = (message, socket) =>{
        activeCalls[message.receiverId] = {
            offer: message.offer,
            callerSocket: socket
        };
        if(activeCalls[message.receiverId]) {
            activeCalls[message.receiverId].callerSocket.send(JSON.stringify({
                type: 'offer',
                offer : message.offer,
                senderId: message.senderId,
            }));
        }
    };

    const handleAnswer = (message, socket) =>{
        if(activeCalls[message.senderId]){
            activeCalls[message.senderId].callerSocket.send(JSON.stringify({
                type: 'answer',
                answer: message.answer,
            }));
        }
    };

    const handleICECandidate = (message, socket) =>{
        if(activeCalls[message.peerId]) {
            activeCalls[message.peerId].callerSocket.send(JSON.stringify({
                type: 'ice-candidate',
                candidate : message.candidate,
            }));
            
        }
    };
    
    const handleEndCall = (message, socket) => {
        if(activeCalls[message.receiverId]) {
            activeCalls[message.receiverId].callerSocket.send(JSON.stringify ({
                type: 'endCall',
            }));
            delete activeCalls[message.receiverId];
        }
    };
};

module.exports = signalingServer;