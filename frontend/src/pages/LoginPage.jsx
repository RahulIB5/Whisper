import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import AuthImagePattern from "../components/AuthImagePattern";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="h-screen grid lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-base-100">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-8"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shadow-sm"
              >
                <MessageSquare className="w-7 h-7 text-primary" />
              </motion.div>
              <h1 className="text-3xl font-extrabold mt-4 tracking-tight">Welcome Back</h1>
              <p className="text-base-content/50 font-medium">Sign in to your account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email Address</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/30" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-11 bg-base-200/50 border-none focus:bg-base-200 focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Password</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/30" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered w-full pl-11 bg-base-200/50 border-none focus:bg-base-200 focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-primary transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/30" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/30" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full h-12 shadow-lg shadow-primary/20 font-bold text-lg" disabled={isLoggingIn}>
              {isLoggingIn ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/50 font-medium">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline font-bold">
                Create account
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={"Sign in to continue your conversations and catch up with your messages."}
      />
    </div>
  );
};

export default LoginPage;