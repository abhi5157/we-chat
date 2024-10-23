import { useState } from "react";
import { IconButton, Typography, Box, Dialog } from "@mui/material";
import {
  Close as CloseIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  CallEnd as CallEndIcon,
} from "@mui/icons-material";

import {
  AddMemberIcon,
  VideoCallIcon,
  MiceIcon,
  OptionsIcon2,
  EndCallIcon,
} from "../Icons";

const AudioCallComponent = ({ open, onClose, contact }) => {
  const UserId = localStorage.getItem("Puser");
  console.log("Audio Component logged user", UserId);

  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const [isMuted, setIsMuted] = useState(false);

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleEndCall = () => {
    onClose();
  };
  console.log("user inside audio call", contact);
  return (
    <Dialog
      anchor="center"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "100%",
          maxWidth: 400,
          backgroundColor: "#E0F2F1",
        },
      }}
    >
      <Box
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#FFFFFF",
          padding: 2,
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Box
          sx={{
            height: "100%",
            display: "flex",
            width: "100%",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 3,
            backgroundColor: "#E0F2F1",
          }}
        >
          <Box sx={{ width: "100%", textAlign: "right" }}>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box
              component="img"
              src={contact?.avatar}
              alt={contact?.firstName}
              sx={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                marginBottom: 2,
              }}
            />
            <Typography variant="h6" sx={{ color: "#26A69A" }}>
              {contact?.firstName} {contact?.lastName}
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              Ringing...
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 3, my: 2 }}>
          <IconButton
            onClick={handleMuteToggle}
            sx={{
              backgroundColor: "#26A69A",
              color: "white",
              "&:hover": { backgroundColor: "#2c8f86" },
            }}
          >
            {isMuted ? <MicOffIcon /> : <MicIcon />}
          </IconButton>
          <IconButton
            onClick={handleEndCall}
            sx={{
              backgroundColor: "#ef5350",
              color: "white",
              "&:hover": { backgroundColor: "#e53935" },
            }}
          >
            <CallEndIcon />
          </IconButton>
          {/* <IconButton>
            <AddMemberIcon />
          </IconButton>
          <IconButton>
            <VideoCallIcon />
          </IconButton>
          <IconButton>
            <MicIcon />
          </IconButton>
          <IconButton>
            <OptionsIcon2 />
          </IconButton>
          <IconButton>
            <EndCallIcon />
          </IconButton> */}
        </Box>
      </Box>
    </Dialog>
  );
};

export default AudioCallComponent;

// AudioCall.jsx

// import { useState, useEffect, useRef } from "react";
// import { IconButton, Typography, Box, Dialog, Snackbar } from "@mui/material";
// // import { useSocket } from "../contexts/SocketContext.js";
// import { useSocket } from "../../../context/SocketContext.jsx";

// import {
//   Close as CloseIcon,
//   Mic as MicIcon,
//   MicOff as MicOffIcon,
//   CallEnd as CallEndIcon,
// } from "@mui/icons-material";
// // import { io } from "socket.io-client";

// const AudioCall = ({ open, onClose, contact }) => {
//   const userId = localStorage.getItem("Puser");
//   const [isMuted, setIsMuted] = useState(false);
//   const [callStatus, setCallStatus] = useState("initiating");
//   const [showError, setShowError] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   const peerConnectionRef = useRef();
//   const localStreamRef = useRef();
//   const remoteStreamRef = useRef();
//   const { socket } = useSocket();

//   const createPeerConnection = () => {
//     const configuration = {
//       iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
//     };

//     const pc = new RTCPeerConnection(configuration);

//     pc.onicecandidate = (event) => {
//       if (event.candidate) {
//         socket.emit("ice-candidate", {
//           userId: contact._id,
//           candidate: event.candidate,
//         });
//       }
//     };

//     pc.ontrack = (event) => {
//       remoteStreamRef.current = event.streams[0];
//       const remoteAudio = document.getElementById("remoteAudio");
//       if (remoteAudio) {
//         remoteAudio.srcObject = event.streams[0];
//       }
//     };

//     return pc;
//   };

//   const initializeCall = async () => {
//     try {
//       // Request call first
//       socket.emit("call-request", {
//         callerId: userId,
//         receiverId: contact._id,
//         callerName: localStorage.getItem("userName") || "User",
//       });

//       setCallStatus("requesting");
//     } catch (err) {
//       console.error("Error starting call:", err);
//       setErrorMessage("Failed to initialize call");
//       setShowError(true);
//       onClose();
//     }
//   };

//   const startCall = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//       localStreamRef.current = stream;

//       peerConnectionRef.current = createPeerConnection();

//       stream.getTracks().forEach((track) => {
//         peerConnectionRef.current.addTrack(track, stream);
//       });

//       const offer = await peerConnectionRef.current.createOffer();
//       await peerConnectionRef.current.setLocalDescription(offer);

//       socket.emit("webrtc-offer", {
//         callerId: userId,
//         receiverId: contact._id,
//         offer: offer,
//       });

//       setCallStatus("ringing");
//     } catch (err) {
//       console.error("Error starting call:", err);
//       setErrorMessage("Failed to start call");
//       setShowError(true);
//       onClose();
//     }
//   };

//   useEffect(() => {
//     if (!open) return;

