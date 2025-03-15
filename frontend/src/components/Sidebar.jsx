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









import { useEffect, useState, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, GripHorizontal } from "lucide-react";

const Sidebar = () => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(280); // Default width
  const sidebarRef = useRef(null);
  const isDraggingRef = useRef(false);
  const touchStartXRef = useRef(0);
  const initialWidthRef = useRef(0);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  // Make sure onlineUsers is an array before filtering
  const safeOnlineUsers = onlineUsers || [];

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => safeOnlineUsers.includes(user._id))
    : users;

  // Handle mouse events for resizing
  const handleMouseDown = (e) => {
    e.preventDefault();
    isDraggingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const newWidth = e.clientX;
    // Set min and max values
    if (newWidth >= 80 && newWidth <= 500) {
      setSidebarWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // Handle touch events without using preventDefault
  const handleTouchStart = (e) => {
    isDraggingRef.current = true;
    touchStartXRef.current = e.touches[0].clientX;
    initialWidthRef.current = sidebarWidth;
  };

  const handleTouchMove = (e) => {
    if (!isDraggingRef.current) return;
    
    const touchDelta = e.touches[0].clientX - touchStartXRef.current;
    const newWidth = initialWidthRef.current + touchDelta;
    
    // Set min and max values
    if (newWidth >= 80 && newWidth <= 500) {
      setSidebarWidth(newWidth);
    }
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // Determine if we should show text based on sidebar width
  const showText = sidebarWidth > 150;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <div 
      ref={sidebarRef}
      className="flex flex-col h-full relative border-r border-base-300"
      style={{ width: `${sidebarWidth}px` }}
    >
      {/* Resizer handle */}
      <div 
        className="absolute right-0 top-0 bottom-0 w-8 cursor-ew-resize flex items-center justify-center hover:bg-base-300 z-10"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <GripHorizontal className="w-4 h-4 text-gray-500" />
      </div>

      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          {showText && <span className="font-medium">Contacts</span>}
        </div>
        
        {/* Online filter toggle - visible based on width */}
        <div className="mt-3 flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            {showText && <span className="text-sm">Show online only</span>}
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1})</span>
        </div>
      </div>
      
      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => setSelectedUser(user)}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >
            <div className={`relative ${!showText ? "mx-auto" : ""}`}>
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {safeOnlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>
            
            {/* User info - only visible when sidebar is wide enough */}
            {showText && (
              <div className="text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {safeOnlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            )}
          </button>
        ))}
        
        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">
            {showText ? "No online users" : "None"}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;