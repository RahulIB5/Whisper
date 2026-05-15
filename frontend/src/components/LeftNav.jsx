import { MessageSquare, CircleDashed, Users2, Radio, Settings, User, LogOut } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { cn } from "../lib/utils";

const LeftNav = () => {
  const { logout, authUser } = useAuthStore();
  const location = useLocation();

  const handleComingSoon = () => {
    toast("Feature coming soon! 🚀", {
      icon: '🚧',
    });
  };

  const navItems = [
    { icon: MessageSquare, label: "Chats", path: "/", active: location.pathname === "/" },
    { icon: CircleDashed, label: "Status", onClick: handleComingSoon },
    { icon: Radio, label: "Channels", onClick: handleComingSoon },
    { icon: Users2, label: "Communities", onClick: handleComingSoon },
  ];

  return (
    <div className="w-[64px] flex flex-col items-center py-4 bg-base-200 border-r border-base-300 z-50">
      {/* Top Icons */}
      <div className="flex-1 flex flex-col items-center gap-4 w-full">
        {navItems.map((item, idx) => (
          <button
            key={idx}
            onClick={item.onClick || null}
            className={cn(
              "p-3 rounded-xl transition-all relative group",
              item.active 
                ? "bg-primary/10 text-primary" 
                : "text-base-content/60 hover:bg-base-300 hover:text-base-content"
            )}
            title={item.label}
          >
            <item.icon className="size-6" />
            {item.active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
            )}
          </button>
        ))}
      </div>

      {/* Bottom Icons */}
      <div className="flex flex-col items-center gap-4 w-full">
        <Link
          to="/settings"
          className={cn(
            "p-3 rounded-xl transition-all group",
            location.pathname === "/settings" 
              ? "bg-primary/10 text-primary" 
              : "text-base-content/60 hover:bg-base-300 hover:text-base-content"
          )}
          title="Settings"
        >
          <Settings className="size-6" />
        </Link>

        <Link
          to="/profile"
          className={cn(
            "p-3 rounded-xl transition-all group",
            location.pathname === "/profile" 
              ? "bg-primary/10 text-primary" 
              : "text-base-content/60 hover:bg-base-300 hover:text-base-content"
          )}
          title="Profile"
        >
          <div className="size-8 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary/50 transition-all">
            <img 
              src={authUser?.profilePic || "/avatar.png"} 
              alt="Profile" 
              className="size-full object-cover"
            />
          </div>
        </Link>

        <button
          onClick={logout}
          className="p-3 rounded-xl text-error hover:bg-error/10 transition-all"
          title="Logout"
        >
          <LogOut className="size-6" />
        </button>
      </div>
    </div>
  );
};

export default LeftNav;