//     // Set up socket listeners
//     socket.on("call-accepted", async ({ receiverId }) => {
//       if (receiverId === contact._id) {
//         await startCall();
//       }
//     });

//     socket.on("call-rejected", ({ receiverId, message }) => {
//       if (receiverId === contact._id) {
//         setErrorMessage(message);
//         setShowError(true);
//         onClose();
//       }
//     });

//     socket.on("call-failed", ({ message }) => {
//       setErrorMessage(message);
//       setShowError(true);
//       onClose();
//     });

//     socket.on("webrtc-answer", async ({ answer }) => {
//       try {
//         await peerConnectionRef.current.setRemoteDescription(
//           new RTCSessionDescription(answer)
//         );
//         setCallStatus("connected");
//       } catch (err) {
//         console.error("Error handling call acceptance:", err);
//       }
//     });

//     socket.on("ice-candidate", async ({ candidate }) => {
//       try {
//         if (peerConnectionRef.current) {
//           await peerConnectionRef.current.addIceCandidate(
//             new RTCIceCandidate(candidate)
//           );
//         }
//       } catch (err) {
//         console.error("Error handling ICE candidate:", err);
//       }
//     });

//     socket.on("call-ended", () => {
//       endCall();
//     });

//     // Initialize call
//     initializeCall();

//     // Cleanup
//     return () => {
//       socket.off("call-accepted");
//       socket.off("call-rejected");
//       socket.off("call-failed");
//       socket.off("webrtc-answer");
//       socket.off("ice-candidate");
//       socket.off("call-ended");

//       if (localStreamRef.current) {
//         localStreamRef.current.getTracks().forEach((track) => track.stop());
//       }
//       if (peerConnectionRef.current) {
//         peerConnectionRef.current.close();
//       }
//     };
//   }, [open]);

//   const handleMuteToggle = () => {
//     if (localStreamRef.current) {
//       localStreamRef.current.getAudioTracks().forEach((track) => {
//         track.enabled = !track.enabled;
//       });
//       setIsMuted(!isMuted);
//     }
//   };

//   const handleEndCall = () => {
//     socket.emit("end-call", { userId: contact._id });
//     endCall();
//   };

//   const endCall = () => {
//     if (localStreamRef.current) {
//       localStreamRef.current.getTracks().forEach((track) => track.stop());
//     }
//     if (peerConnectionRef.current) {
//       peerConnectionRef.current.close();
//     }
//     setCallStatus("ended");
//     onClose();
//   };

//   return (
//     <>
//       <Dialog
//         open={open}
//         onClose={onClose}
//         PaperProps={{
//           sx: {
//             width: "100%",
//             maxWidth: 400,
//             backgroundColor: "#E0F2F1",
//           },
//         }}
//       >
//         <Box
//           sx={{
//             height: "100%",
//             display: "flex",
//             flexDirection: "column",
//             backgroundColor: "#FFFFFF",
//             padding: 2,
//             alignItems: "center",
//             justifyContent: "space-between",
//             width: "100%",
//           }}
//         >
//           <audio id="remoteAudio" autoPlay />

//           <Box
//             sx={{
//               height: "100%",
//               display: "flex",
//               width: "100%",
//               flexDirection: "column",
//               alignItems: "center",
//               justifyContent: "space-between",
//               padding: 3,
//               backgroundColor: "#E0F2F1",
//             }}
//           >
//             <Box sx={{ width: "100%", textAlign: "right" }}>
//               <IconButton onClick={onClose}>
//                 <CloseIcon />
//               </IconButton>
//             </Box>

//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//               }}
//             >
//               <Box
//                 component="img"
//                 src={contact?.avatar}
//                 alt={contact?.firstName}
//                 sx={{
//                   width: 120,
//                   height: 120,
//                   borderRadius: "50%",
//                   marginBottom: 2,
//                 }}
//               />
//               <Typography variant="h6" sx={{ color: "#26A69A" }}>
//                 {contact?.firstName} {contact?.lastName}
//               </Typography>
//               <Typography variant="body2" sx={{ color: "#64748B" }}>
//                 {callStatus === "requesting" && "Requesting call..."}
//                 {callStatus === "initiating" && "Initiating call..."}
//                 {callStatus === "ringing" && "Ringing..."}
//                 {callStatus === "connected" && "Connected"}
//                 {callStatus === "ended" && "Call ended"}
//               </Typography>
//             </Box>
//           </Box>

//           <Box sx={{ display: "flex", gap: 3, my: 2 }}>
//             <IconButton
//               onClick={handleMuteToggle}
//               sx={{
//                 backgroundColor: "#26A69A",
//                 color: "white",
//                 "&:hover": { backgroundColor: "#2c8f86" },
//               }}
//             >
//               {isMuted ? <MicOffIcon /> : <MicIcon />}
//             </IconButton>
//             <IconButton
//               onClick={handleEndCall}
//               sx={{
//                 backgroundColor: "#ef5350",
//                 color: "white",
//                 "&:hover": { backgroundColor: "#e53935" },
//               }}
//             >
//               <CallEndIcon />
//             </IconButton>
//           </Box>
//         </Box>
//       </Dialog>

//       <Snackbar
//         open={showError}
//         autoHideDuration={6000}
//         onClose={() => setShowError(false)}
//         message={errorMessage}
//       />
//     </>
//   );
// };

// export default AudioCall;
