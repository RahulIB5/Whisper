import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { MessageSquare, User, Mail, Lock, EyeOff, Eye, Loader2 } from 'lucide-react';
import { Link } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { motion } from "framer-motion";

import AuthImagePattern from '../components/AuthImagePattern';

function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore()

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters long");
    
    return true;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) signup(formData);
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 bg-base-100">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md space-y-8"
        >
          {/* LOGO */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shadow-sm"
              >
                <MessageSquare className="size-7 text-primary" />
              </motion.div>
              <h1 className="text-3xl font-extrabold mt-4 tracking-tight">Create Account</h1>
              <p className="text-base-content/50 font-medium">Get started with your free account</p>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Full Name</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="size-5 text-base-content/30" />
                </div>
                <input
                  type="text"
                  className="input input-bordered w-full pl-11 bg-base-200/50 border-none focus:bg-base-200 focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="Alex Dunphy"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email Address</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="size-5 text-base-content/30" />
                </div>
                <input
                  type="email"
                  className="input input-bordered w-full pl-11 bg-base-200/50 border-none focus:bg-base-200 focus:ring-2 focus:ring-primary/20 transition-all"
                  placeholder="alex@example.com"
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
                  <Lock className="size-5 text-base-content/30" />
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
                    <EyeOff className="size-5 text-base-content/30" />
                  ) : (
                    <Eye className="size-5 text-base-content/30" />
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full h-12 shadow-lg shadow-primary/20 font-bold text-lg" disabled={isSigningUp}>
              {isSigningUp ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-5 animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-base-content/50 font-medium">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline font-bold">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>

      {/* right side */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
}

export default SignUpPage;