import { useState, useEffect } from "react";
import {
  Search as SearchIcon,
  Add as AddIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { Menu, MenuItem } from "@mui/material";

const initialContacts = [
  {
    id: 1,
    name: "Meenakshi Bhushan",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  {
    id: 2,
    name: "K2K Group",
    avatar: "https://i.pravatar.cc/150?img=2",
    isGroup: true,
  },
  { id: 3, name: "Akshita Pandey", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: 4, name: "Ravi Kumar", avatar: "https://i.pravatar.cc/150?img=4" },
  {
    id: 5,
    name: "Subh Kumar Singh",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  { id: 6, name: "Mukesh Tyagi", avatar: "https://i.pravatar.cc/150?img=6" },
  { id: 7, name: "Sneha Singhal", avatar: "https://i.pravatar.cc/150?img=7" },
  { id: 8, name: "Jay Tyagi", avatar: "https://i.pravatar.cc/150?img=8" },
  { id: 9, name: "Priya Raj", avatar: "https://i.pravatar.cc/150?img=9" },
  { id: 10, name: "Anupam Raj", avatar: "https://i.pravatar.cc/150?img=10" },
];

function Sidebar({ onSelectContact, activeContactId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState(initialContacts);
  const [archivedContacts, setArchivedContacts] = useState([]);
  const [showArchived, setShowArchived] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [selectedContactId, setSelectedContactId] = useState(null);

  useEffect(() => {
    const pinnedContacts = contacts.filter((contact) => contact.isPinned);
    const unpinnedContacts = contacts.filter((contact) => !contact.isPinned);
    setContacts([...pinnedContacts, ...unpinnedContacts]);
  }, [contacts]);

  const filteredContacts = (showArchived ? archivedContacts : contacts).filter(
    (contact) => contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleContextMenu = (event, contactId) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? { mouseX: event.clientX - 2, mouseY: event.clientY - 4 }
        : null
    );
    setSelectedContactId(contactId);
  };

  const handleContextMenuClose = () => {
    setContextMenu(null);
  };

  const toggleArchive = (contactId) => {
    const contactIndex = contacts.findIndex((c) => c.id === contactId);
    if (contactIndex !== -1) {
      const updatedContacts = [...contacts];
      const [archivedContact] = updatedContacts.splice(contactIndex, 1);
      setContacts(updatedContacts);
      setArchivedContacts([...archivedContacts, archivedContact]);
    } else {
      const archivedIndex = archivedContacts.findIndex(
        (c) => c.id === contactId
      );
      if (archivedIndex !== -1) {
        const updatedArchived = [...archivedContacts];
        const [unarchivedContact] = updatedArchived.splice(archivedIndex, 1);
        setArchivedContacts(updatedArchived);
        setContacts([...contacts, unarchivedContact]);
      }
    }
    handleContextMenuClose();
  };

  const togglePin = (contactId) => {
    const updatedContacts = contacts.map((contact) =>
      contact.id === contactId
        ? { ...contact, isPinned: !contact.isPinned }
        : contact
    );
    setContacts(updatedContacts);
    handleContextMenuClose();
  };

  return (
    <div className="w-80 bg-white border-r overflow-y-auto h-screen">
      <div className="p-4 sticky top-0 bg-white z-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Chats</h2>
          <div className="flex space-x-2">
            <button className="text-gray-500 hover:bg-blue-50 rounded-full p-1">
              <AddIcon fontSize="small" />
            </button>
            <button
              className="text-gray-500 hover:bg-gray-100 rounded-full p-1"
              onClick={handleFilterClick}
            >
              <FilterListIcon fontSize="small" />
            </button>
          </div>
        </div>
        <div className="relative">
          <input
            type="text"
            placeholder="Search contact / chat"
            className="w-full p-2 pl-8 bg-gray-100 rounded-full text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon
            className="absolute left-2 top-2.5 text-gray-400"
            fontSize="small"
          />
        </div>
      </div>
      <ul>
        {filteredContacts.map((contact) => (
          <li
            key={contact.id}
            className={`px-4 py-3 hover:bg-gray-100 cursor-pointer ${
              activeContactId === contact.id ? "bg-gray-100" : ""
            } ${contact.isPinned ? "border-l-4 border-blue-500" : ""}`}
            onClick={() => onSelectContact(contact)}
            onContextMenu={(e) => handleContextMenu(e, contact.id)}
          >
            <div className="flex items-center">
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-12 h-12 rounded-full mr-3"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">
                    {contact.name}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {contact.timestamp}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {contact.lastMessage}
                </p>
              </div>
              {contact.unread > 0 && (
                <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 ml-2">
                  {contact.unread}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem
          onClick={() => {
            setShowArchived(false);
            handleClose();
          }}
        >
          All Chats
        </MenuItem>
        <MenuItem
          onClick={() => {
            setShowArchived(true);
            handleClose();
          }}
        >
          Archived Chats
        </MenuItem>
      </Menu>
      <Menu
        open={contextMenu !== null}
        onClose={handleContextMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={
          contextMenu !== null
            ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
            : undefined
        }
      >
        <MenuItem onClick={() => togglePin(selectedContactId)}>
          {contacts.find((c) => c.id === selectedContactId)?.isPinned
            ? "Unpin"
            : "Pin"}
        </MenuItem>
        <MenuItem onClick={() => toggleArchive(selectedContactId)}>
          {contacts.find((c) => c.id === selectedContactId)
            ? "Archive"
            : "Unarchive"}
        </MenuItem>
      </Menu>
    </div>
  );
}

export default Sidebar;

// import { useState } from "react";
// import {
//   Search as SearchIcon,
//   Add as AddIcon,
//   FilterList as FilterListIcon,
// } from "@mui/icons-material";
// import { Avatar, IconButton, Menu, MenuItem, Dialog, Box } from "@mui/material";

// const contacts = [
//   {
//     id: 1,
//     name: "Meenakshi Bhushan",
//     avatar: "https://i.pravatar.cc/150?img=1",
//     lastMessage: "Had they visited Rome before?",
//     timestamp: "2 hrs",
//     unread: 0,
//   },
//   {
//     id: 2,
//     name: "K2K Group",
//     avatar: "https://i.pravatar.cc/150?img=2",
//     lastMessage: "Lorem ipsum is simply",
//     timestamp: "1 day",
//     unread: 0,
//   },
//   {
//     id: 3,
//     name: "Akshita Pandey",
//     avatar: "https://i.pravatar.cc/150?img=3",
//     lastMessage: "Hey, how's it going?",
//     timestamp: "2 days",
//     unread: 1,
//   },
//   {
//     id: 4,
//     name: "Ravi Kumar",
//     avatar: "https://i.pravatar.cc/150?img=4",
//     lastMessage: "Lorem ipsum is simply dummy...",
//     timestamp: "3 days",
//     unread: 0,
//   },
//   {
//     id: 5,
//     name: "Subh Kumar Singh",
//     avatar: "https://i.pravatar.cc/150?img=5",
//     lastMessage: "Lorem ipsum is simply ...",
//     timestamp: "4 days",
//     unread: 2,
//   },
//   {
//     id: 6,
//     name: "Mukesh Tyagi",
//     avatar: "https://i.pravatar.cc/150?img=6",
//     lastMessage: "Simply text",
//     timestamp: "1 week",
//     unread: 0,
//   },
//   {
//     id: 7,
//     name: "Sneha Singhal",
//     avatar: "https://i.pravatar.cc/150?img=7",
//     lastMessage: "This is the dummy text for...",
//     timestamp: "2 weeks",
//     unread: 0,
//   },
//   {
//     id: 8,
//     name: "Jay Tyagi",
//     avatar: "https://i.pravatar.cc/150?img=8",
//     lastMessage: "Lorem ipsum is simply dummy",
//     timestamp: "1 month",
//     unread: 0,
//   },
//   {
//     id: 9,
//     name: "Priya Raj",
//     avatar: "https://i.pravatar.cc/150?img=9",
//     lastMessage: "Lorem ipsum is ...",
//     timestamp: "3 months",
//     unread: 0,
//   },
//   {
//     id: 10,
//     name: "Anupam Raj",
//     avatar: "https://i.pravatar.cc/150?img=10",
//     lastMessage: "Lorem ipsum is simply...",
//     timestamp: "1 year",
//     unread: 0,
//   },
//   {
//     id: 11,
//     name: "Yash Vishwakarma",
//     avatar: "https://i.pravatar.cc/150?img=11",
//     lastMessage: "Lorem ipsum is simply text",
//     timestamp: "2 years",
//     unread: 0,
//   },
// ];

// function Sidebar({ onSelectContact, activeContactId }) {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [archiveContact, setArchiveContact] = useState([]);
//   const [favourite, setFavourite] = useState([]);

//   const filteredContacts = contacts.filter((contact) =>
//     contact.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const [anchorEl, setAnchorEl] = useState(null);

//   const handleFilterClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   return (
//     <div className="w-80 bg-white border-r overflow-y-auto h-screen">
//       <div className="p-4 sticky top-0 bg-white z-10">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-bold text-gray-800">Chats</h2>
//           <div className="flex space-x-2">
//             <button className="text-gray-500 hover:bg-blue-50 rounded-full p-1">
//               <AddIcon fontSize="small" />
//             </button>
//             <button
//               className="text-gray-500 hover:bg-gray-100 rounded-full p-1"
//               onClick={handleFilterClick}
//             >
//               <FilterListIcon fontSize="small" />
//             </button>
//             <Menu
//               anchorEl={anchorEl}
//               open={Boolean(anchorEl)}
//               onClose={handleClose}
//             >
//               <MenuItem onClick={handleClose}>All Chat</MenuItem>
//               <MenuItem onClick={handleClose}>Active Chat</MenuItem>
//               <MenuItem onClick={handleClose}>Archived Chat</MenuItem>
//               <MenuItem onClick={handleClose}>Spam Message</MenuItem>
//             </Menu>
//           </div>
//         </div>
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search contact / chat"
//             className="w-full p-2 pl-8 bg-gray-100 rounded-full text-sm"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />
//           <SearchIcon
//             className="absolute left-2 top-2.5 text-gray-400"
//             fontSize="small"
//           />
//         </div>
//       </div>
//       <ul>
//         {filteredContacts.map((contact) => (
//           <li
//             key={contact.id}
//             className={`px-4 py-3 hover:bg-gray-100 cursor-pointer ${
//               activeContactId === contact.id ? "bg-gray-100" : ""
//             }`}
//             onClick={() => onSelectContact(contact)}
//           >
//             <div className="flex items-center">
//               <img
//                 src={contact.avatar}
//                 alt={contact.name}
//                 className="w-12 h-12 rounded-full mr-3"
//               />
//               <div className="flex-1">
//                 <div className="flex justify-between items-center">
//                   <h3 className="font-semibold text-gray-800">
//                     {contact.name}
//                   </h3>
//                   <span className="text-xs text-gray-500">
//                     {contact.timestamp}
//                   </span>
//                 </div>
//                 <p className="text-sm text-gray-600 truncate">
//                   {contact.lastMessage}
//                 </p>
//               </div>
//               {contact.unread > 0 && (
//                 <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 ml-2">
//                   {contact.unread}
//                 </span>
//               )}
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default Sidebar;
