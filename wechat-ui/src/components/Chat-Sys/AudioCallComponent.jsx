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
} from "./Icons";

const AudioCallComponent = ({ open, onClose, contact }) => {
  const [isMuted, setIsMuted] = useState(false);

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleEndCall = () => {
    onClose();
  };

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
          alignItems: "center",
          justifyContent: "space-between",
          padding: 3,
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
            alt={contact?.name}
            sx={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              marginBottom: 2,
            }}
          />
          <Typography variant="h6" sx={{ color: "#26A69A" }}>
            {contact?.name}
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B" }}>
            Ringing...
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2 }}>
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
          <IconButton>
            <AddMemberIcon />
          </IconButton>
        </Box>
      </Box>
    </Dialog>
  );
};

export default AudioCallComponent;
