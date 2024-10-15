import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import ChatArea from "./ChatArea";
import UpdateNotification from "./UpdateNotification";

function ChatApp() {
  const [showNotification, setShowNotification] = useState(true);
  const [activeContact, setActiveContact] = useState(null);

  const handleSelectContact = (contact) => {
    setActiveContact(contact);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          onSelectContact={handleSelectContact}
          activeContactId={activeContact?.id}
        />
        <ChatArea activeContact={activeContact} />
      </div>
      {showNotification && (
        <UpdateNotification onDismiss={() => setShowNotification(false)} />
      )}
    </div>
  );
}

export default ChatApp;
