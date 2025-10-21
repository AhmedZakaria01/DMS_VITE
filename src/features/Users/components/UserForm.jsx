/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch } from "react-redux";
import {
  User,
  Mail,
  Lock,
  Briefcase,
  CheckCircle,
  AlertCircle,
  Loader2,
  RotateCcw,
  Eye,
  EyeOff,
} from "lucide-react";
import { createUser } from "../usersThunks";
import { useTranslation } from "react-i18next";

// Array of available roleIds with UUID values
const roleIds = [
  { value: "c3563db9-99ce-43fd-9396-adcc0a455862", label: "Administrator" },
  { value: "ecc0e6d4-6ef6-4447-9e3f-2ad01c210545", label: "Manager" },
  { value: "a1b2c3d4-5e6f-7g8h-9i0j-k1l2m3n4o5p6", label: "Editor" },
  { value: "b2c3d4e5-6f7g-8h9i-0j1k-l2m3n4o5p6q7", label: "User" },
  { value: "c3d4e5f6-7g8h-9i0j-1k2l-m3n4o5p6q7r8", label: "Viewer" },
];

// Permission IDs array (you can modify this as needed)
const permissionIds = [
  { value: "25", label: "Permission 25" },
  { value: "26", label: "Permission 26" },
  { value: "27", label: "Permission 27" },
  { value: "28", label: "Permission 28" },
  { value: "29", label: "Permission 29" },
];

// Dynamic validation schema based on mode
const getValidationSchema = (isEditMode, t) =>
  z.object({
    firstName: z
      .string()
      .min(1, t("users.validation.firstNameRequired"))
      .min(3, t("users.validation.firstNameMin"))
      .max(30, t("users.validation.firstNameMax"))
      .regex(/^[a-zA-Z0-9_]+$/, t("users.validation.firstNamePattern"))
      .trim(),
    lastName: z
      .string()
      .min(1, t("users.validation.lastNameRequired"))
      .min(3, t("users.validation.lastNameMin"))
      .max(30, t("users.validation.lastNameMax"))
      .regex(/^[a-zA-Z0-9_]+$/, t("users.validation.lastNamePattern"))
      .trim(),
    userName: z
      .string()
      .min(1, t("users.validation.usernameRequired"))
      .min(3, t("users.validation.usernameMin"))
      .max(30, t("users.validation.usernameMax"))
      .regex(/^[a-zA-Z0-9_]+$/, t("users.validation.usernamePattern"))
      .trim(),
    email: z
      .string()
      .min(1, t("users.validation.emailRequired"))
      .email(t("users.validation.emailInvalid"))
      .toLowerCase(),
    password: isEditMode
      ? z.string().optional().or(z.literal(""))
      : z
          .string()
          .min(1, t("users.validation.passwordRequired"))
          .min(8, t("users.validation.passwordMin"))
          .max(100, t("users.validation.passwordMax"))
          .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, t("users.validation.passwordPattern")),
    confirmPassword: isEditMode
      ? z.string().optional().or(z.literal(""))
      : z.string().min(1, t("users.validation.confirmPasswordRequired")),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t("users.validation.passwordMismatch"),
    path: ["confirmPassword"],
  });

