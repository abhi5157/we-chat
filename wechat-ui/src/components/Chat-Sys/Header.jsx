import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, IconButton, Menu, MenuItem, Dialog, Box } from "@mui/material";
import EditProfile from "./EditProfile";
import profile from "../../assets/profile.png";
import { ChatIcon, ContactsIcon, NotificationIcon } from "./Icons";

const Header = ({
  onEditProfile,
  onToggleSidebar,
  activeSidebar,
  onLogout,
}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openEditProfile, setOpenEditProfile] = useState(false);
  const navigate = useNavigate();

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEditProfile = () => {
    handleClose();
    onEditProfile();
  };

  const handleLogout = () => {
    handleClose();
    localStorage.removeItem("token"); // Clear the token from localStorage
    onLogout(); // Call the onLogout function passed from the parent
    navigate("/login"); // Redirect to the login page
  };

  const iconButtonClass =
    "p-2 rounded-full transition-colors bg-white text-gray-600 hover:bg-gray-200";
  const activeIconButtonClass =
    "p-2 rounded-full transition-colors bg-[#E0F2F1] text-gray-800";

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Box className="flex items-center space-x-5">
          <h1 className="text-2xl font-bold text-gray-800 mr-4">WECHAT</h1>
          <div className="flex space-x-1">
            <IconButton
              className={
                activeSidebar === "chat"
                  ? activeIconButtonClass
                  : iconButtonClass
              }
              onClick={() => onToggleSidebar("chat")}
            >
              <ChatIcon />
            </IconButton>
            <IconButton
              className={
                activeSidebar === "contacts"
                  ? activeIconButtonClass
                  : iconButtonClass
              }
              onClick={() => onToggleSidebar("contacts")}
            >
              <ContactsIcon />
            </IconButton>
          </div>
        </Box>

        <div className="flex items-center space-x-4">
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
        <MenuItem onClick={handleLogout}>Log Out</MenuItem>
      </Menu>
      <Dialog open={openEditProfile} onClose={() => setOpenEditProfile(false)}>
        <EditProfile onClose={() => setOpenEditProfile(false)} />
      </Dialog>
    </header>
  );
};

export default Header;
// import React from "react";
// import { Avatar, IconButton } from "@mui/material";
// import {
//   ChatIcon,
//   ContactsIcon,
//   SearchIcon,
//   AddIcon,
//   NotificationIcon,
// } from "./Icons";

// const Header = ({ onEditProfile, onToggleSidebar, activeSidebar }) => {
//   const iconButtonClass =
//     "p-2 rounded-full transition-colors bg-white text-gray-600 hover:bg-gray-200";
//   const activeIconButtonClass =
//     "p-2 rounded-full transition-colors bg-[#E0F2F1] text-gray-800";

//   return (
//     <header className="bg-white shadow-md">
//       <div className="container mx-auto px-4 py-2 flex items-center justify-between">
//         <h1 className="text-2xl font-bold text-gray-800">WECHAT</h1>
//         <div className="flex items-center space-x-4">
//           <IconButton
//             className={
//               activeSidebar === "chat" ? activeIconButtonClass : iconButtonClass
//             }
//             onClick={() => onToggleSidebar("chat")}
//           >
//             <ChatIcon />
//           </IconButton>
//           <IconButton
//             className={
//               activeSidebar === "contacts"
//                 ? activeIconButtonClass
//                 : iconButtonClass
//             }
//             onClick={() => onToggleSidebar("contacts")}
//           >
//             <ContactsIcon />
//           </IconButton>

//           <IconButton className={iconButtonClass}>
//             <NotificationIcon />
//           </IconButton>
//           <IconButton onClick={onEditProfile}>
//             <Avatar src="/api/placeholder/32/32" alt="Profile" />
//           </IconButton>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;
