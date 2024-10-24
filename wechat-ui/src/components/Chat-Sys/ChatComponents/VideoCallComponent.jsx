// Frontend: VideoCallComponent.jsx
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { IconButton, Typography, Box, Dialog } from "@mui/material";
import {
  Close as CloseIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  CallEnd as CallEndIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
} from "@mui/icons-material";

const VideoCallComponent = ({ open, onClose, contact, socket, userId }) => {
  userId = localStorage.getItem("Puser");
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const peerConnection = useRef();

  const servers = {
    iceServers: [
      {
        urls: [
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
        ],
      },
    ],
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("callUser", ({ from, signal }) => {
      setIsReceivingCall(true);
      // Store the incoming call data
      peerConnection.current = { from, signal };
    });

    socket.on("callAccepted", async (signal) => {
      setCallAccepted(true);
      const peer = peerConnection.current;
      try {
        await peer.setRemoteDescription(new RTCSessionDescription(signal));
      } catch (err) {
        console.error("Error setting remote description:", err);
      }
    });

    socket.on("callRejected", () => {
      endCall();
      alert("Call was rejected");
    });

    socket.on("callEnded", () => {
      endCall();
    });

    return () => {
      socket.off("callUser");
      socket.off("callAccepted");
      socket.off("callRejected");
      socket.off("callEnded");
    };
  }, [socket]);

  const startCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const peer = new RTCPeerConnection(servers);
      peerConnection.current = peer;

      stream.getTracks().forEach((track) => {
        peer.addTrack(track, stream);
      });

      peer.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      socket.emit("callUser", {
        userToCall: contact._id,
        from: userId,
        signal: offer,
      });

      setIsCalling(true);
    } catch (err) {
      console.error("Error starting call:", err);
    }
  };

  const answerCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const peer = new RTCPeerConnection(servers);

      stream.getTracks().forEach((track) => {
        peer.addTrack(track, stream);
      });

      peer.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      await peer.setRemoteDescription(
        new RTCSessionDescription(peerConnection.current.signal)
      );

      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socket.emit("answerCall", {
        to: peerConnection.current.from,
        signal: answer,
      });

      setCallAccepted(true);
      setIsReceivingCall(false);
    } catch (err) {
      console.error("Error answering call:", err);
    }
  };

  const rejectCall = () => {
    socket.emit("rejectCall", {
      to: peerConnection.current.from,
    });
    setIsReceivingCall(false);
  };

  const endCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    setLocalStream(null);
    setRemoteStream(null);
    setIsCalling(false);
    setCallAccepted(false);
    setIsReceivingCall(false);
    onClose();

    socket.emit("endCall", {
      to: contact._id,
    });
  };

  const toggleMute = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      localStream.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box sx={{ p: 2, bgcolor: "#1a1a1a", color: "white" }}>
        {isReceivingCall && !callAccepted && (
          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="h6">
              {contact.firstName} is calling...
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton
                onClick={answerCall}
                sx={{ bgcolor: "green", color: "white", mr: 2 }}
              >
                <VideocamIcon />
              </IconButton>
              <IconButton
                onClick={rejectCall}
                sx={{ bgcolor: "red", color: "white" }}
              >
                <CallEndIcon />
              </IconButton>
            </Box>
          </Box>
        )}

        <Box sx={{ display: "flex", gap: 2, height: "400px" }}>
          <Box sx={{ flex: 1, bgcolor: "#000", position: "relative" }}>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              style={{ width: "100%", height: "100%" }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 16,
                left: 16,
              }}
            >
              <Typography variant="subtitle1">
                {contact.firstName} {contact.lastName}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ width: "200px", bgcolor: "#000" }}>
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              style={{ width: "100%", height: "100%" }}
            />
          </Box>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
          <IconButton
            onClick={toggleMute}
            sx={{
              bgcolor: isMuted ? "#ef5350" : "#26A69A",
              color: "white",
              "&:hover": { bgcolor: isMuted ? "#e53935" : "#2c8f86" },
            }}
          >
            {isMuted ? <MicOffIcon /> : <MicIcon />}
          </IconButton>
          <IconButton
            onClick={toggleVideo}
            sx={{
              bgcolor: isVideoOff ? "#ef5350" : "#26A69A",
              color: "white",
              "&:hover": { bgcolor: isVideoOff ? "#e53935" : "#2c8f86" },
            }}
          >
            {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
          </IconButton>
          <IconButton
            onClick={endCall}
            sx={{
              bgcolor: "#ef5350",
              color: "white",
              "&:hover": { bgcolor: "#e53935" },
            }}
          >
            <CallEndIcon />
          </IconButton>

          <IconButton
            onClick={startCall}
            sx={{
              bgcolor: "#ef5350",
              color: "white",
              "&:hover": { bgcolor: "#e53935" },
            }}
          >
            <CallEndIcon />
          </IconButton>
        </Box>
      </Box>
    </Dialog>
  );
};

export default VideoCallComponent;
