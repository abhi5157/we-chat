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

function MediaComp() {
  return (
    <>
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
    </>
  );
}

export default MediaComp;
