import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Plus } from "lucide-react";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large. Please select an image smaller than 5MB.");
      return;
    }
  
    try {
      const loadingToast = toast.loading("Processing image...");
      
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 1200,
        useWebWorker: true,
      };
      
      const compressedFile = await imageCompression(file, options);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        toast.dismiss(loadingToast);
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      toast.dismiss();
      toast.error("Error processing image");
      console.error("Image processing failed:", error);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
  
    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });
  
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="p-4 w-full bg-base-100/50 backdrop-blur-md border-t border-base-300">
      <AnimatePresence>
        {imagePreview && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="mb-4 flex items-center gap-2"
          >
            <div className="relative group">
              <img
                src={imagePreview}
                alt="Preview"
                className="size-20 object-cover rounded-2xl border-2 border-primary/20 shadow-md"
              />
              <button
                onClick={removeImage}
                className="absolute -top-2 -right-2 size-6 rounded-full bg-base-300 hover:bg-error hover:text-error-content
                flex items-center justify-center transition-colors shadow-sm"
                type="button"
                aria-label="Remove image"
              >
                <X className="size-3" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
        <div className="flex-1 relative flex items-center">
          <div className="absolute left-3 flex items-center justify-center">
             <button
              type="button"
              className={cn(
                "btn btn-ghost btn-circle btn-xs sm:btn-sm",
                imagePreview ? "text-primary" : "text-base-content/40"
              )}
              onClick={() => fileInputRef.current?.click()}
              aria-label="Attach image"
            >
              <Plus className="size-5" />
            </button>
          </div>
          
          <textarea
            className="w-full bg-base-200/50 border-none focus:ring-2 focus:ring-primary/20 rounded-2xl pl-12 pr-4 py-3 text-sm min-h-[44px] max-h-32 resize-none transition-all custom-scrollbar flex items-center"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            rows={1}
          />
          
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className={cn(
            "btn btn-primary btn-circle shadow-lg shadow-primary/20 h-11 w-11 min-h-0",
            (!text.trim() && !imagePreview) && "opacity-50 cursor-not-allowed"
          )}
          disabled={!text.trim() && !imagePreview}
          aria-label="Send message"
        >
          <Send size={18} className="ml-0.5" />
        </motion.button>
      </form>
    </div>
  );
};

export default MessageInput;