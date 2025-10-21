/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Shield,
  CheckCircle,
  Loader2,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
// import { fetchScreensPermissions } from "./permissionsThunks";
import { createNewRole } from "../../services/apiServices";

function ScreenPermissions() {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { screenPermissions = [] } = useSelector(
    (state) => state.permissionsReducer
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // useEffect(() => {
  //   dispatch(fetchScreensPermissions());
  // }, [dispatch]);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    const permissionIds = Object.entries(data)
    .filter(([key, value]) => key.startsWith("permission_") && value === true)
    .map(([key]) => key.replace("permission_", ""));
    
    const formattedData = {
      roleName: data.roleName,
      permissionIds,
    };
    
    console.log("Data to send to backend:", formattedData);
    
    // Simulate API call
    setTimeout(() => {
      console.log("Permissions assigned successfully!");
      setIsSubmitting(false);
      reset();
    }, 1000);
    dispatch(createNewRole(data))
  };

  const handleReset = () => reset();

  const handleCancel = () => {
    reset();
    console.log("Form canceled");
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Assign Screen Permissions
        </h2>
        <p className="text-lg text-gray-600">
          Select the role and choose which screens it can access.
        </p>
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
              Role Information
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="roleName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Role Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="roleName"
                  type="text"
                  placeholder="Enter role name (e.g., Admin, Editor)"
                  {...register("roleName", { required: "Role name is required" })}
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm bg-white transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.roleName
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
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
              Screen Access Permissions
            </h3>

            <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-white">
              {screenPermissions.length > 0 ? (
                screenPermissions.map((ele) => (
                  <div
                    key={ele.id}
                    className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md transition"
                  >
                    <input
                      type="checkbox"
                      id={`permission_${ele.id}`}
                      {...register(`permission_${ele.id}`)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`permission_${ele.id}`}
                      className="text-sm text-gray-700 cursor-pointer"
                    >
                      {ele.displayName}
                    </label>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">{t("permissions.loading")}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Saving Permissions...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Save Permissions
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
              Reset
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="flex-none bg-red-200 hover:bg-red-300 disabled:bg-red-100 text-red-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ScreenPermissions;
