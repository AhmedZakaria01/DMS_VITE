import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { login } from "../authThunks";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAuthenticated } from "../../../services/apiServices";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import logo from "../../../assets/logo.png";
import styles from "./login.module.css";

function Login() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, status, error } = useSelector((state) => state.authReducer);
  const [isLoading, setIsLoading] = useState(false);

  // Login Schema Config
  const loginSchema = z.object({
    email: z
      .string()
      .min(1, t("emailRequired")),
    password: z
      .string()
      .min(8, t("passwordMin"))
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
    <section
      className={`${styles.loginContainer} flex justify-center items-center h-screen`}
    >
      <div className="container mx-auto my-12 p-8 max-w-lg rounded-lg shadow-lg bg-[linear-gradient(to_bottom,rgba(15,23,42,0.95)_0%,#7c65c7_100%)]">
        <img
          src={logo}
          className="mx-auto"
          alt="logo"
          width={300}
          height={300}
        />
        <div className="w-full max-w-lg p-8 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* email Field */}
            <div>
              <label htmlFor="email" className="block text-white mb-2">
                {t("email")}
              </label>
              <input
                autoComplete="true"
                className={`w-full px-4 py-2 bg-gray-700 text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.email ? "border-red-500" : ""
                }`}
                type="text"
                name="email"
                id="email"
                placeholder={t("emailPlaceholder")}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="pb-4">
              <label htmlFor="password" className="block text-white mb-2">
                {t("password")}
              </label>
              <input
                className={`w-full px-4 py-2 bg-gray-700 text-white border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.password ? "border-red-500" : ""
                }`}
                type="password"
                name="password"
                id="password"
                autoComplete="true"
                placeholder={t("passwordPlaceholder")}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            {/* Submit Button */}
            {isLoading ? (
              <button
                className="w-full py-2 bg-purple-600 text-white rounded-md cursor-not-allowed"
                disabled
              >
                <i className="fas fa-spinner fa-spin"></i> {t("loading")}
              </button>
            ) : (
              <button
                className="w-full py-2 px-4 bg-purple-600 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition hover:bg-purple-900"
                type="submit"
              >
                {t("login")}
              </button>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export default Login;
