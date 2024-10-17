import { useState } from "react";
import { Avatar, IconButton, Menu, MenuItem, Dialog, Box } from "@mui/material";
import EditProfile from "./EditProfile";
import profile from "../../assets/profile.png";
import { ChatIcon, ContactsIcon } from "./Icons";
import { SearchIcon, AddIcon, NotificationIcon } from "./Icons";

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
        <Box className="flex items-center space-x-5">
          <h1 className="text-2xl font-bold text-gray-800 mr-4">WECHAT</h1>{" "}
          {/* Added margin here */}
          <div className="flex space-x-1">
            <IconButton
              className={
                activeTab === "chats" ? activeIconButtonClass : iconButtonClass
              }
              onClick={() => setActiveTab("chats")}
            >
              {/* <ChatIcon /> */}
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="48" height="48" rx="24" fill="#E0F2F1" />
                <path
                  d="M34 24C34 28.8325 29.5225 32.75 24 32.75C23.0095 32.7522 22.0231 32.6236 21.0662 32.3675C20.3362 32.7375 18.66 33.4475 15.84 33.91C15.59 33.95 15.4 33.69 15.4987 33.4575C15.9412 32.4125 16.3412 31.02 16.4613 29.75C14.93 28.2125 14 26.2 14 24C14 19.1675 18.4775 15.25 24 15.25C29.5225 15.25 34 19.1675 34 24ZM19.625 20.25C19.4592 20.25 19.3003 20.3158 19.1831 20.4331C19.0658 20.5503 19 20.7092 19 20.875C19 21.0408 19.0658 21.1997 19.1831 21.3169C19.3003 21.4342 19.4592 21.5 19.625 21.5H28.375C28.5408 21.5 28.6997 21.4342 28.8169 21.3169C28.9342 21.1997 29 21.0408 29 20.875C29 20.7092 28.9342 20.5503 28.8169 20.4331C28.6997 20.3158 28.5408 20.25 28.375 20.25H19.625ZM19.625 23.375C19.4592 23.375 19.3003 23.4408 19.1831 23.5581C19.0658 23.6753 19 23.8342 19 24C19 24.1658 19.0658 24.3247 19.1831 24.4419C19.3003 24.5592 19.4592 24.625 19.625 24.625H28.375C28.5408 24.625 28.6997 24.5592 28.8169 24.4419C28.9342 24.3247 29 24.1658 29 24C29 23.8342 28.9342 23.6753 28.8169 23.5581C28.6997 23.4408 28.5408 23.375 28.375 23.375H19.625ZM19.625 26.5C19.4592 26.5 19.3003 26.5658 19.1831 26.6831C19.0658 26.8003 19 26.9592 19 27.125C19 27.2908 19.0658 27.4497 19.1831 27.5669C19.3003 27.6842 19.4592 27.75 19.625 27.75H24.625C24.7908 27.75 24.9497 27.6842 25.0669 27.5669C25.1842 27.4497 25.25 27.2908 25.25 27.125C25.25 26.9592 25.1842 26.8003 25.0669 26.6831C24.9497 26.5658 24.7908 26.5 24.625 26.5H19.625Z"
                  fill="#64748B"
                />
              </svg>
            </IconButton>
            <IconButton
              className={
                activeTab === "contacts"
                  ? activeIconButtonClass
                  : iconButtonClass
              }
              onClick={() => setActiveTab("contacts")}
            >
              {/* <ContactsIcon /> */}
              <svg
                width="48"
                height="48"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="48" height="48" rx="24" fill="#E0F2F1" />
                <path
                  d="M21.5 24C22.4946 24 23.4484 23.6049 24.1517 22.9017C24.8549 22.1984 25.25 21.2446 25.25 20.25C25.25 19.2554 24.8549 18.3016 24.1517 17.5983C23.4484 16.8951 22.4946 16.5 21.5 16.5C20.5054 16.5 19.5516 16.8951 18.8483 17.5983C18.1451 18.3016 17.75 19.2554 17.75 20.25C17.75 21.2446 18.1451 22.1984 18.8483 22.9017C19.5516 23.6049 20.5054 24 21.5 24ZM15.25 31.5C15.25 31.5 14 31.5 14 30.25C14 29 15.25 25.25 21.5 25.25C27.75 25.25 29 29 29 30.25C29 31.5 27.75 31.5 27.75 31.5H15.25ZM27.75 18.375C27.75 18.2092 27.8158 18.0503 27.9331 17.9331C28.0503 17.8158 28.2092 17.75 28.375 17.75H33.375C33.5408 17.75 33.6997 17.8158 33.8169 17.9331C33.9342 18.0503 34 18.2092 34 18.375C34 18.5408 33.9342 18.6997 33.8169 18.8169C33.6997 18.9342 33.5408 19 33.375 19H28.375C28.2092 19 28.0503 18.9342 27.9331 18.8169C27.8158 18.6997 27.75 18.5408 27.75 18.375ZM28.375 21.5C28.2092 21.5 28.0503 21.5658 27.9331 21.6831C27.8158 21.8003 27.75 21.9592 27.75 22.125C27.75 22.2908 27.8158 22.4497 27.9331 22.5669C28.0503 22.6842 28.2092 22.75 28.375 22.75H33.375C33.5408 22.75 33.6997 22.6842 33.8169 22.5669C33.9342 22.4497 34 22.2908 34 22.125C34 21.9592 33.9342 21.8003 33.8169 21.6831C33.6997 21.5658 33.5408 21.5 33.375 21.5H28.375ZM30.875 25.25C30.7092 25.25 30.5503 25.3158 30.4331 25.4331C30.3158 25.5503 30.25 25.7092 30.25 25.875C30.25 26.0408 30.3158 26.1997 30.4331 26.3169C30.5503 26.4342 30.7092 26.5 30.875 26.5H33.375C33.5408 26.5 33.6997 26.4342 33.8169 26.3169C33.9342 26.1997 34 26.0408 34 25.875C34 25.7092 33.9342 25.5503 33.8169 25.4331C33.6997 25.3158 33.5408 25.25 33.375 25.25H30.875ZM30.875 29C30.7092 29 30.5503 29.0658 30.4331 29.1831C30.3158 29.3003 30.25 29.4592 30.25 29.625C30.25 29.7908 30.3158 29.9497 30.4331 30.0669C30.5503 30.1842 30.7092 30.25 30.875 30.25H33.375C33.5408 30.25 33.6997 30.1842 33.8169 30.0669C33.9342 29.9497 34 29.7908 34 29.625C34 29.4592 33.9342 29.3003 33.8169 29.1831C33.6997 29.0658 33.5408 29 33.375 29H30.875Z"
                  fill="#334155"
                />
              </svg>
            </IconButton>
          </div>
        </Box>

        <div className="flex items-center space-x-4">
          {/* <IconButton
            className={iconButtonClass}
            onClick={() => setActiveTab("search")}
          >
            <SearchIcon />
          </IconButton>
          <IconButton className={iconButtonClass}>
            <AddIcon />
          </IconButton> */}
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
