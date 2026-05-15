import { useChatStore } from "../store/useChatStore";
import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import LeftNav from "../components/LeftNav";
import { motion } from "framer-motion";

const HomePage = () => {
  const { selectedUser } = useChatStore();

  return (
    <div className="h-screen flex bg-base-100 overflow-hidden">
      {/* Left Navigation Bar (WhatsApp Style) */}
      <LeftNav />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Contacts Sidebar */}
        <Sidebar />

        {/* Chat Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-base-200/50">
          {!selectedUser ? <NoChatSelected /> : <ChatContainer />}
        </main>
      </div>
    </div>
  );
};

export default HomePage;