import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { AuthService } from "../services/authService";

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = await AuthService.login(username, password);
      login(token);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid username or password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen w-screen flex flex-col items-center justify-center p-gutter relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] rounded-full bg-secondary/5 blur-[120px]"></div>
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.03]" 
          style={{ 
            backgroundImage: "radial-gradient(#4f46e5 0.5px, transparent 0.5px)", 
            backgroundSize: "24px 24px" 
          }}
        ></div>
      </div>

      {/* Main Login Shell */}
      <main className="relative z-10 w-full max-w-[440px] flex flex-col items-center">
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-stack-lg">
          <div className="w-12 h-12 bg-primary flex items-center justify-center rounded-xl mb-4 shadow-sm text-white">
            <span className="material-symbols-outlined text-[28px]">assessment</span>
          </div>
          <h1 className="font-headline-md text-headline-md text-on-surface tracking-tight mb-1">EduAnalytics</h1>
          <p className="font-body-md text-body-md text-on-surface-variant text-center">Student Performance Analytics Platform</p>
        </div>

        {/* Login Card */}
        <div className="glass-card w-full p-8 rounded-xl shadow-sm">
          <header className="mb-stack-lg">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Institution Login</h2>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">Access your educator dashboard</p>
          </header>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-error-container text-on-error-container rounded-lg text-body-md border border-error/20">
                {error}
              </div>
            )}

            {/* Username Field */}
            <div className="space-y-1.5">
              <label className="font-label-md text-label-md text-on-surface-variant block ml-0.5" htmlFor="username">
                USERNAME
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">person</span>
                </div>
                <input 
                  type="text" 
                  id="username"
                  name="username"
                  className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md rounded-lg py-2.5 pl-11 pr-4 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 outline-none"
                  placeholder="educator@institution.edu"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="font-label-md text-label-md text-on-surface-variant block ml-0.5" htmlFor="password">
                PASSWORD
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-outline">
                  <span className="material-symbols-outlined text-[20px]">lock</span>
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password"
                  name="password"
                  className="w-full bg-surface-container-lowest border border-outline-variant text-on-surface font-body-md text-body-md rounded-lg py-2.5 pl-11 pr-11 focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all duration-200 outline-none"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-outline hover:text-on-surface transition-colors cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            {/* Remember Me Toggle */}
            <div className="flex items-center space-x-2 pt-1">
              <input 
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary cursor-pointer"
              />
              <label className="font-body-md text-body-md text-on-surface-variant cursor-pointer select-none" htmlFor="remember">
                Remember this device
              </label>
            </div>

            {/* Action Button */}
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-on-primary font-body-lg text-body-lg font-semibold py-3 rounded-lg hover:bg-primary-container active:scale-[0.98] transition-all duration-150 shadow-sm flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              <span>{isSubmitting ? "Signing In..." : "Sign In"}</span>
              {!isSubmitting && (
                <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">
                  arrow_forward
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Footer Trust Info */}
        <footer className="mt-8 text-center">
          <div className="flex items-center justify-center gap-4 text-outline mb-4">
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">shield</span>
              <span className="font-label-sm text-label-sm">Secure Portal</span>
            </div>
            <div className="w-1 h-1 bg-outline-variant rounded-full"></div>
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">verified_user</span>
              <span className="font-label-sm text-label-sm">FERPA Compliant</span>
            </div>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant opacity-60">
            © 2026 EduAnalytics Platform. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
};
export default LoginPage;
