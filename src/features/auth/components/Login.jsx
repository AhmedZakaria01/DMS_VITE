import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { login } from "../authThunks";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAuthenticated } from "../../../services/apiServices";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../../../assets/logo1.png";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  LogIn,
  Shield,
  Zap,
  Users,
} from "lucide-react";

function Login() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status, error } = useSelector((state) => state.authReducer);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Login Schema Config
  const loginSchema = z.object({
    email: z.string().min(1, t("emailRequired")),
    password: z
      .string()
      .min(8, t("passwordMinLength"))
      .regex(/[A-Z]/, t("passwordUppercase"))
      .regex(/[!@#$%^&*(),.?":{}|<>]/, t("passwordSpecial"))
      .regex(/[0-9]/, t("passwordNumber")),
  });

  // Use Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // Check if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      // navigate("/");
    }
  }, [navigate]);

  // Handle loading state
  useEffect(() => {
    setIsLoading(status === "loading");
  }, [status]);

  // On Submit
  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      await dispatch(login(data));

      // After successful login, check if authenticated and redirect
      if (isAuthenticated()) {
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="w-full max-w-md">
          {/* Glassmorphism Card */}
          <div className="backdrop-blur-md bg-white/70 rounded-2xl shadow-xl border border-white/50 p-8">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <img src={logo} alt="logo" className="w-80 h-auto" />
            </div>

      

            {/* Login Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-medium"
                >
                  {t("email")}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-black" />
                  </div>
                  <input
                    autoComplete="true"
                    className={`w-full pl-11 pr-4 py-3 bg-white/50 backdrop-blur-sm text-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                      errors.email
                        ? "border-red-500 ring-2 ring-red-500/50"
                        : "border-gray-300"
                    }`}
                    type="text"
                    name="email"
                    id="email"
                    placeholder={t("emailPlaceholder") || "Enter your email"}
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-medium"
                >
                  {t("password")}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-black" />
                  </div>
                  <input
                    className={`w-full pl-11 pr-12 py-3 bg-white/50 backdrop-blur-sm text-gray-900 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                      errors.password
                        ? "border-red-500 ring-2 ring-red-500/50"
                        : "border-gray-300"
                    }`}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    autoComplete="true"
                    placeholder={
                      t("passwordPlaceholderCreate") || "Enter your password"
                    }
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 bg-red-500 rounded-full"></span>
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                className={`w-full py-3.5 px-6 rounded-lg font-semibold text-white shadow-lg transition-all duration-300 transform flex items-center justify-center gap-2 mt-6 ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:shadow-xl"
                }`}
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    {t("loading") || "Loading..."}
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    {t("login")}
                  </>
                )}
              </button>
            </form>

 
          </div>
        </div>
      </div>

      {/* Right Side - Brand/Features */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 relative overflow-hidden">
        {/* Content - Centered */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
          <div className="max-w-lg space-y-8">
            {/* Main heading */}
            <div className="space-y-4 text-center">
              <h2 className="text-4xl font-bold leading-tight">
                Document Management System
              </h2>
              <p className="text-xl text-white/90">
                Secure, efficient, and intelligent document organization
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6 mt-12">
              <div className="flex items-start gap-4 text-left bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="p-3 bg-white/20 rounded-lg flex-shrink-0">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Secure Storage</h3>
                  <p className="text-white/80 text-sm">
                    Enterprise-grade security with encrypted storage and access
                    controls
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-left bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="p-3 bg-white/20 rounded-lg flex-shrink-0">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Fast Access</h3>
                  <p className="text-white/80 text-sm">
                    Lightning-fast document retrieval with advanced search
                    capabilities
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-left bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <div className="p-3 bg-white/20 rounded-lg flex-shrink-0">
                  <Users className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    Team Collaboration
                  </h3>
                  <p className="text-white/80 text-sm">
                    Work together seamlessly with role-based permissions and
                    sharing
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
