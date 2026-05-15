import { MessageSquare, Laptop, ShieldCheck, Lock } from "lucide-react";
import { motion } from "framer-motion";

const NoChatSelected = () => {
  return (
    <div className="w-full flex flex-1 flex-col items-center justify-center p-16 bg-base-100/50 backdrop-blur-sm relative overflow-hidden">
      {/* Background patterns similar to WhatsApp */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none">
        <div className="grid grid-cols-8 gap-12 p-8">
            {[...Array(64)].map((_, i) => (
                <MessageSquare key={i} className="size-8" />
            ))}
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md text-center space-y-8 z-10"
      >
        {/* Main Illustration Area */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-48 h-48 rounded-3xl bg-base-200 flex items-center justify-center shadow-2xl border border-base-300 relative overflow-hidden"
            >
               <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent" />
               <div className="flex flex-col items-center gap-4">
                    <Laptop className="size-20 text-primary/40" />
                    <div className="flex gap-2">
                        <div className="w-8 h-1 bg-primary/20 rounded-full" />
                        <div className="w-12 h-1 bg-primary/40 rounded-full" />
                        <div className="w-6 h-1 bg-primary/20 rounded-full" />
                    </div>
               </div>
            </motion.div>
            
            {/* Pulsing indicator */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary/10 rounded-full blur-2xl animate-pulse" />
          </div>
        </div>

        {/* Welcome Text */}
        <div className="space-y-3">
          <h2 className="text-3xl font-light tracking-tight text-base-content/90">Whisper for Web</h2>
          <p className="text-base-content/40 text-sm leading-relaxed">
            Send and receive messages without keeping your phone online.<br/>
            Use Whisper on up to 4 linked devices and 1 phone at the same time.
          </p>
        </div>
        
        <div className="pt-8 border-t border-base-300 flex flex-col items-center gap-4">
          <div className="flex items-center gap-2 text-xs font-medium text-base-content/30">
            <Lock className="size-3" />
            <span>End-to-end encrypted</span>
          </div>
        </div>
      </motion.div>

      {/* Floating Status Bar Bottom */}
      <div className="absolute bottom-10 flex items-center gap-2 px-6 py-2 rounded-full bg-base-200/50 text-[10px] font-bold tracking-widest uppercase opacity-40">
        <ShieldCheck className="size-3 text-primary" />
        <span>Personal Messaging</span>
      </div>
    </div>
  );
};

export default NoChatSelected;