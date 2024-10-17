import { useState } from "react";
import {
  Drawer,
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Close as CloseIcon,
  Phone as PhoneIcon,
  Mail as MailIcon,
  Info as InfoIcon,
  AttachFile as AttachFileIcon,
} from "@mui/icons-material";
import { OptionsIcon, PhotoIcon } from "./Icons";
import MuteModal from "./MuteModal";

const ProfileSidebar = ({ open, onClose, contact }) => {
  const [documents] = useState([
    { name: "Resume.pdf", size: "2.3 MB" },
    { name: "Project_Proposal.docx", size: "1.5 MB" },
    { name: "Meeting_Notes.txt", size: "0.5 MB" },
    { name: "Presentation.pptx", size: "4.2 MB" },
    { name: "Budget.xlsx", size: "1.8 MB" },
    { name: "Report.pdf", size: "3.1 MB" },
  ]);

  const [muteModalOpen, setMuteModalOpen] = useState(false);

  const handleMuteClick = () => {
    setMuteModalOpen(true);
  };

  const handleMuteClose = () => {
    setMuteModalOpen(false);
  };

  const handleMute = (duration) => {
    console.log(`Muted for ${duration} minutes`);
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={onClose}
        PaperProps={{
          sx: { width: "300px", bgcolor: "white" },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Avatar
              src={contact?.avatar || "/api/placeholder/100/100"}
              alt={contact?.name || "Contact"}
              sx={{ width: 100, height: 100, mb: 2 }}
            />
            <Typography variant="h6">
              {contact?.name || "Konstantin Frank"}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-around", mb: 2 }}>
            <Box sx={{ textAlign: "center" }}>
              <IconButton
                sx={{ bgcolor: "#E0F2F1", color: "#26A69A" }}
                onClick={handleMuteClick}
              >
                <InfoIcon />
              </IconButton>
              <Typography variant="body2">Mute</Typography>
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <IconButton sx={{ bgcolor: "#E0F2F1", color: "#26A69A" }}>
                <PhotoIcon />
              </IconButton>
              <Typography variant="body2">Media</Typography>
            </Box>

            <Box sx={{ textAlign: "center" }}>
              <IconButton sx={{ bgcolor: "#E0F2F1", color: "#26A69A" }}>
                {/* <InfoIcon /> */}
                <OptionsIcon />
              </IconButton>
              <Typography variant="body2">Options</Typography>
            </Box>
          </Box>
          <Divider />
          <List>
            <ListItem>
              <ListItemIcon>
                <PhoneIcon />
              </ListItemIcon>
              <ListItemText
                primary="Phone Number"
                secondary={contact?.phone || "+1 (555) 123-4567"}
              />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <MailIcon />
              </ListItemIcon>
              <ListItemText
                primary="Email"
                secondary={contact?.email || "konstantin@example.com"}
              />
            </ListItem>
          </List>
          <Divider />
          <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
            Documents
          </Typography>
          <List>
            {documents.map((doc, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <AttachFileIcon />
                </ListItemIcon>
                <ListItemText primary={doc.name} secondary={doc.size} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <MuteModal
        open={muteModalOpen}
        onClose={handleMuteClose}
        onMute={handleMute}
      />
    </>
  );
};

export default ProfileSidebar;
