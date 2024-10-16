import { useState } from "react";
import { Avatar, IconButton, Menu, MenuItem, Dialog } from "@mui/material";
import EditProfile from "./EditProfile";
import profile from "../../assets/profile.png";
import {
  ChatIcon,
  ContactsIcon,
  SearchIcon,
  AddIcon,
  NotificationIcon,
} from "./Icons";

const Header = () => {
  const [activeTab, setActiveTab] = useState("chats");
  const [anchorEl, setAnchorEl] = useState(null);
  const [openEditProfile, setOpenEditProfile] = useState(false);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditProfile = () => {
    handleClose();
    setOpenEditProfile(true);
  };

  const iconButtonClass =
    "p-2 rounded-full transition-colors bg-white text-gray-600 hover:bg-gray-200";
  const activeIconButtonClass =
    "p-2 rounded-full transition-colors bg-[#E0F2F1] text-gray-800";

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">WECHAT</h1>
        <div className="flex items-center space-x-4">
          <IconButton
            className={
              activeTab === "chats" ? activeIconButtonClass : iconButtonClass
            }
            onClick={() => setActiveTab("chats")}
          >
            <ChatIcon />
          </IconButton>
          <IconButton
            className={
              activeTab === "contacts" ? activeIconButtonClass : iconButtonClass
            }
            onClick={() => setActiveTab("contacts")}
          >
            <ContactsIcon />
          </IconButton>
          <IconButton
            className={iconButtonClass}
            onClick={() => setActiveTab("search")}
          >
            <SearchIcon />
          </IconButton>
          <IconButton className={iconButtonClass}>
            <AddIcon />
          </IconButton>
          <IconButton className={iconButtonClass}>
            <NotificationIcon />
          </IconButton>
          <IconButton onClick={handleProfileClick}>
            <Avatar src={profile} alt="Profile" />
          </IconButton>
        </div>
      </div>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleEditProfile}>Edit Profile</MenuItem>
        <MenuItem onClick={handleClose}>Settings</MenuItem>
        <MenuItem onClick={handleClose}>Change Password</MenuItem>
        <MenuItem onClick={handleClose}>Log Out</MenuItem>
      </Menu>

      <Dialog open={openEditProfile} onClose={() => setOpenEditProfile(false)}>
        <EditProfile onClose={() => setOpenEditProfile(false)} />
      </Dialog>
    </header>
  );
};

export default Header;
