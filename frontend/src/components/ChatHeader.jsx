import { X, Video, Phone, Search, MoreVertical } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import toast from "react-hot-toast";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers } = useAuthStore();

  const handleComingSoon = () => {
    toast("Feature coming soon! 🚀", {
      icon: '🚧',
    });
  };

  return (
    <div className="px-4 py-3 border-b border-base-300 bg-base-100/50 backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative border border-base-300">
              <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} className="object-cover" />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-bold text-base leading-tight">{selectedUser.fullName}</h3>
            <p className="text-xs text-primary font-medium">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </p>
          </div>
        </div>

        {/* WhatsApp Style Icons */}
        <div className="flex items-center gap-4 text-base-content/60">
          <button onClick={handleComingSoon} className="hover:text-primary transition-colors p-2 rounded-full hover:bg-base-200">
            <Video className="size-5" />
          </button>
          <button onClick={handleComingSoon} className="hover:text-primary transition-colors p-2 rounded-full hover:bg-base-200">
            <Phone className="size-5" />
          </button>
          <div className="h-6 w-[1px] bg-base-300 mx-1" />
          <button onClick={handleComingSoon} className="hover:text-primary transition-colors p-2 rounded-full hover:bg-base-200">
            <Search className="size-5" />
          </button>
          <button onClick={handleComingSoon} className="hover:text-primary transition-colors p-2 rounded-full hover:bg-base-200">
            <MoreVertical className="size-5" />
          </button>
          <button onClick={() => setSelectedUser(null)} className="hover:text-error transition-colors p-2 rounded-full hover:bg-base-200 ml-2">
            <X className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;