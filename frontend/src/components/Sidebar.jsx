// import { useEffect, useState } from "react";
// import { useChatStore } from "../store/useChatStore";
// import { useAuthStore } from "../store/useAuthStore";
// import SidebarSkeleton from "./skeletons/SidebarSkeleton";
// import { Users } from "lucide-react";

// const Sidebar = () => {
//   const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  
//   const { onlineUsers } = useAuthStore();
//   const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  
//   useEffect(() => {
//     getUsers();
//   }, [getUsers]);
  
//   // Make sure onlineUsers is an array before filtering
//   const safeOnlineUsers = onlineUsers || [];
  
//   const filteredUsers = showOnlineOnly
//     ? users.filter((user) => safeOnlineUsers.includes(user._id))
//     : users;
  
//   if (isUsersLoading) return <SidebarSkeleton />;
  
//   return (
//     <aside className="h-full w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
//       <div className="border-b border-base-300 w-full p-5">
//         <div className="flex items-center gap-2">
//           <Users className="size-6" />
//           <span className="font-medium hidden lg:block">Contacts</span>
//         </div>
//         {/* TODO: Online filter toggle */}
//         <div className="mt-3 hidden lg:flex items-center gap-2">
//           <label className="cursor-pointer flex items-center gap-2">
//             <input
//               type="checkbox"
//               checked={showOnlineOnly}
//               onChange={(e) => setShowOnlineOnly(e.target.checked)}
//               className="checkbox checkbox-sm"
//             />
//             <span className="text-sm">Show online only</span>
//           </label>
//           <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
//         </div>
//       </div>
      
//       <div className="overflow-y-auto w-full py-3">
//         {filteredUsers.map((user) => (
//           <button
//             key={user._id}
//             onClick={() => setSelectedUser(user)}
//             className={`
//               w-full p-3 flex items-center gap-3
//               hover:bg-base-300 transition-colors
//               ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
//             `}
//           >
//             <div className="relative mx-auto lg:mx-0">
//               <img
//                 src={user.profilePic || "/avatar.png"}
//                 alt={user.name}
//                 className="size-12 object-cover rounded-full"
//               />
//               {safeOnlineUsers.includes(user._id) && (
//                 <span
//                   className="absolute bottom-0 right-0 size-3 bg-green-500 
//                   rounded-full ring-2 ring-zinc-900"
//                 />
//               )}
//             </div>
            
//             {/* User info - only visible on larger screens */}
//             <div className="hidden lg:block text-left min-w-0">
//               <div className="font-medium truncate">{user.fullName}</div>
//               <div className="text-sm text-zinc-400">
//                 {safeOnlineUsers.includes(user._id) ? "Online" : "Offline"}
//               </div>
//             </div>
//           </button>
//         ))}
        
//         {filteredUsers.length === 0 && (
//           <div className="text-center text-zinc-500 py-4">No online users</div>
//         )}
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;









import { useEffect, useState, useRef, useMemo } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, GripHorizontal, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarWidth, setSidebarWidth] = useState(320); // Slightly wider default
  const sidebarRef = useRef(null);
  const isDraggingRef = useRef(false);
  const touchStartXRef = useRef(0);
  const initialWidthRef = useRef(0);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const safeOnlineUsers = useMemo(() => onlineUsers || [], [onlineUsers]);

  const filteredUsers = useMemo(() => {
    let filtered = users;
    
    if (showOnlineOnly) {
      filtered = filtered.filter((user) => safeOnlineUsers.includes(user._id));
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) => 
          user.fullName.toLowerCase().includes(query) || 
          (user.email && user.email.toLowerCase().includes(query))
      );
    }
    
    return filtered;
  }, [users, showOnlineOnly, safeOnlineUsers, searchQuery]);

  const handleMouseDown = (e) => {
    e.preventDefault();
    isDraggingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "ew-resize";
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const newWidth = e.clientX;
    if (newWidth >= 80 && newWidth <= 450) {
      setSidebarWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "default";
  };

  const showText = sidebarWidth > 180;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside 
      ref={sidebarRef}
      className="flex flex-col h-full relative border-r border-base-300 bg-base-100/50 backdrop-blur-sm transition-colors"
      style={{ width: `${sidebarWidth}px` }}
    >
      {/* Resizer handle */}
      <div 
        className="absolute -right-1 top-0 bottom-0 w-2 cursor-ew-resize group z-20 flex items-center justify-center"
        onMouseDown={handleMouseDown}
      >
        <div className="h-12 w-1 rounded-full bg-base-300 group-hover:bg-primary transition-colors opacity-0 group-hover:opacity-100" />
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="size-5 text-primary" />
            </div>
            {showText && <span className="font-semibold text-lg tracking-tight">Messages</span>}
          </div>
          {showText && (
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-base-200 text-base-content/70">
              {onlineUsers.length - 1} Online
            </span>
          )}
        </div>
        
        {showText && (
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/40 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search or start a new chat"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input input-bordered input-sm w-full pl-10 bg-base-200 border-none focus:bg-base-200 focus:ring-1 focus:ring-primary/30 transition-all rounded-xl h-9"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-base-300 transition-colors"
                >
                  <X className="size-3" />
                </button>
              )}
            </div>

            {/* Filter Chips */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {["All", "Unread", "Favorites", "Groups"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => filter !== "All" && toast("Feature coming soon! 🚀")}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all",
                    filter === "All" 
                      ? "bg-primary/20 text-primary" 
                      : "bg-base-200 text-base-content/60 hover:bg-base-300"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Online filter toggle */}
            <label className="flex items-center gap-2 cursor-pointer group px-1">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-primary checkbox-xs rounded"
              />
              <span className="text-xs font-medium text-base-content/60 group-hover:text-base-content transition-colors">
                Show online only
              </span>
            </label>
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto px-2 pb-4 custom-scrollbar">
        <div className="space-y-1">
          <AnimatePresence mode="popLayout">
            {filteredUsers.map((user) => (
              <motion.button
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={cn(
                  "w-full p-3 flex items-center gap-3 rounded-xl transition-all duration-200",
                  "hover:bg-base-200 active:scale-[0.98]",
                  selectedUser?._id === user._id ? "bg-primary/10 text-primary shadow-sm" : "text-base-content/80"
                )}
              >
                <div className="relative flex-shrink-0">
                  <div className={cn(
                    "rounded-full p-0.5 ring-2 transition-all duration-300",
                    selectedUser?._id === user._id ? "ring-primary" : "ring-transparent"
                  )}>
                    <img
                      src={user.profilePic || "/avatar.png"}
                      alt={user.fullName}
                      className="size-12 object-cover rounded-full bg-base-300"
                    />
                  </div>
                  {safeOnlineUsers.includes(user._id) && (
                    <span
                      className="absolute bottom-0 right-0 size-3.5 bg-green-500 
                      rounded-full ring-2 ring-base-100 shadow-sm"
                      aria-label="Online"
                    />
                  )}
                </div>
                
                {showText && (
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-semibold truncate text-sm">{user.fullName}</div>
                    <div className={cn(
                      "text-xs truncate transition-colors",
                      safeOnlineUsers.includes(user._id) ? "text-green-500 font-medium" : "text-base-content/40"
                    )}>
                      {safeOnlineUsers.includes(user._id) ? "Online" : "Offline"}
                    </div>
                  </div>
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center opacity-40">
            <Search className="size-8 mb-2" />
            <p className="text-sm font-medium">No contacts found</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;