/* eslint-disable react/prop-types */
import { useEffect, useState, useRef, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Shield,
  CheckCircle,
  Loader2,
  AlertCircle,
  RotateCcw,
  X,
  Search,
  Check,
  Briefcase,
} from "lucide-react";
import { fetchScreensPermissions } from "../../Permissions/permissionsThunks";
import {
  createRole,
  fetchPermssionforpecificrole,
  updateRole,
} from "../RolesThunks";
import { clearPermissionRoles } from "../RolesSlice";
import SuccessAlert from "../../../globalComponents/Alerts/SuccessAlert";
import ErrorAlert from "../../../globalComponents/Alerts/ErrorAlert";

function RoleForm({
  mode = "create",
  initialData = null,
  onSuccess,
  onCancel,
}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Get permissions from permissions reducer
  const { screenPermissions = [], status: permissionsStatus } = useSelector(
    (state) => state.permissionsReducer
  );

  console.log("====================================");
  console.log("screenPermissions all", screenPermissions);
  console.log("====================================");
  // Get roles state including permissionRoles
  const {
    permissionRoles = [],
    status: rolesStatus,
    error: rolesError,
  } = useSelector((state) => state.rolesReducer);

  // Loading states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [permissionSearchTerm, setPermissionSearchTerm] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingRolePermissions, setIsLoadingRolePermissions] = useState(false);
  const [isPermissionDropdownOpen, setIsPermissionDropdownOpen] = useState(false);
  const [existingPermissionsIds, setExistingPermissionsIds] = useState([]);

  const isEditMode = mode === "edit";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
    getValues,
    trigger,
  } = useForm({
    defaultValues: {
      roleName: "",
    },
  });

  // Refs
  const permissionDropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const autoCloseTimeoutRef = useRef(null);

  // Memoized filtered permissions based on screenPermissions
  const filteredPermissions = useMemo(() => {
    if (!screenPermissions || screenPermissions.length === 0) return [];

    return screenPermissions.filter((permission) =>
      permission.displayName
        ?.toLowerCase()
        .includes(permissionSearchTerm.toLowerCase())
    );
  }, [screenPermissions, permissionSearchTerm]);

  // Calculate select all state
  const selectAllState = useMemo(() => {
    if (selectedPermissions.length === 0) return "none";
    if (selectedPermissions.length === screenPermissions.length) return "all";
    return "some";
  }, [selectedPermissions.length, screenPermissions.length]);

  // Fetch initial data
  useEffect(() => {
    // Always fetch screen permissions
    if (permissionsStatus === "idle") {
      dispatch(fetchScreensPermissions());
    }

    // Fetch role-specific permissions if in edit mode
    if (isEditMode && initialData?.roleId) {
      setIsLoadingRolePermissions(true);
      dispatch(fetchPermssionforpecificrole(initialData.roleId))
        .finally(() => {
          setIsLoadingRolePermissions(false);
        });
    }

    // Cleanup: Clear permission roles when component unmounts or mode changes
    return () => {
      dispatch(clearPermissionRoles());
    };
  }, [dispatch, isEditMode, initialData?.roleId, permissionsStatus]);

  // Initialize form with initialData when in edit mode
  useEffect(() => {
    if (isEditMode && initialData) {
      console.log("Initializing role form with data:", initialData);
      console.log("Screen permissions:", screenPermissions);
      console.log("InitialData permissions:", initialData.permissions);

      // Set role name
      setValue("roleName", initialData.roleName || "");

      // Reset all permissions to false first
      screenPermissions.forEach((permission) => {
        setValue(`permission_${permission.id}`, false);
      });

      // Check multiple sources for permissions in order of priority
      let permissionsToSet = [];

      // 1. First check if initialData.permissions exists
      if (initialData.permissions && Array.isArray(initialData.permissions) && initialData.permissions.length > 0) {
        console.log("Using permissions from initialData.permissions");
        permissionsToSet = initialData.permissions;
      }
      // 2. Check permissionRoles from Redux (from fetchPermssionforpecificrole)
      else if (permissionRoles && permissionRoles.permissions && Array.isArray(permissionRoles.permissions)) {
        console.log("Using permissions from permissionRoles.permissions");
        permissionsToSet = permissionRoles.permissions;
      }
      // 3. Check permissionRoles array directly
      else if (permissionRoles && Array.isArray(permissionRoles) && permissionRoles.length > 0) {
        console.log("Using permissions from permissionRoles array");
        permissionsToSet = permissionRoles;
      }
      // 4. Fallback to any other permission property in initialData
      else if (initialData.userPermissions || initialData.rolePermissions) {
        const permissions = initialData.userPermissions || initialData.rolePermissions;
        if (Array.isArray(permissions) && permissions.length > 0) {
          console.log("Using permissions from userPermissions/rolePermissions");
          permissionsToSet = permissions;
        }
      }

      console.log("Permissions to set (existing role permissions):", permissionsToSet);

      // Extract permission IDs from permissionsToSet
      const permissionIds = [];
      // Set the permissions from the selected source
      if (permissionsToSet.length > 0) {
        permissionsToSet.forEach((permission) => {
          // Handle different possible property names
          const permissionId = permission.id || permission.permissionId;
          if (permissionId) {
            setValue(`permission_${permissionId}`, true);
            permissionIds.push(permissionId);
            console.log(`Setting permission_${permissionId} to true for ${permission.displayName || "unknown"}`);
          }
        });
      } else {
        console.log("No existing permissions found for this role");
      }
      // Store existing permission IDs for reference
      setExistingPermissionsIds(permissionIds);
    }
  }, [isEditMode, initialData, screenPermissions, setValue, permissionRoles]);

  // Watch for permission changes to update selectedPermissions
  useEffect(() => {
    const subscription = watch((value) => {
      const selected = screenPermissions.filter(
        (permission) => value[`permission_${permission.id}`]
      );
      setSelectedPermissions(selected);
    });

    return () => subscription.unsubscribe();
  }, [screenPermissions, watch]);

  // Handle API response
  useEffect(() => {
    if (rolesStatus === "succeeded" && isSubmitting) {
      console.log(`Role ${isEditMode ? "updated" : "created"} successfully`);
      setIsSubmitting(false);
      setShowSuccessAlert(true);
      setShowErrorAlert(false); // Hide any existing error

      // Auto close after 3 seconds
      autoCloseTimeoutRef.current = setTimeout(() => {
        handleAutoClose();
      }, 3000);
    }

    if (rolesStatus === "failed" && isSubmitting) {
      console.error(
        `Failed to ${isEditMode ? "update" : "create"} role:`,
        rolesError
      );
      setIsSubmitting(false);
      setShowErrorAlert(true);
      setErrorMessage(rolesError || t("operationFailed"));
    }
  }, [rolesStatus, rolesError, isSubmitting, isEditMode, t]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autoCloseTimeoutRef.current) {
        clearTimeout(autoCloseTimeoutRef.current);
      }
    };
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        permissionDropdownRef.current &&
        !permissionDropdownRef.current.contains(event.target)
      ) {
        setIsPermissionDropdownOpen(false);
        setPermissionSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleAutoClose = () => {
    console.log("Auto closing popup and alert...");
    setShowSuccessAlert(false);
    reset();
    setSelectedPermissions([]);
    setExistingPermissionsIds([]);
    setIsPermissionDropdownOpen(false);
    setPermissionSearchTerm("");
    dispatch(clearPermissionRoles());
    if (onSuccess) {
      onSuccess();
    }
  };

  const handleErrorAlertClose = () => {
    setShowErrorAlert(false);
    setErrorMessage("");
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setShowSuccessAlert(false);
      setShowErrorAlert(false);
      setErrorMessage("");

      if (autoCloseTimeoutRef.current) {
        clearTimeout(autoCloseTimeoutRef.current);
      }

      const permissionIds = Object.entries(data)
        .filter(
          ([key, value]) => key.startsWith("permission_") && value === true
        )
        .map(([key]) => key.replace("permission_", ""));

      const roleName = data.roleName.trim();
      if (!roleName) {
        setShowErrorAlert(true);
        setErrorMessage(t("roleNameRequired"));
        setIsSubmitting(false);
        return;
      }
      
      // Prevent role names that start with space
      if (data.roleName.startsWith(' ')) {
        setShowErrorAlert(true);
        setErrorMessage(t("roleNameCannotStartWithSpace"));
        setIsSubmitting(false);
        return;
      }

      // Validate at least one permission is selected
      if (permissionIds.length === 0) {
        setShowErrorAlert(true);
        setErrorMessage(t("atLeastOnePermissionRequired"));
        setIsSubmitting(false);
        return;
      }

      // Include roleName in formattedData
      const formattedData = {
        roleName: roleName,
        permissionIds,
      };

      // Include roleId in edit mode
      if (isEditMode && initialData?.roleId) {
        formattedData.roleId = initialData.roleId;
      }

      console.log(
        `${isEditMode ? "Updating" : "Creating"} role with data:`,
        formattedData
      );

      // Dispatch the appropriate action based on mode
      const result = await dispatch(
        isEditMode ? updateRole(formattedData) : createRole(formattedData)
      ).unwrap();

      console.log(
        `Role ${isEditMode ? "updated" : "created"} successfully:`,
        result
      );
    } catch (error) {
      console.error(
        `Failed to ${isEditMode ? "update" : "create"} role:`,
        error
      );
      setIsSubmitting(false);
      setShowErrorAlert(true);
      setErrorMessage(error.message || t("operationFailed"));
    }
  };

  // Handle role name change with real-time validation
  const handleRoleNameChange = (e) => {
    const value = e.target.value;
    
    // Prevent leading spaces
    if (value.startsWith(' ')) {
      // Remove leading spaces
      const trimmedValue = value.trimStart();
      setValue("roleName", trimmedValue);
      
      // Trigger validation to clear any error
      setTimeout(() => {
        trigger("roleName");
      }, 0);
      return;
    }
    // Allow normal input
    setValue("roleName", value);
    // Trigger validation for real-time feedback
    setTimeout(() => {
      trigger("roleName");
    }, 0);
  };

  const handleReset = () => {
    if (autoCloseTimeoutRef.current) {
      clearTimeout(autoCloseTimeoutRef.current);
    }

    if (isEditMode && initialData) {
      // Reset to initial data in edit mode
      setValue("roleName", initialData.roleName || "");

      // Reset permissions based on existing permissions
      screenPermissions.forEach((permission) => {
        const wasSelected = existingPermissionsIds.includes(permission.id);
        setValue(`permission_${permission.id}`, wasSelected);
      });
    } else {
      // Reset to empty in create mode
      reset();
      setSelectedPermissions([]);
      setExistingPermissionsIds([]);
    }

    setIsPermissionDropdownOpen(false);
    setPermissionSearchTerm("");
    setShowSuccessAlert(false);
    setShowErrorAlert(false);
    setErrorMessage("");
  };

  const handleCancel = () => {
    if (autoCloseTimeoutRef.current) {
      clearTimeout(autoCloseTimeoutRef.current);
    }

    reset();
    setSelectedPermissions([]);
    setExistingPermissionsIds([]);
    setIsPermissionDropdownOpen(false);
    setPermissionSearchTerm("");
    setShowSuccessAlert(false);
    setShowErrorAlert(false);
    setErrorMessage("");
    dispatch(clearPermissionRoles());
    if (onCancel) {
      onCancel();
    }
  };

  const handleSuccessAlertClose = () => {
    if (autoCloseTimeoutRef.current) {
      clearTimeout(autoCloseTimeoutRef.current);
    }

    setShowSuccessAlert(false);
  };

  const handlePermissionChange = (permissionId, isChecked) => {
    setValue(`permission_${permissionId}`, isChecked);
  };

  const removePermission = (permissionId) => {
    setValue(`permission_${permissionId}`, false);
  };

  const handleSelectAll = () => {
    const permissionsToSelect = permissionSearchTerm
      ? filteredPermissions
      : screenPermissions;
    const allChecked = permissionsToSelect.every((permission) =>
      getValues(`permission_${permission.id}`)
    );

    permissionsToSelect.forEach((permission) => {
      setValue(`permission_${permission.id}`, !allChecked);
    });
  };

  const handleClearAll = () => {
    screenPermissions.forEach((permission) => {
      setValue(`permission_${permission.id}`, false);
    });
  };

  const handleSearchChange = (e) => {
    setPermissionSearchTerm(e.target.value);
  };

  const clearSearch = () => {
    setPermissionSearchTerm("");
    searchInputRef.current?.focus();
  };

  const getSelectAllIcon = () => {
    switch (selectAllState) {
      case "all":
        return "✓";
      case "some":
        return "-";
      default:
        return "";
    }
  };

  const isLoading = permissionsStatus === "loading" || isLoadingRolePermissions;

  // Function to check if a permission is an existing permission for the role (in edit mode)
  const isExistingPermission = (permissionId) => {
    if (!isEditMode) return false;
    return existingPermissionsIds.includes(permissionId);
  };

  // Get permission label by id
  const getPermissionLabel = (id) => {
    const permission = screenPermissions.find(
      (permission) => permission.id === id
    );
    return permission ? permission.displayName : id;
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Success Alert */}
      {showSuccessAlert && (
        <SuccessAlert
          show={showSuccessAlert}
          onClose={handleSuccessAlertClose}
          title={t("success")}
          message={
            isEditMode ? t("roleUpdatedSuccess") : t("roleCreatedSuccess")
          }
          autoHide={true}
          duration={3000}
        />
      )}

      {/* Error Alert */}
      {showErrorAlert && (
        <ErrorAlert
          show={showErrorAlert}
          onClose={handleErrorAlertClose}
          title={t("error")}
          message={errorMessage}
        />
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {isEditMode ? t("updateRole") : t("createRole")}
        </h2>
        <p className="text-lg text-gray-600">
          {isEditMode ? t("updateRoleDescription") : t("createRoleDescription")}
        </p>
        {isEditMode && selectedPermissions.length > 0 && (
          <div className="mt-2 text-sm text-green-600">
            {t("roleHasRoles", { count: selectedPermissions.length })}
          </div>
        )}
      </div>

      {/* Form Container */}
      <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Role Section */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <Shield className="w-4 h-4 text-blue-600" />
              </span>
              {t("roleInformation")}
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="roleName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t("roleName")} <span className="text-red-500">*</span>
                </label>
                <input
                  id="roleName"
                  type="text"
                  placeholder={t("roleNamePlaceholder")}
                  {...register("roleName", {
                    required: t("roleNameRequired"),
                    minLength: {
                      value: 2,
                      message: t("roleNameMinLength"),
                    },
                    maxLength: {
                      value: 50,
                      message: t("roleNameMaxLength"),
                    },
                    pattern: {
                      // Prevents starting with whitespace
                      value: /^\S.*$/, 
                      message: t("roleNameCannotStartWithSpace"),
                    },
                    validate: {
                      noOnlySpaces: (value) => 
                        value.trim().length > 0 || t("roleNameCannotBeOnlySpaces"),
                    },
                  })}
                  disabled={isEditMode}
                  onChange={handleRoleNameChange}
                  onBlur={() => trigger("roleName")}
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
                    errors.roleName
                      ? "border-red-300 bg-red-50"
                      : isEditMode
                      ? "border-gray-300 bg-gray-100 cursor-not-allowed"
                      : "border-gray-300 hover:border-gray-400 focus:border-blue-500"
                  }`}
                />
                {errors.roleName && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.roleName.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Permissions Section */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <CheckCircle className="w-4 h-4 text-green-600" />
              </span>
              {t("screenAccessPermissions")}
            </h3>

            {/* Selected Permissions Display */}
            {selectedPermissions.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    {t("selectedPermissionsCount")} (
                    {selectedPermissions.length})
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAll}
                      disabled={isLoading || screenPermissions.length === 0}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 disabled:bg-gray-100 disabled:text-gray-400 transition-colors flex items-center gap-1"
                      title="Toggle all permissions"
                    >
                      <span className="w-4 h-4 flex items-center justify-center">
                        {getSelectAllIcon()}
                      </span>
                      {selectAllState === "all"
                        ? t("deselectAll")
                        : t("selectAll")}
                    </button>
                    <button
                      type="button"
                      onClick={handleClearAll}
                      disabled={isLoading || selectedPermissions.length === 0}
                      className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 disabled:bg-gray-100 disabled:text-gray-400 transition-colors"
                    >
                      {t("clearAll")}
                    </button>
                  </div>
                </div>
                {/* <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg bg-white min-h-[3rem]">
                  {selectedPermissions.map((permission) => {
                    const isExisting = isExistingPermission(permission.id);
                    return (
                      <span
                        key={permission.id}
                        className={`inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-full group ${
                          isExisting
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {permission.displayName}
                        {isExisting && (
                          <span
                            className="text-xs ml-1 text-green-600"
                            title="Existing permission"
                          >
                            (E)
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => removePermission(permission.id)}
                          className="ml-1 hover:text-blue-600 focus:outline-none opacity-70 group-hover:opacity-100 transition-opacity"
                          title="Remove permission"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div> */}
              </div>
            )}

            {/* Permissions Multi Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("permissions")} <span className="text-red-500">*</span>
                {isEditMode && selectedPermissions.length > 0 && (
                  <span className="text-xs text-green-600 ml-2">
                    ({selectedPermissions.length} {t("selected")})
                  </span>
                )}
              </label>

              {/* Permission Search Input */}
              <div className="relative" ref={permissionDropdownRef}>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={permissionSearchTerm}
                  onChange={handleSearchChange}
                  onFocus={() => setIsPermissionDropdownOpen(true)}
                  placeholder={t("searchPermissions")}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white hover:border-gray-400 focus:border-blue-500"
                />
                {permissionSearchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
                  >
                    <X className="h-4 w-4 text-gray-400" />
                  </button>
                )}

                {/* Permission Dropdown */}
                {isPermissionDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredPermissions.length > 0 ? (
                      <>
                        <div className="sticky top-0 bg-white border-b border-gray-200 px-3 py-2">
                          <div className="flex justify-between items-center text-xs">
                            <button
                              type="button"
                              onClick={handleSelectAll}
                              className="text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50 transition-colors flex items-center gap-1"
                            >
                              <span className="w-4 h-4 flex items-center justify-center">
                                {getSelectAllIcon()}
                              </span>
                              {selectAllState === "all"
                                ? t("deselectAllInView")
                                : t("selectAllInView")}
                            </button>
                            {permissionSearchTerm &&
                              filteredPermissions.length > 0 && (
                                <span className="text-gray-500">
                                  {filteredPermissions.length}
                                  {t("resultsFound")}
                                </span>
                              )}
                          </div>
                        </div>
                        {filteredPermissions.map((permission) => {
                          const isChecked = getValues(
                            `permission_${permission.id}`
                          );
                          const isExisting = isExistingPermission(
                            permission.id
                          );

                          return (
                            <div
                              key={permission.id}
                              className={`flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer ${
                                isChecked ? "bg-blue-50" : ""
                              }`}
                              onClick={() =>
                                handlePermissionChange(
                                  permission.id,
                                  !isChecked
                                )
                              }
                            >
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  readOnly
                                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                                />
                                <div className="flex items-center">
                                  <span className="text-sm font-medium text-gray-700">
                                    {permission.displayName}
                                  </span>
                                  {isExisting && isEditMode && (
                                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                      Existing
                                    </span>
                                  )}
                                </div>
                              </div>
                              {isChecked && (
                                <Check className="h-4 w-4 text-blue-600" />
                              )}
                            </div>
                          );
                        })}
                      </>
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        {t("noPermissionsFound")} {permissionSearchTerm}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <p className="mt-1 text-xs text-gray-500">
                {t("permissionsSelectionHint")} {selectedPermissions.length} /{" "}
                {screenPermissions.length}
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={
                isSubmitting ||
                rolesStatus === "loading" ||
                screenPermissions.length === 0
              }
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
            >
              {isSubmitting || rolesStatus === "loading" ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {isEditMode ? t("updatingRole") : t("creatingRole")}
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {isEditMode ? t("updateRole") : t("createRole")}
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting || rolesStatus === "loading"}
              className="flex-none bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {t("reset")}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting || rolesStatus === "loading"}
              className="flex-none bg-red-200 hover:bg-red-300 disabled:bg-red-100 text-red-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              {t("cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RoleForm;