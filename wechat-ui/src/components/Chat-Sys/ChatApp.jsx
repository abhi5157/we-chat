import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ContactsSidebar from "./ContactSideBar";
import ChatArea from "./ChatArea";
import UpdateNotification from "./UpdateNotification";
import EditProfile from "./EditProfile";

function ChatApp() {
  const [showNotification, setShowNotification] = useState(true);
  const [activeContact, setActiveContact] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState("chat"); // "chat" or "contacts"

  const handleSelectContact = (contact) => {
    setActiveContact(contact);
  };

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleCloseEditProfile = () => {
    setShowEditProfile(false);
  };

  const toggleSidebar = (sidebarType) => {
    setActiveSidebar(sidebarType);
  };

  return (
    <div className="flex flex-col h-screen bg-#E0F2F1">
      <Header
        onEditProfile={handleEditProfile}
        onToggleSidebar={toggleSidebar}
        activeSidebar={activeSidebar}
      />
      <div className="flex flex-1 overflow-hidden">
        {showEditProfile ? (
          <EditProfile onClose={handleCloseEditProfile} />
        ) : (
          <>
            {activeSidebar === "chat" ? (
              <Sidebar
                onSelectContact={handleSelectContact}
                activeContactId={activeContact?.id}
              />
            ) : (
              <ContactsSidebar
                onSelectContact={handleSelectContact}
                activeContactId={activeContact?.id}
              />
            )}
            <ChatArea activeContact={activeContact} />
          </>
        )}
      </div>
      {showNotification && (
        <UpdateNotification onDismiss={() => setShowNotification(false)} />
      )}
    </div>
  );
}

export default ChatApp;