const UserForm = ({
  mode = "create",
  initialData = null,
  onSuccess,
  onCancel,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isEditMode = mode === "edit";

  // Multi-select states
  const [selectedRoleIds, setSelectedRoleIds] = useState([]);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);
  const [roleSearchTerm, setRoleSearchTerm] = useState("");
  const [permissionSearchTerm, setPermissionSearchTerm] = useState("");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isPermissionDropdownOpen, setIsPermissionDropdownOpen] = useState(false);

  // Refs for dropdown containers
  const roleDropdownRef = useRef(null);
  const permissionDropdownRef = useRef(null);

  // Get default values based on mode
  const getDefaultValues = () => {
    if (isEditMode && initialData) {
      return {
        firstName: initialData.firstName || "",
        lastName: initialData.lastName || "",
        userName: initialData.userName || "",
        email: initialData.email || "",
        password: "",
        confirmPassword: "",
      };
    }
    return {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };
  };

  // React Hook Form with dynamic validation schema
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    trigger,
  } = useForm({
    resolver: zodResolver(getValidationSchema(isEditMode, t)),
    mode: "onChange",
    defaultValues: getDefaultValues(),
  });

  // Filter roles and permissions based on search terms
  const filteredRoleIds = roleIds.filter((role) =>
    role.label.toLowerCase().includes(roleSearchTerm.toLowerCase())
  );

  const filteredPermissionIds = permissionIds.filter((permission) =>
    permission.label.toLowerCase().includes(permissionSearchTerm.toLowerCase())
  );

  // Initialize form data when in edit mode or when initialData changes
  useEffect(() => {
    if (isEditMode && initialData) {
      console.log("Initializing user form with data:", initialData);

      // Set form values
      setValue("firstName", initialData.firstName || "");
      setValue("lastName", initialData.lastName || "");
      setValue("userName", initialData.userName || "");
      setValue("email", initialData.email || "");
      setValue("password", "");
      setValue("confirmPassword", "");

      // Set selected roleIds and permissionIds from initial data
      if (initialData.roleIds) {
        setSelectedRoleIds(Array.isArray(initialData.roleIds) ? initialData.roleIds : []);
      }
      if (initialData.permissionIds) {
        setSelectedPermissionIds(Array.isArray(initialData.permissionIds) ? initialData.permissionIds : []);
      }

      // Trigger validation
      trigger();
    }
  }, [isEditMode, initialData, setValue, trigger]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(event.target)) {
        setIsRoleDropdownOpen(false);
      }
      if (permissionDropdownRef.current && !permissionDropdownRef.current.contains(event.target)) {
        setIsPermissionDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle role selection
  const handleRoleToggle = (roleValue) => {
    let updatedRoleIds;
    if (selectedRoleIds.includes(roleValue)) {
      updatedRoleIds = selectedRoleIds.filter((role) => role !== roleValue);
    } else {
      updatedRoleIds = [...selectedRoleIds, roleValue];
    }
    setSelectedRoleIds(updatedRoleIds);
  };

  // Handle permission selection
  const handlePermissionToggle = (permissionValue) => {
    let updatedPermissionIds;
    if (selectedPermissionIds.includes(permissionValue)) {
      updatedPermissionIds = selectedPermissionIds.filter((permission) => permission !== permissionValue);
    } else {
      updatedPermissionIds = [...selectedPermissionIds, permissionValue];
    }
    setSelectedPermissionIds(updatedPermissionIds);
  };

  // Remove role
  const removeRole = (roleValue) => {
    const updatedRoleIds = selectedRoleIds.filter((role) => role !== roleValue);
    setSelectedRoleIds(updatedRoleIds);
  };

  // Remove permission
  const removePermission = (permissionValue) => {
    const updatedPermissionIds = selectedPermissionIds.filter((permission) => permission !== permissionValue);
    setSelectedPermissionIds(updatedPermissionIds);
  };

  // Get role label by value
  const getRoleLabel = (value) => {
    return roleIds.find((role) => role.value === value)?.label || value;
  };

  // Get permission label by value
  const getPermissionLabel = (value) => {
    return permissionIds.find((permission) => permission.value === value)?.label || value;
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Toggle confirmPassword visibility
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  // Form submission handler
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Prepare data for submission in the desired format
      const submitData = {
        firstName: data.firstName,
        lastName: data.lastName,
        userName: data.userName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        roleIds: selectedRoleIds,
        permissionIds: selectedPermissionIds,
      };

      // In edit mode, include the ID and handle password
      if (isEditMode && initialData) {
        submitData.id = initialData.id;
        // If password is empty in edit mode, don't include it
        if (!submitData.password || submitData.password.trim() === "") {
          delete submitData.password;
          delete submitData.confirmPassword;
        }
      }

      console.log(`${isEditMode ? "UPDATE" : "CREATE"} User Data:`, JSON.stringify(submitData, null, 2));

      // Dispatch the createUser action with the properly formatted data
      const result = await dispatch(createUser(submitData)).unwrap();

      console.log(`User ${isEditMode ? "updated" : "created"} successfully!`, result);

      // Call success callback to close modal and refresh data
      if (onSuccess) {
        onSuccess(result);
      }
      setIsSubmitting(false);
    } catch (error) {
      console.error(
        `Failed to ${isEditMode ? "update" : "create"} user:`,
        error
      );
      alert(
        `Failed to ${isEditMode ? "update" : "create"} user: ${error.message || 'Please try again.'}`
      );
      setIsSubmitting(false);
    }
  };

  // Reset form handler
  const handleReset = () => {
    if (isEditMode && initialData) {
      // Reset to initial data in edit mode
      setValue("firstName", initialData.firstName || "");
      setValue("lastName", initialData.lastName || "");
      setValue("userName", initialData.userName || "");
      setValue("email", initialData.email || "");
      setValue("password", "");
      setValue("confirmPassword", "");

      // Reset selected roleIds and permissionIds
      if (initialData.roleIds) {
        setSelectedRoleIds(Array.isArray(initialData.roleIds) ? initialData.roleIds : []);
      }
      if (initialData.permissionIds) {
        setSelectedPermissionIds(Array.isArray(initialData.permissionIds) ? initialData.permissionIds : []);
      }
    } else {
      // Reset to empty in create mode
      reset();
      setSelectedRoleIds([]);
      setSelectedPermissionIds([]);
    }
    setRoleSearchTerm("");
    setPermissionSearchTerm("");
    setIsRoleDropdownOpen(false);
    setIsPermissionDropdownOpen(false);
  };

  // Cancel handler
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {isEditMode ? t("users.update") : t("users.createNew")}
        </h2>
        <p className="text-lg text-gray-600">
          {isEditMode
            ? "Update the user information below"
            : "Fill in the basic information to create a new user account"}
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="space-y-6">
          {/* Account Information Section */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <User className="w-4 h-4 text-blue-600" />
              </span>
              Account Information
            </h3>

            <div className="space-y-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("users.firstName")} <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("firstName")}
                  type="text"
                  autoComplete="off"
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
                    errors.firstName
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400 focus:border-blue-500"
                  }`}
                  placeholder={t("users.firstNamePlaceholder")}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("users.lastName")} <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("lastName")}
                  type="text"
                  autoComplete="off"
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
                    errors.lastName
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400 focus:border-blue-500"
                  }`}
                  placeholder={t("users.lastNamePlaceholder")}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("users.username")} <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("userName")}
                  type="text"
                  autoComplete="off"
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
                    errors.userName
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400 focus:border-blue-500"
                  }`}
                  placeholder={t("users.usernamePlaceholder")}
                />
                {errors.userName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.userName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("users.email")} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("email")}
                    type="email"
                    autoComplete="off"
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
                      errors.email
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 hover:border-gray-400 focus:border-blue-500"
                    }`}
                    placeholder={t("auth.emailPlaceholder")}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("users.password")} {" "}
                  {!isEditMode && <span className="text-red-500">*</span>}
                  {isEditMode && (
                    <span className="text-gray-500 text-xs ml-2">
                      ({t("users.passwordLeaveEmpty")})
                    </span>
                  )}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
                      errors.password
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 hover:border-gray-400 focus:border-blue-500"
                    }`}
                    placeholder={
                      isEditMode
                        ? t("users.passwordLeaveEmpty")
                        : t("users.passwordStrongHint")
                    }
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.password.message}
                  </p>
                )}
                {!isEditMode && (
                  <p className="mt-1 text-xs text-gray-500">
                    {t("users.passwordRequirements")}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("users.confirmPassword")} {" "}
                  {!isEditMode && <span className="text-red-500">*</span>}
                  {isEditMode && (
                    <span className="text-gray-500 text-xs ml-2">
                      ({t("users.passwordLeaveEmpty")})
                    </span>
                  )}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("confirmPassword")}
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
                      errors.confirmPassword
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 hover:border-gray-400 focus:border-blue-500"
                    }`}
                    placeholder={
                      isEditMode
                        ? t("users.passwordLeaveEmpty")
                        : t("users.confirmPasswordPlaceholder")
                    }
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* RoleIds - Multi Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("roles.title")} <span className="text-red-500">*</span>
                </label>

                {/* Selected RoleIds Display */}
                {selectedRoleIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedRoleIds.map((roleValue) => (
                      <span
                        key={roleValue}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                      >
                        {getRoleLabel(roleValue)}
                        <button
                          type="button"
                          onClick={() => removeRole(roleValue)}
                          className="ml-1 hover:text-blue-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Role Search Input */}
                <div className="relative" ref={roleDropdownRef}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={roleSearchTerm}
                    onChange={(e) => setRoleSearchTerm(e.target.value)}
                    onFocus={() => setIsRoleDropdownOpen(true)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-gray-400 focus:border-blue-500"
                    placeholder={t("users.roles.searchPlaceholder")}
                  />

                  {/* Role Dropdown */}
                  {isRoleDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredRoleIds.length > 0 ? (
                        filteredRoleIds.map((role) => (
                          <div
                            key={role.value}
                            className={`flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer ${
                              selectedRoleIds.includes(role.value)
                                ? "bg-blue-50"
                                : ""
                            }`}
                            onClick={() => handleRoleToggle(role.value)}
                          >
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedRoleIds.includes(role.value)}
                                onChange={() => {}} // Handled by onClick
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                {role.label}
                              </span>
                            </div>
                            {selectedRoleIds.includes(role.value) && (
                              <CheckCircle className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          {t("users.roles.noResults", { query: roleSearchTerm })}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  {t("users.roles.selectedCount", { count: selectedRoleIds.length })}
                </p>
              </div>

              {/* PermissionIds - Multi Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Permissions
                </label>

                {/* Selected PermissionIds Display */}
                {selectedPermissionIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedPermissionIds.map((permissionValue) => (
                      <span
                        key={permissionValue}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full"
                      >
                        {getPermissionLabel(permissionValue)}
                        <button
                          type="button"
                          onClick={() => removePermission(permissionValue)}
                          className="ml-1 hover:text-green-600"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {/* Permission Search Input */}
                <div className="relative" ref={permissionDropdownRef}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={permissionSearchTerm}
                    onChange={(e) => setPermissionSearchTerm(e.target.value)}
                    onFocus={() => setIsPermissionDropdownOpen(true)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-gray-400 focus:border-blue-500"
                    placeholder={t("users.permissions.searchPlaceholder")}
                  />

                  {/* Permission Dropdown */}
                  {isPermissionDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredPermissionIds.length > 0 ? (
                        filteredPermissionIds.map((permission) => (
                          <div
                            key={permission.value}
                            className={`flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer ${
                              selectedPermissionIds.includes(permission.value)
                                ? "bg-green-50"
                                : ""
                            }`}
                            onClick={() => handlePermissionToggle(permission.value)}
                          >
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedPermissionIds.includes(permission.value)}
                                onChange={() => {}} // Handled by onClick
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mr-3"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                {permission.label}
                              </span>
                            </div>
                            {selectedPermissionIds.includes(permission.value) && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          {t("users.permissions.noResults", { query: permissionSearchTerm })}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  {t("users.permissions.selectedCount", { count: selectedPermissionIds.length })}
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || !isValid || selectedRoleIds.length === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {isEditMode ? t("users.updating") : t("users.creating")}
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {isEditMode ? t("users.update") : t("users.create")}
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="flex-none bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {t("system.reset")}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-none bg-red-200 hover:bg-red-300 disabled:bg-red-100 text-red-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              {t("system.cancel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(UserForm);