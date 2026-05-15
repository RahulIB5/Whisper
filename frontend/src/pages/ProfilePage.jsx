import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, Mail, User, Shield, Calendar } from "lucide-react";
import imageCompression from "browser-image-compression";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [isCompressing, setIsCompressing] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    try {
      setIsCompressing(true);
      
      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        fileType: file.type
      };
      
      const compressedFile = await imageCompression(file, options);
      
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      
      reader.onload = async () => {
        const base64Image = reader.result;
        setSelectedImg(base64Image);
        setIsCompressing(false);
        
        try {
          await updateProfile({ profilePic: base64Image });
        } catch (error) {
          toast.error("Failed to update profile picture");
        }
      };
    } catch (error) {
      setIsCompressing(false);
      toast.error("Error processing image");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 bg-base-200/50">
      <div className="max-w-3xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-base-100 rounded-3xl shadow-xl border border-base-300 overflow-hidden"
        >
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-primary/20 to-secondary/20 relative" />
          
          <div className="px-8 pb-8">
            {/* Avatar Section */}
            <div className="relative -mt-16 flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="size-32 rounded-full ring-4 ring-base-100 shadow-xl overflow-hidden bg-base-300">
                  <img
                    src={selectedImg || authUser.profilePic || "/avatar.png"}
                    alt="Profile"
                    className="size-full object-cover"
                  />
                </div>
                <label
                  htmlFor="avatar-upload"
                  className={cn(
                    "absolute bottom-0 right-0 p-2.5 rounded-full cursor-pointer transition-all duration-300 shadow-lg",
                    "bg-primary text-primary-content hover:scale-110",
                    (isUpdatingProfile || isCompressing) && "animate-pulse pointer-events-none opacity-70"
                  )}
                >
                  <Camera className="size-5" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isUpdatingProfile || isCompressing}
                  />
                </label>
              </div>
              <div className="mt-4 text-center">
                <h1 className="text-2xl font-bold tracking-tight">{authUser?.fullName}</h1>
                <p className="text-base-content/50 font-medium">{authUser?.email}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Profile Details */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/40 mb-4">Personal Information</h3>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300/50 flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <User className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-base-content/40 uppercase">Full Name</p>
                      <p className="font-semibold">{authUser?.fullName}</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300/50 flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Mail className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-base-content/40 uppercase">Email Address</p>
                      <p className="font-semibold">{authUser?.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Stats */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-base-content/40 mb-4">Account Security</h3>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300/50 flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-green-500/10 text-green-500">
                      <Shield className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-base-content/40 uppercase">Account Status</p>
                      <p className="font-semibold text-green-500">Verified & Active</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300/50 flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                      <Calendar className="size-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-base-content/40 uppercase">Member Since</p>
                      <p className="font-semibold">{authUser.createdAt?.split("T")[0]}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-10 pt-6 border-t border-base-300">
               <p className="text-center text-xs text-base-content/40 font-medium">
                {isCompressing ? "Compressing image..." :
                 isUpdatingProfile ? "Updating your profile..." : 
                 "Your account is protected by industry-standard encryption."}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;