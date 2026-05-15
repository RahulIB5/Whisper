import { THEMES } from "../constants";
import { useThemeStore } from "../store/useThemeStore";
import { Send, Palette, Layout } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";

const PREVIEW_MESSAGES = [
  { id: 1, content: "Hey! How's it going?", isSent: false },
  { id: 2, content: "I'm doing great! Just working on some new features.", isSent: true },
];

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="min-h-screen pt-24 pb-12 bg-base-200/50">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex flex-col gap-1">
            <h2 className="text-3xl font-extrabold tracking-tight">Settings</h2>
            <p className="text-base-content/50 font-medium text-lg">Personalize your chat experience</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Left: Theme Selection */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 px-1">
                <Palette className="size-5 text-primary" />
                <h3 className="text-lg font-bold">Interface Theme</h3>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {THEMES.map((t) => (
                  <button
                    key={t}
                    className={cn(
                      "group flex flex-col items-center gap-2 p-3 rounded-2xl transition-all duration-200 border-2",
                      theme === t 
                        ? "bg-primary/5 border-primary shadow-sm" 
                        : "bg-base-100 border-transparent hover:bg-base-200 hover:border-base-300"
                    )}
                    onClick={() => setTheme(t)}
                  >
                    <div className="relative h-12 w-full rounded-xl overflow-hidden shadow-inner" data-theme={t}>
                      <div className="absolute inset-0 grid grid-cols-4 gap-px p-1.5">
                        <div className="rounded-sm bg-primary" />
                        <div className="rounded-sm bg-secondary" />
                        <div className="rounded-sm bg-accent" />
                        <div className="rounded-sm bg-neutral" />
                      </div>
                    </div>
                    <span className="text-[11px] font-bold tracking-wide truncate w-full text-center uppercase opacity-70">
                      {t}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Preview */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 px-1">
                <Layout className="size-5 text-primary" />
                <h3 className="text-lg font-bold">Real-time Preview</h3>
              </div>
              
              <div className="rounded-3xl border border-base-300 overflow-hidden bg-base-100 shadow-2xl">
                <div className="p-6 bg-base-200/50 backdrop-blur-sm">
                  <div className="max-w-md mx-auto">
                    {/* Mock Chat UI */}
                    <div className="bg-base-100 rounded-2xl shadow-sm overflow-hidden border border-base-300">
                      {/* Chat Header */}
                      <div className="px-4 py-4 border-b border-base-300 bg-base-100/50 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content font-bold shadow-sm">
                            AD
                          </div>
                          <div>
                            <h3 className="font-bold text-sm">Alex Dunphy</h3>
                            <p className="text-[10px] text-primary font-medium">Online</p>
                          </div>
                        </div>
                      </div>

                      {/* Chat Messages */}
                      <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100/50">
                        {PREVIEW_MESSAGES.map((message) => (
                          <div
                            key={message.id}
                            className={cn("flex", message.isSent ? "justify-end" : "justify-start")}
                          >
                            <div
                              className={cn(
                                "max-w-[85%] rounded-2xl p-3 shadow-sm text-sm",
                                message.isSent 
                                  ? "bg-primary text-primary-content rounded-tr-none" 
                                  : "bg-base-200 text-base-content rounded-tl-none"
                              )}
                            >
                              <p>{message.content}</p>
                              <p className={cn(
                                "text-[10px] mt-1.5 font-medium opacity-50",
                                message.isSent ? "text-primary-content" : "text-base-content"
                              )}>
                                12:00 PM
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Chat Input */}
                      <div className="p-4 border-t border-base-300 bg-base-100/50">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            className="input input-bordered input-sm flex-1 text-sm h-10 bg-base-200/50 border-none focus:bg-base-200"
                            placeholder="Type a message..."
                            value="This is a preview"
                            readOnly
                          />
                          <button className="btn btn-primary btn-sm h-10 w-10 p-0 shadow-lg shadow-primary/20">
                            <Send size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;