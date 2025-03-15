import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";
import imageCompression from "browser-image-compression";

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

      // Check original file size
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image too large. Please select an image smaller than 2MB.");
        return;
      }
  
    try {
      toast.loading("Compressing image...");
      
      // More aggressive compression options
      const options = {
        maxSizeMB: 0.5, // Reduced to 500KB
        maxWidthOrHeight: 250,
        useWebWorker: true,
        initialQuality: 0.3, // Lower quality for smaller file size
      };
      
      const compressedFile = await imageCompression(file, options);
      console.log("Original size:", (file.size / 1024 / 1024).toFixed(2) + "MB");
      console.log("Compressed size:", (compressedFile.size / 1024 / 1024).toFixed(2) + "MB");
      
      // If still too large, show an error
      if (compressedFile.size > 1 * 1024 * 1024) {
        toast.dismiss();
        toast.error("Image is still too large. Please select a smaller image.");
        return;
      }
      
      // Create preview from compressed file
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        toast.dismiss();
        toast.success("Image compressed successfully!");
      };
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      toast.dismiss();
      toast.error("Error compressing image");
      console.error("Image compression failed:", error);
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
      // toast.loading("Sending message...");
      
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });
  
      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      
      toast.dismiss();
      // toast.success("Message sent!");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to send message. The image may be too large.");
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-md btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;