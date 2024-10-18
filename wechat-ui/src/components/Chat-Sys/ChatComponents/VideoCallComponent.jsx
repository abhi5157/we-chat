import { useState } from "react";
import PropTypes from "prop-types";
import { IconButton, Typography, Box, Dialog } from "@mui/material";
import {
  Close as CloseIcon,
  Mic as MicIcon,
  MicOff as MicOffIcon,
  CallEnd as CallEndIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
} from "@mui/icons-material";
import { AddMemberIcon, OptionsIcon2 } from "../Icons";

const VideoCallComponent = ({ open, onClose, contact }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleVideoToggle = () => {
    setIsVideoOff(!isVideoOff);
  };

  const handleEndCall = () => {
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={isFullScreen}
      PaperProps={{
        sx: {
          width: isFullScreen ? "100%" : "100%",
          maxWidth: isFullScreen ? "none" : 600,
          height: isFullScreen ? "100%" : "auto",
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
            height: isFullScreen ? "calc(100% - 80px)" : 400,
            width: "100%",
            backgroundColor: "#000000",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Placeholder for video stream */}
          <Box
            component="img"
            src={contact?.avatar}
            alt={contact?.name}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 16,
              right: 16,
              display: "flex",
              gap: 1,
            }}
          >
            <IconButton onClick={toggleFullScreen} sx={{ color: "white" }}>
              {isFullScreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
            <IconButton onClick={onClose} sx={{ color: "white" }}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              position: "absolute",
              bottom: 16,
              left: 16,
              color: "white",
            }}
          >
            <Typography variant="h6">{contact?.name}</Typography>
            <Typography variant="body2">00:00:00</Typography>
          </Box>
        </Box>
        <Box sx={{ display: "flex", gap: 2, my: 2 }}>
          <IconButton
            onClick={handleMuteToggle}
            sx={{
              backgroundColor: isMuted ? "#ef5350" : "#26A69A",
              color: "white",
              "&:hover": { backgroundColor: isMuted ? "#e53935" : "#2c8f86" },
            }}
          >
            {isMuted ? <MicOffIcon /> : <MicIcon />}
          </IconButton>
          <IconButton
            onClick={handleVideoToggle}
            sx={{
              backgroundColor: isVideoOff ? "#ef5350" : "#26A69A",
              color: "white",
              "&:hover": {
                backgroundColor: isVideoOff ? "#e53935" : "#2c8f86",
              },
            }}
          >
            {isVideoOff ? <VideocamOffIcon /> : <VideocamIcon />}
          </IconButton>
          <IconButton
            sx={{
              backgroundColor: "#26A69A",
              color: "white",
              "&:hover": { backgroundColor: "#2c8f86" },
            }}
          >
            <AddMemberIcon />
          </IconButton>
          <IconButton
            sx={{
              backgroundColor: "#26A69A",
              color: "white",
              "&:hover": { backgroundColor: "#2c8f86" },
            }}
          >
            <OptionsIcon2 />
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
        </Box>
      </Box>
    </Dialog>
  );
};

VideoCallComponent.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  contact: PropTypes.shape({
    avatar: PropTypes.string,
    name: PropTypes.string,
  }),
};

VideoCallComponent.defaultProps = {
  contact: {},
};

export default VideoCallComponent;
