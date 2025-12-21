/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import {
  User,
  Mail,
  Lock,
  Briefcase,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { createUser, updateUser, fetchSpecificUser } from "../usersThunks";
import { fetchRoles } from "../../Roles/RolesThunks";
import { fetchScreensPermissions } from "../../Permissions/permissionsThunks";
import { useTranslation } from "react-i18next";
import SuccessAlert from "../../../globalComponents/Alerts/SuccessAlert";
import ErrorAlert from "../../../globalComponents/Alerts/ErrorAlert";

const UserForm = ({
  mode = "create",
  initialData = null,
  onSuccess,
  onCancel,
}) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t } = useTranslation();
  
  // Alert states
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const autoCloseTimeoutRef = useRef(null);

  // State for input hints
  const [showFirstNameHint, setShowFirstNameHint] = useState(false);
  const [showLastNameHint, setShowLastNameHint] = useState(false);
  const [showUserNameHint, setShowUserNameHint] = useState(false);

  const { screenPermissions = [] } = useSelector(
    (state) => state.permissionsReducer
  );
  const { specificUser, specificUserStatus } = useSelector(
    (state) => state.usersReducer
  );

  useEffect(() => {
    dispatch(fetchScreensPermissions());
  }, [dispatch]);
// console.log('====================================');
  // console.log('marwa',screenPermissions);
  // console.log('====================================')
  const isEditMode = mode === "edit";
  
  // Multi-select states
  const [selectedRoles, setSelectedRoles] = useState([]); 
  const [selectedPermissionIds, setSelectedPermissionIds] = useState([]);
  const [roleSearchTerm, setRoleSearchTerm] = useState("");
  const [permissionSearchTerm, setPermissionSearchTerm] = useState("");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isPermissionDropdownOpen, setIsPermissionDropdownOpen] = useState(false);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);

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
        // No password fields for edit mode
        ...(!isEditMode && { password: "", confirmPassword: "" }),
        // password: "",
        // confirmPassword: "",
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
    resolver: zodResolver(getValidationSchema(isEditMode,t)),
    mode: "onChange",
    defaultValues: getDefaultValues(),
  });

  // Get roles from Redux store
  const { roles } = useSelector((state) => state.rolesReducer);
  // Debug logging
  useEffect(() => {
    if (specificUser && isEditMode) {
      console.log('====================================');
      console.log('specificUser:', specificUser);
      console.log('specificUser.userRoles:', specificUser?.userRoles);
      console.log('specificUser.userPermissions:', specificUser?.userPermissions);
      console.log('====================================');
    }
  }, [specificUser, isEditMode]);

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  // Filter roles based on search terms
  const filteredRoles = roles.filter((role) =>
    role.roleName.toLowerCase().includes(roleSearchTerm.toLowerCase())
  );

  const filteredPermissions = screenPermissions.filter((permission) =>
    permission.displayName.toLowerCase().includes(permissionSearchTerm.toLowerCase())
  );

  // Fetch specific user data when in edit mode
  useEffect(() => {
    if (isEditMode && initialData?.id) {
      const fetchUserData = async () => {
        try {
          setIsLoadingUserData(true);
          await dispatch(fetchSpecificUser(initialData.id)).unwrap();
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        } finally {
          setIsLoadingUserData(false);
        }
      };
      
      fetchUserData();
    }
  }, [isEditMode, initialData?.id, dispatch]);

  // FIXED: Only fetch specific user if initialData exists and has userId
  useEffect(() => {
    if (isEditMode && initialData?.userId) {
      dispatch(fetchSpecificUser(initialData.userId));
    }
  }, [isEditMode, initialData?.userId, dispatch]);

  // Initialize form data when specific user data is loaded
  useEffect(() => {
    if (isEditMode && specificUser && specificUserStatus === "succeeded") {
      console.log("Initializing form with specific user data:", specificUser);

      // Set form values from specific user data
      setValue("firstName", specificUser.firstName || "");
      setValue("lastName", specificUser.lastName || "");
      setValue("userName", specificUser.userName || "");
      setValue("email", specificUser.email || "");

      // Set selected roles from userRoles
      if (specificUser.userRoles && Array.isArray(specificUser.userRoles)) {
        const roleIds = specificUser.userRoles.map(role => role.roleId);
        setSelectedRoles(roleIds);
        console.log("Setting selected roles:", roleIds);
      }

      // Set selected permissions from userPermissions
      if (specificUser.userPermissions && Array.isArray(specificUser.userPermissions)) {
        const permissionIds = specificUser.userPermissions.map(permission => permission.id);
        setSelectedPermissionIds(permissionIds);
        console.log("Setting selected permissions:", permissionIds);
      }

      // Trigger validation
      trigger();
    }
  }, [isEditMode, specificUser, specificUserStatus, setValue, trigger]);

  // Fallback to initialData if specificUser hasn't loaded yet
  useEffect(() => {
    if (isEditMode && initialData && !specificUser) {
      console.log("Using initialData as fallback:", initialData);

      setValue("firstName", initialData.firstName || "");
      setValue("lastName", initialData.lastName || "");
      setValue("userName", initialData.userName || "");
      setValue("email", initialData.email || "");
      // setValue("password", "");
      // setValue("confirmPassword", "");
      // Set selected roles from initial data
      if (initialData.userRoles) {
        const roleIds = initialData.userRoles.map(role => 
          typeof role === 'object' ? role.roleId || role.id : role
        );
        setSelectedRoles(roleIds);
      }

      // Set selected permissions from initial data
      if (initialData.userPermissions) {
        const permissionIds = initialData.userPermissions.map(permission =>
          typeof permission === 'object' ? permission.id || permission.permissionId : permission
        );
        setSelectedPermissionIds(permissionIds);
      }

      trigger();
    }
  }, [isEditMode, initialData, specificUser, setValue, trigger]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoCloseTimeoutRef.current) {
        clearTimeout(autoCloseTimeoutRef.current);
      }
    };
  }, []);

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

  // Handle input to prevent starting with space
  const handleInputNoLeadingSpace = (fieldName, e, setHintFunction) => {
    const value = e.target.value;
    
    // Check if user tries to start with space
    if (value.startsWith(' ') && value.length === 1) {
      // Show hint message
      if (setHintFunction) setHintFunction(true);
      
      // Prevent the space
      e.target.value = '';
      setValue(fieldName, '', { shouldValidate: true });
      return;
    }
    
    // Remove starting space if user pastes text with leading space
    if (value.startsWith(' ')) {
      e.target.value = value.trimStart();
      setValue(fieldName, e.target.value, { shouldValidate: true });
    }
    
    // Hide hint if user starts typing valid text
    if (value.length > 0 && !value.startsWith(' ') && setHintFunction) {
      setHintFunction(false);
    }
  };

  // Handle success alert close
  const handleSuccessAlertClose = () => {
    if (autoCloseTimeoutRef.current) {
      clearTimeout(autoCloseTimeoutRef.current);
    }
    setShowSuccessAlert(false);
    handleAutoClose();
  };

  // Handle error alert close
  const handleErrorAlertClose = () => {
    setShowErrorAlert(false);
  };

  // Handle auto close after success
  const handleAutoClose = () => {
    console.log("Auto closing popup and alert...");
    setShowSuccessAlert(false);
    if (!isEditMode) {
      reset();
      setSelectedRoles([]);
      setSelectedPermissionIds([]);
    }
    if (onSuccess) {
      onSuccess();
    }
  };

  // Show success alert
  const triggerSuccess = (message) => {
    setSuccessMessage(message);
    setShowSuccessAlert(true);
    
    // Auto close after 3 seconds
    if (autoCloseTimeoutRef.current) {
      clearTimeout(autoCloseTimeoutRef.current);
    }
    autoCloseTimeoutRef.current = setTimeout(() => {
      handleSuccessAlertClose();
    }, 3000);
  };

  // Show error alert
  const triggerError = (message) => {
    setErrorMessage(message);
    setShowErrorAlert(true);
    setTimeout(() => {
      setShowErrorAlert(false);
    }, 6000);
  };

  // Handle role selection
  const handleRoleToggle = (roleId) => {
    let updatedRoles;
    if (selectedRoles.includes(roleId)) {
      updatedRoles = selectedRoles.filter((role) => role !== roleId);
    } else {
      updatedRoles = [...selectedRoles, roleId];
    }
    setSelectedRoles(updatedRoles);
  };

  // Handle permission selection
  const handlePermissionToggle = (permissionId) => {
    let updatedPermissionIds;
    if (selectedPermissionIds.includes(permissionId)) {
      updatedPermissionIds = selectedPermissionIds.filter((permission) => permission !== permissionId);
    } else {
      updatedPermissionIds = [...selectedPermissionIds, permissionId];
    }
    setSelectedPermissionIds(updatedPermissionIds);
  };

  // Remove role
  const removeRole = (roleId) => {
    const updatedRoles = selectedRoles.filter((role) => role !== roleId);
    setSelectedRoles(updatedRoles);
  };

  // Remove permission
  const removePermission = (permissionId) => {
    const updatedPermissionIds = selectedPermissionIds.filter((permission) => permission !== permissionId);
    setSelectedPermissionIds(updatedPermissionIds);
  };

  // Get role name by roleId
  const getRoleName = (roleId) => {
    const role = roles.find((r) => r.roleId === roleId);
    return role ? role.roleName : roleId;
  };

  // Get permission label by id
  const getPermissionLabel = (id) => {
    const permission = screenPermissions.find((permission) => permission.id === id);
    return permission ? permission.displayName : id;
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
      setShowSuccessAlert(false);
      setShowErrorAlert(false);

      if (autoCloseTimeoutRef.current) {
        clearTimeout(autoCloseTimeoutRef.current);
      }

      // Prepare data for submission
      const submitData = {
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        userName: data.userName.trim(),
        email: data.email.trim().toLowerCase(),
        // password: data.password,
        // confirmPassword: data.confirmPassword,
        roleIds: selectedRoles,
        permissionIds: selectedPermissionIds,
      };
      // console.log('marwa submitData',submitData);
      // Add password only if provided and we're in create mode
      if (!isEditMode && data.password && data.password.trim() !== "") {
        submitData.password = data.password;
        submitData.confirmPassword = data.confirmPassword;
      }

      // In edit mode, include the user ID
      if (isEditMode && initialData) {
        submitData.id = initialData.id || initialData.userId;
      }

      console.log(`${isEditMode ? "UPDATE" : "CREATE"} User Data:`, JSON.stringify(submitData, null, 2));

      // Dispatch the appropriate action
      let result;
      if (isEditMode) {
        result = await dispatch(updateUser(submitData)).unwrap();
      } else {
        result = await dispatch(createUser(submitData)).unwrap();
      }

      console.log(`User ${isEditMode ? "updated" : "created"} successfully!`, result);

      // Show success alert
      triggerSuccess(`User ${isEditMode ? 'updated' : 'created'} successfully`);

      // Reset submitting state
      setIsSubmitting(false);

    } catch (error) {
      console.log("Failed to create/update user:", error);
      
      // FIXED: Use ErrorAlert component instead of native alert
      const errorMsg = error?.message || `Failed to ${isEditMode ? "update" : "create"} user. Please try again.`;
      console.log('====================================');
      console.log(errorMsg);
      console.log('====================================');
      triggerError(errorMsg);
      setIsSubmitting(false);
    }
  };

  // Reset form handler
  const handleReset = () => {
    if (autoCloseTimeoutRef.current) {
      clearTimeout(autoCloseTimeoutRef.current);
    }

    if (isEditMode && specificUser) {
      // Reset to specific user data
      setValue("firstName", specificUser.firstName || "");
      setValue("lastName", specificUser.lastName || "");
      setValue("userName", specificUser.userName || "");
      setValue("email", specificUser.email || "");

      // Reset selected roles from userRoles
      if (specificUser.userRoles && Array.isArray(specificUser.userRoles)) {
        const roleIds = specificUser.userRoles.map(role => role.roleId);
        setSelectedRoles(roleIds);
      }

      // Reset selected permissions from userPermissions
      if (specificUser.userPermissions && Array.isArray(specificUser.userPermissions)) {
        const permissionIds = specificUser.userPermissions.map(permission => permission.id);
        setSelectedPermissionIds(permissionIds);
      }
    } else if (isEditMode && initialData) {
      // Fallback to initialData
      setValue("firstName", initialData.firstName || "");
      setValue("lastName", initialData.lastName || "");
      setValue("userName", initialData.userName || "");
      setValue("email", initialData.email || "");
      // setValue("password", "");
      // setValue("confirmPassword", "");
      // Reset selected roles
      if (initialData.userRoles) {
        const roleIds = initialData.userRoles.map(role => 
          typeof role === 'object' ? role.roleId || role.id : role
        );
        setSelectedRoles(roleIds);
      }
      
      // Reset selected permissions
      if (initialData.userPermissions) {
        const permissionIds = initialData.userPermissions.map(permission =>
          typeof permission === 'object' ? permission.id || permission.permissionId : permission
        );
        setSelectedPermissionIds(permissionIds);
      }
    } else {
      // Reset to empty in create mode
      reset();
      setSelectedRoles([]);
      setSelectedPermissionIds([]);
    }
    
    // Reset hints
    setShowFirstNameHint(false);
    setShowLastNameHint(false);
    setShowUserNameHint(false);
    
    setRoleSearchTerm("");
    setPermissionSearchTerm("");
    setIsRoleDropdownOpen(false);
    setIsPermissionDropdownOpen(false);
    setShowSuccessAlert(false);
    setShowErrorAlert(false);
  };

  // Cancel handler
  const handleCancel = () => {
    if (autoCloseTimeoutRef.current) {
      clearTimeout(autoCloseTimeoutRef.current);
    }
    
    setShowSuccessAlert(false);
    setShowErrorAlert(false);
    if (onCancel) {
      onCancel();
    }
  };

  // Show loading state for user data
  if (isEditMode && isLoadingUserData) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t("updateUser")}
          </h2>
        </div>
        <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">{t("loadingUserData")}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Alert */}
      {showSuccessAlert && (
        <SuccessAlert
          show={showSuccessAlert}
          onClose={handleSuccessAlertClose}
          title={t('success')}
          message={successMessage}
          autoHide={true}
          duration={3000}
        />
      )}

      {/* Error Alert */}
      {showErrorAlert && (
        <ErrorAlert
          show={showErrorAlert}
          onClose={handleErrorAlertClose}
          title={isEditMode ? t("updateFailed") : t("creationFailed")}
          message={errorMessage}
          autoClose={true}
          duration={6000}
        />
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {isEditMode ? t("updateUser") : t("createUser")}
        </h2>
        <p className="text-lg text-gray-600">
          {isEditMode
            ? t("updateUserDescription")
            : t("createUserDescription")}
        </p>
        {isEditMode && selectedRoles.length > 0 && (
          <div className="mt-2 text-sm text-green-600">
            {t("userHasRoles", { count: selectedRoles.length })}
          </div>
        )}
        {isEditMode && selectedPermissionIds.length > 0 && (
          <div className="mt-1 text-sm text-green-600">
            {t("userHasPermissions", { count: selectedPermissionIds.length })}
          </div>
        )}
      </div>

      {/* Form Container */}
      <div className="bg-gray-50 rounded-xl p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Account Information Section */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <User className="w-4 h-4 text-blue-600" />
              </span>
              {t("accountInformation")}
            </h3>

            <div className="space-y-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("firstName")} <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("firstName")}
                  type="text"
                  autoComplete="off"
                  onInput={(e) => handleInputNoLeadingSpace("firstName", e, setShowFirstNameHint)}
                  onBlur={(e) => {
  
                    const trimmedValue = e.target.value.trim();
                    if (e.target.value !== trimmedValue) {
                      setValue("firstName", trimmedValue, { shouldValidate: true });
                    }
                    setShowFirstNameHint(false);
                  }}
                  onFocus={() => setShowFirstNameHint(false)}
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
                    errors.firstName
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400 focus:border-blue-500"
                  }`}
                  placeholder={t("firstNamePlaceholder")}
                />
                {showFirstNameHint && (
                  <div className="mt-1 flex items-center text-amber-600 text-xs">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    <span>{t("cannotStartWithSpace")}</span>
                  </div>
                )}
                {errors.firstName && (
                  <p className="mt-1 text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("lastName")} <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("lastName")}
                  type="text"
                  autoComplete="off"
                  onInput={(e) => handleInputNoLeadingSpace("lastName", e, setShowLastNameHint)}
                  onBlur={(e) => {
                    const trimmedValue = e.target.value.trim();
                    if (e.target.value !== trimmedValue) {
                      setValue("lastName", trimmedValue, { shouldValidate: true });
                    }
                    setShowLastNameHint(false);
                  }}
                  onFocus={() => setShowLastNameHint(false)}
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
                    errors.lastName
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400 focus:border-blue-500"
                  }`}
                  placeholder={t("lastNamePlaceholder")}
                />
                {showLastNameHint && (
                  <div className="mt-1 flex items-center text-amber-600 text-xs">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    <span>{t("cannotStartWithSpace")}</span>
                  </div>
                )}
                {errors.lastName && (
                  <p className="mt-1 text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("userName")} <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("userName")}
                  type="text"
                  disabled={isEditMode}
                  autoComplete="off"
                  onInput={(e) => handleInputNoLeadingSpace("userName", e, setShowUserNameHint)}
                  onBlur={(e) => {
  
                    const trimmedValue = e.target.value.trim();
                    if (e.target.value !== trimmedValue) {
                      setValue("userName", trimmedValue, { shouldValidate: true });
                    }
                    setShowUserNameHint(false);
                  }}
                  onFocus={() => setShowUserNameHint(false)}
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
                    errors.userName
                      ? "border-red-300 bg-red-50"
                      : isEditMode 
                        ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                        : "border-gray-300 hover:border-gray-400 focus:border-blue-500"
                  }`}
                  placeholder={t("usernamePlaceholder")}
                />
                {showUserNameHint && (
                  <div className="mt-1 flex items-center text-amber-600 text-xs">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    <span>{t("cannotStartWithSpace")}</span>
                  </div>
                )}
                {errors.userName && (
                  <p className="mt-1 text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.userName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("emailAddress")} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register("email")}
                    type="email"
                    autoComplete="off"
                    disabled={isEditMode}
                    onInput={(e) => {
                      // Prevent starting with space for email
                      const value = e.target.value;
                      if (value.startsWith(' ')) {
                        e.target.value = value.trimStart();
                        setValue("email", e.target.value, { shouldValidate: true });
                      }
                    }}
                    onBlur={(e) => {
    
                      const trimmedValue = e.target.value.trim();
                      if (e.target.value !== trimmedValue) {
                        setValue("email", trimmedValue, { shouldValidate: true });
                      }
                    }}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
                      errors.email
                        ? "border-red-300 bg-red-50"
                        : isEditMode 
                          ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                          : "border-gray-300 hover:border-gray-400 focus:border-blue-500"
                    }`}
                    placeholder={t("emailPlaceholder")}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.email.message}
                  </p>
                )}
             
              </div>

              {/* Password Field - ONLY SHOW IN CREATE MODE */}
              {!isEditMode && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("password")} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        onInput={(e) => {
                          // Prevent starting with space for password
                          const value = e.target.value;
                          if (value.startsWith(' ')) {
                            e.target.value = value.trimStart();
                            setValue("password", e.target.value, { shouldValidate: true });
                          }
                        }}
                        onBlur={(e) => {
        
                          const trimmedValue = e.target.value.trim();
                          if (e.target.value !== trimmedValue) {
                            setValue("password", trimmedValue, { shouldValidate: true });
                          }
                        }}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
                          errors.password
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 hover:border-gray-400 focus:border-blue-500"
                        }`}
                        placeholder={t("passwordPlaceholderCreate")}
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
                      <p className="mt-1 text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password Field - ONLY SHOW IN CREATE MODE */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t("confirmPassword")} <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        {...register("confirmPassword")}
                        type={showConfirmPassword ? "text" : "password"}
                        autoComplete="new-password"
                        onInput={(e) => {
                          // Prevent starting with space for confirm password
                          const value = e.target.value;
                          if (value.startsWith(' ')) {
                            e.target.value = value.trimStart();
                            setValue("confirmPassword", e.target.value, { shouldValidate: true });
                          }
                        }}
                        onBlur={(e) => {
        
                          const trimmedValue = e.target.value.trim();
                          if (e.target.value !== trimmedValue) {
                            setValue("confirmPassword", trimmedValue, { shouldValidate: true });
                          }
                        }}
                        className={`w-full pl-10 pr-12 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
                          errors.confirmPassword
                            ? "border-red-300 bg-red-50"
                            : "border-gray-300 hover:border-gray-400 focus:border-blue-500"
                        }`}
                        placeholder={t("confirmPasswordPlaceholderCreate")}
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
                      <p className="mt-1 text-red-600 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.confirmPassword.message}
                      </p>
                    )}
                  </div>
                </>
              )}

              {/* Roles - Multi Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("roles")} <span className="text-red-500">*</span>
                  {isEditMode && selectedRoles.length > 0 && (
                    <span className="text-xs text-green-600 ml-2">
                      ({selectedRoles.length} {t("selected")})
                    </span>
                  )}
                </label>

                {/* Selected Roles Display */}
                {selectedRoles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedRoles.map((roleId) => (
                      <span
                        key={roleId}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                      >
                        {getRoleName(roleId)}
                        <button
                          type="button"
                          onClick={() => removeRole(roleId)}
                          className="ml-1 hover:text-blue-600"
                          disabled={isSubmitting}
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
                    onInput={(e) => {
                      // Prevent starting with space for role search
                      const value = e.target.value;
                      if (value.startsWith(' ')) {
                        e.target.value = value.trimStart();
                        setRoleSearchTerm(e.target.value);
                      }
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-gray-400 focus:border-blue-500"
                    placeholder={t("rolesPlaceholder")}
                  />

                  {/* Role Dropdown */}
                  {isRoleDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredRoles.length > 0 ? (
                        filteredRoles.map((role) => (
                          <div
                            key={role.roleId}
                            className={`flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer ${
                              selectedRoles.includes(role.roleId)
                                ? "bg-blue-50"
                                : ""
                            }`}
                            onClick={() => handleRoleToggle(role.roleId)}
                          >
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedRoles.includes(role.roleId)}
                                readOnly
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                {role.roleName}
                              </span>
                            </div>
                            {selectedRoles.includes(role.roleId) && (
                              <CheckCircle className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          {t("noRolesFound")} &quot;{roleSearchTerm}&quot;
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  {t("rolesSelectionHint")} {selectedRoles.length}
                </p>
              </div>

              {/* Permissions - Multi Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("permissions")}
                  {isEditMode && selectedPermissionIds.length > 0 && (
                    <span className="text-xs text-green-600 ml-2">
                      ({selectedPermissionIds.length} {t("selected")})
                    </span>
                  )}
                </label>

                {/* Selected Permissions Display */}
                {selectedPermissionIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedPermissionIds.map((permissionId) => (
                      <span
                        key={permissionId}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full"
                      >
                        {getPermissionLabel(permissionId)}
                        <button
                          type="button"
                          onClick={() => removePermission(permissionId)}
                          className="ml-1 hover:text-green-600"
                          disabled={isSubmitting}
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
                    onInput={(e) => {
                      // Prevent starting with space for permission search
                      const value = e.target.value;
                      if (value.startsWith(' ')) {
                        e.target.value = value.trimStart();
                        setPermissionSearchTerm(e.target.value);
                      }
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-gray-400 focus:border-blue-500"
                    placeholder={t("permissionsPlaceholder")}
                  />

                  {/* Permission Dropdown */}
                  {isPermissionDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredPermissions.length > 0 ? (
                        filteredPermissions.map((permission) => (
                          <div
                            key={permission.id}
                            className={`flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer ${
                              selectedPermissionIds.includes(permission.id)
                                ? "bg-green-50"
                                : ""
                            }`}
                            onClick={() => handlePermissionToggle(permission.id)}
                          >
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedPermissionIds.includes(permission.id)}
                                readOnly
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded mr-3"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                {permission.displayName}
                              </span>
                            </div>
                            {selectedPermissionIds.includes(permission.id) && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          {t("noPermissionsFound")} &quot;{permissionSearchTerm}&quot;
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  {t("permissionsSelectionHint")} {selectedPermissionIds.length}
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting || !isValid || selectedRoles.length === 0}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {isEditMode ? t("updatingUser") : t("creatingUser")}
                </>
              ) : (
                <>
                  {isEditMode ? t("updateUser") : t("createUser")}
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="flex-none bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center"
            >
              {t("reset")}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-none bg-red-200 hover:bg-red-300 disabled:bg-red-100 text-red-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              {t("cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Dynamic validation schema based on mode - UPDATED with space prevention
const getValidationSchema = (isEditMode, t) => {
  // Base schema with common fields
  const baseSchema = z.object({
    firstName: z
      .string()
      .min(1, t("firstNameRequired"))
      .min(3, t("minThreeChars"))
      .max(30, t("maxThirtyChars"))
      .regex(
        /^[a-zA-Z0-9_]+$/,
        t("onlyLettersNumbersUnderscore")
      )
      .regex(/^\S.*$/, t("noLeadingSpace")) 
      .trim(),
    lastName: z
      .string()
      .min(1, t("lastNameRequired"))
      .min(3, t("minThreeChars"))
      .max(30, t("maxThirtyChars"))
      .regex(
        /^[a-zA-Z0-9_]+$/,
        t("onlyLettersNumbersUnderscore")
      )
      .regex(/^\S.*$/, t("noLeadingSpace")) 
      .trim(),
    userName: z
      .string()
      .min(1, t("userNameRequired"))
      .min(3, t("minThreeChars"))
      .max(30, t("maxThirtyChars"))
      .regex(
        /^[a-zA-Z0-9_]+$/,
        t("onlyLettersNumbersUnderscore")
      )
      .regex(/^\S.*$/, t("noLeadingSpace")) 
      .trim(),
    email: z
      .string()
      .min(1, t("emailRequired"))
      .email(t("emailInvalid"))
      .regex(/^\S.*$/, t("noLeadingSpace")) 
      .toLowerCase()
      .trim(),
  });

  // Add password fields only for create mode
  if (!isEditMode) {
    return baseSchema.extend({
      password: z
        .string()
        .min(1, t("passwordRequired"))
        .min(8, t("passwordMinLength"))
        .max(100, t("passwordMaxLength"))
        .regex(/^\S.*$/, t("noLeadingSpace")) 
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
          t("passwordRequirements")
        )
        .trim(),
      confirmPassword: z
        .string()
        .min(1, t("confirmPasswordRequired"))
        .regex(/^\S.*$/, t("noLeadingSpace")) 
        .trim(),
    }).refine((data) => data.password === data.confirmPassword, {
      message: t("passwordsNotMatch"),
      path: ["confirmPassword"],
    });
  }
  // Return base schema only for edit mode (no password fields)
  return baseSchema;
};

export default React.memo(UserForm);