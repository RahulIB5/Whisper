import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";

import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto bg-base-100/50">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-auto bg-base-100/50 backdrop-blur-sm">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {messages.map((message) => {
            const isSentByMe = message.senderId === authUser._id;
            return (
              <motion.div
                key={message._id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                layout
                className={cn(
                  "chat",
                  isSentByMe ? "chat-end" : "chat-start"
                )}
                ref={messageEndRef}
              >
                <div className="chat-image avatar">
                  <div className="size-10 rounded-full border-2 border-base-100 shadow-sm overflow-hidden">
                    <img
                      src={
                        isSentByMe
                          ? authUser.profilePic || "/avatar.png"
                          : selectedUser.profilePic || "/avatar.png"
                      }
                      alt="profile pic"
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                
                <div className="chat-header mb-1.5 flex items-center gap-2 opacity-60">
                  <span className="text-[10px] font-medium">
                    {formatMessageTime(message.createdAt)}
                  </span>
                </div>

                <div className={cn(
                  "chat-bubble shadow-sm max-w-[85%] sm:max-w-[70%] flex flex-col gap-2 p-3",
                  isSentByMe 
                    ? "bg-primary text-primary-content rounded-2xl rounded-tr-none" 
                    : "bg-base-200 text-base-content rounded-2xl rounded-tl-none"
                )}>
                  {message.image && (
                    <div className="relative group">
                      <img
                        src={message.image}
                        alt="Attachment"
                        className="rounded-lg object-cover max-h-60 w-full hover:opacity-95 transition-opacity cursor-zoom-in"
                      />
                    </div>
                  )}
                  {message.text && (
                    <p className="text-sm leading-relaxed break-words">
                      {message.text}
                    </p>
                  )}
                </div>
                
                {isSentByMe && (
                  <div className="chat-footer opacity-40 mt-1">
                    <span className="text-[10px]">Delivered</span>
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;