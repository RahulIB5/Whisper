import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.js";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { cn } from "../lib/utils";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-md bg-base-100/70"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-xl font-bold tracking-tight">Whisper</h1>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={"/settings"}
              className="btn btn-ghost btn-sm gap-2 normal-case font-medium"
            >
              <Settings className="w-4 h-4 opacity-70" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className="btn btn-ghost btn-sm gap-2 normal-case font-medium">
                  <User className="size-5 opacity-70" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button 
                  className="btn btn-ghost btn-sm gap-2 normal-case font-medium text-error hover:bg-error/10" 
                  onClick={logout}
                  aria-label="Logout"
                >
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;