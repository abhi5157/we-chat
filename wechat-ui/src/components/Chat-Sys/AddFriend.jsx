import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

const AddFriend = ({ open, onClose, users, onAddFriend }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    const filtered = users.filter((user) =>
      user.firstName.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredContacts(filtered);
  };

  const handleAddFriend = (contact) => {
    onAddFriend(contact);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add Friend</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="search"
          label="Search contacts"
          type="text"
          fullWidth
          variant="outlined"
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: <SearchIcon color="action" />,
          }}
        />
        <List>
          {filteredContacts.map((contact) => (
            <ListItem
              key={contact._id}
              button
              onClick={() => handleAddFriend(contact)}
            >
              <ListItemAvatar>
                <Avatar src={contact.avatar} alt={contact.firstName} />
              </ListItemAvatar>
              <ListItemText primary={contact.firstName} />
              <Button variant="outlined" style={{ color: "#26A69A" }}>
                Add
              </Button>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} style={{ color: "#26A69A" }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFriend;
