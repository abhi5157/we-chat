import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ContactsSidebar from "./ContactSideBar";
import ChatArea from "./ChatArea";
import UpdateNotification from "./UpdateNotification";
import EditProfile from "./EditProfile";
import Login from "../Login/Login/Login";

function ChatApp() {
  const [showNotification, setShowNotification] = useState(true);
  const [activeContact, setActiveContact] = useState(null);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [activeSidebar, setActiveSidebar] = useState("chat");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      navigate("/login");
    }
  }, [navigate]);

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

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="flex flex-col h-screen bg-#E0F2F1">
      <Header
        onEditProfile={handleEditProfile}
        onToggleSidebar={toggleSidebar}
        activeSidebar={activeSidebar}
        onLogout={handleLogout}
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
