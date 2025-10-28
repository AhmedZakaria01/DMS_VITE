// // // // // // /* eslint-disable react/prop-types */
// // // // // // import { useEffect, useState } from "react";
// // // // // // import { useDispatch, useSelector } from "react-redux";
// // // // // // import { useForm } from "react-hook-form";
// // // // // // import { useTranslation } from "react-i18next";
// // // // // // import {
// // // // // //   Shield,
// // // // // //   CheckCircle,
// // // // // //   Loader2,
// // // // // //   AlertCircle,
// // // // // //   RotateCcw,
// // // // // // } from "lucide-react";
// // // // // // import { fetchScreensPermissions } from "./permissionsThunks";
// // // // // // import { createNewRole } from "../../services/apiServices";

// // // // // // function ScreenPermissions() {
// // // // // //   const dispatch = useDispatch();
// // // // // //   const { t } = useTranslation();
// // // // // //   const { screenPermissions = [] } = useSelector(
// // // // // //     (state) => state.permissionsReducer
// // // // // //   );

// // // // // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // // // // //   const {
// // // // // //     register,
// // // // // //     handleSubmit,
// // // // // //     reset,
// // // // // //     formState: { errors },
// // // // // //   } = useForm();

// // // // // //   useEffect(() => {
// // // // // //     dispatch(fetchScreensPermissions());
// // // // // //   }, [dispatch]);

// // // // // //   const onSubmit = async (data) => {
// // // // // //     setIsSubmitting(true);
    
// // // // // //     const permissionIds = Object.entries(data)
// // // // // //     .filter(([key, value]) => key.startsWith("permission_") && value === true)
// // // // // //     .map(([key]) => key.replace("permission_", ""));
    
// // // // // //     const formattedData = {
// // // // // //       roleName: data.roleName,
// // // // // //       permissionIds,
// // // // // //     };
    
// // // // // //     console.log("Data to send to backend:", formattedData);
    
// // // // // //     // Simulate API call
// // // // // //     setTimeout(() => {
// // // // // //       console.log("Permissions assigned successfully!");
// // // // // //       setIsSubmitting(false);
// // // // // //       reset();
// // // // // //     }, 1000);
// // // // // //     dispatch(createNewRole(data))
// // // // // //   };

// // // // // //   const handleReset = () => reset();

// // // // // //   const handleCancel = () => {
// // // // // //     reset();
// // // // // //     console.log("Form canceled");
// // // // // //   };

// // // // // //   return (
// // // // // //     <div className="max-w-lg mx-auto">
// // // // // //       {/* Header */}
// // // // // //       <div className="text-center mb-8">
// // // // // //         <h2 className="text-3xl font-bold text-gray-900 mb-4">
// // // // // //           Assign Screen Permissions
// // // // // //         </h2>
// // // // // //         <p className="text-lg text-gray-600">
// // // // // //           Select the role and choose which screens it can access.
// // // // // //         </p>
// // // // // //       </div>

// // // // // //       {/* Form Container */}
// // // // // //       <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
// // // // // //         <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
// // // // // //           {/* Role Section */}
// // // // // //           <div>
// // // // // //             <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
// // // // // //               <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
// // // // // //                 <Shield className="w-4 h-4 text-blue-600" />
// // // // // //               </span>
// // // // // //               Role Information
// // // // // //             </h3>

// // // // // //             <div className="space-y-4">
// // // // // //               <div>
// // // // // //                 <label
// // // // // //                   htmlFor="roleName"
// // // // // //                   className="block text-sm font-medium text-gray-700 mb-2"
// // // // // //                 >
// // // // // //                   Role Name <span className="text-red-500">*</span>
// // // // // //                 </label>
// // // // // //                 <input
// // // // // //                   id="roleName"
// // // // // //                   type="text"
// // // // // //                   placeholder="Enter role name (e.g., Admin, Editor)"
// // // // // //                   {...register("roleName", { required: "Role name is required" })}
// // // // // //                   className={`w-full px-4 py-3 border rounded-lg shadow-sm bg-white transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
// // // // // //                     errors.roleName
// // // // // //                       ? "border-red-300 bg-red-50"
// // // // // //                       : "border-gray-300 hover:border-gray-400"
// // // // // //                   }`}
// // // // // //                 />
// // // // // //                 {errors.roleName && (
// // // // // //                   <p className="mt-1 text-sm text-red-600 flex items-center">
// // // // // //                     <AlertCircle className="w-4 h-4 mr-1" />
// // // // // //                     {errors.roleName.message}
// // // // // //                   </p>
// // // // // //                 )}
// // // // // //               </div>
// // // // // //             </div>
// // // // // //           </div>

// // // // // //           {/* Permissions Section */}
// // // // // //           <div>
// // // // // //             <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
// // // // // //               <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
// // // // // //                 <CheckCircle className="w-4 h-4 text-green-600" />
// // // // // //               </span>
// // // // // //               Screen Access Permissions
// // // // // //             </h3>

// // // // // //             <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-white">
// // // // // //               {screenPermissions.length > 0 ? (
// // // // // //                 screenPermissions.map((ele) => (
// // // // // //                   <div
// // // // // //                     key={ele.id}
// // // // // //                     className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md transition"
// // // // // //                   >
// // // // // //                     <input
// // // // // //                       type="checkbox"
// // // // // //                       id={`permission_${ele.id}`}
// // // // // //                       {...register(`permission_${ele.id}`)}
// // // // // //                       className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
// // // // // //                     />
// // // // // //                     <label
// // // // // //                       htmlFor={`permission_${ele.id}`}
// // // // // //                       className="text-sm text-gray-700 cursor-pointer"
// // // // // //                     >
// // // // // //                       {ele.displayName}
// // // // // //                     </label>
// // // // // //                   </div>
// // // // // //                 ))
// // // // // //               ) : (
// // // // // //                 <p className="text-gray-500 text-sm">{t("permissions.loading")}</p>
// // // // // //               )}
// // // // // //             </div>
// // // // // //           </div>

// // // // // //           {/* Form Actions */}
// // // // // //           <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
// // // // // //             <button
// // // // // //               type="submit"
// // // // // //               disabled={isSubmitting}
// // // // // //               className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
// // // // // //             >
// // // // // //               {isSubmitting ? (
// // // // // //                 <>
// // // // // //                   <Loader2 className="w-5 h-5 mr-2 animate-spin" />
// // // // // //                   Saving Permissions...
// // // // // //                 </>
// // // // // //               ) : (
// // // // // //                 <>
// // // // // //                   <CheckCircle className="w-5 h-5 mr-2" />
// // // // // //                   Save Permissions
// // // // // //                 </>
// // // // // //               )}
// // // // // //             </button>

// // // // // //             <button
// // // // // //               type="button"
// // // // // //               onClick={handleReset}
// // // // // //               disabled={isSubmitting}
// // // // // //               className="flex-none bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center"
// // // // // //             >
// // // // // //               <RotateCcw className="w-4 h-4 mr-2" />
// // // // // //               {t("reset")}
// // // // // //             </button>

// // // // // //             <button
// // // // // //               type="button"
// // // // // //               onClick={handleCancel}
// // // // // //               disabled={isSubmitting}
// // // // // //               className="flex-none bg-red-200 hover:bg-red-300 disabled:bg-red-100 text-red-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
// // // // // //             >
// // // // // //               {t("cancel")}
// // // // // //             </button>
// // // // // //           </div>
// // // // // //         </form>
// // // // // //       </div>
// // // // // //     </div>
// // // // // //   );
// // // // // // }

// // // // // // export default ScreenPermissions;


// // // // // /* eslint-disable react/prop-types */
// // // // // import { useEffect, useState } from "react";
// // // // // import { useDispatch, useSelector } from "react-redux";
// // // // // import { useForm } from "react-hook-form";
// // // // // import { useTranslation } from "react-i18next";
// // // // // import {
// // // // //   Shield,
// // // // //   CheckCircle,
// // // // //   Loader2,
// // // // //   AlertCircle,
// // // // //   RotateCcw,
// // // // //   ChevronDown,
// // // // //   ChevronUp,
// // // // //   X,
// // // // // } from "lucide-react";
// // // // // import { fetchScreensPermissions } from "./permissionsThunks";
// // // // // import { createNewRole } from "../../services/apiServices";

// // // // // function ScreenPermissions({ onClose }) {
// // // // //   const dispatch = useDispatch();
// // // // //   const { t } = useTranslation();
// // // // //   const { screenPermissions = [] } = useSelector(
// // // // //     (state) => state.permissionsReducer
// // // // //   );

// // // // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // // // //   const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
// // // // //   const [selectedPermissions, setSelectedPermissions] = useState([]);
// // // // //   const {
// // // // //     register,
// // // // //     handleSubmit,
// // // // //     reset,
// // // // //     formState: { errors },
// // // // //     setValue,
// // // // //     watch,
// // // // //   } = useForm();

// // // // //   useEffect(() => {
// // // // //     dispatch(fetchScreensPermissions());
// // // // //   }, [dispatch]);

// // // // //   // Watch for permission changes to update selectedPermissions
// // // // //   const watchedPermissions = watch();
// // // // //   useEffect(() => {
// // // // //     const selected = screenPermissions.filter(
// // // // //       (permission) => watchedPermissions[`permission_${permission.id}`]
// // // // //     );
// // // // //     setSelectedPermissions(selected);
// // // // //   }, [watchedPermissions, screenPermissions]);

// // // // //   const onSubmit = async (data) => {
// // // // //     setIsSubmitting(true);
    
// // // // //     const permissionIds = Object.entries(data)
// // // // //     .filter(([key, value]) => key.startsWith("permission_") && value === true)
// // // // //     .map(([key]) => key.replace("permission_", ""));
    
// // // // //     const formattedData = {
// // // // //       roleName: data.roleName,
// // // // //       permissionIds,
// // // // //     };
    
// // // // //     console.log("Data to send to backend:", formattedData);
    
// // // // //     // Simulate API call
// // // // //     setTimeout(() => {
// // // // //       console.log("Permissions assigned successfully!");
// // // // //       setIsSubmitting(false);
// // // // //       reset();
// // // // //       setSelectedPermissions([]);
// // // // //       setIsPermissionsOpen(false);
// // // // //       if (onClose) onClose();
// // // // //     }, 1000);
// // // // //     dispatch(createNewRole(formattedData));
// // // // //   };

// // // // //   const handleReset = () => {
// // // // //     reset();
// // // // //     setSelectedPermissions([]);
// // // // //     setIsPermissionsOpen(false);
// // // // //   };

// // // // //   const handleCancel = () => {
// // // // //     reset();
// // // // //     setSelectedPermissions([]);
// // // // //     setIsPermissionsOpen(false);
// // // // //     if (onClose) {
// // // // //       onClose();
// // // // //     }
// // // // //     console.log("Form canceled and popup closed");
// // // // //   };

// // // // //   const togglePermissionsDropdown = () => {
// // // // //     setIsPermissionsOpen(!isPermissionsOpen);
// // // // //   };

// // // // //   const handlePermissionChange = (permissionId, isChecked) => {
// // // // //     setValue(`permission_${permissionId}`, isChecked);
// // // // //   };

// // // // //   const removePermission = (permissionId) => {
// // // // //     setValue(`permission_${permissionId}`, false);
// // // // //   };

// // // // //   const selectAllPermissions = () => {
// // // // //     screenPermissions.forEach(permission => {
// // // // //       setValue(`permission_${permission.id}`, true);
// // // // //     });
// // // // //   };

// // // // //   const clearAllPermissions = () => {
// // // // //     screenPermissions.forEach(permission => {
// // // // //       setValue(`permission_${permission.id}`, false);
// // // // //     });
// // // // //     setSelectedPermissions([]);
// // // // //   };

// // // // //   return (
// // // // //     <div className="max-w-lg mx-auto">
// // // // //       {/* Header */}
// // // // //       <div className="text-center mb-8">
// // // // //         <h2 className="text-3xl font-bold text-gray-900 mb-4">
// // // // //           Assign Screen Permissions
// // // // //         </h2>
// // // // //         <p className="text-lg text-gray-600">
// // // // //           Select the role and choose which screens it can access.
// // // // //         </p>
// // // // //       </div>

// // // // //       {/* Form Container */}
// // // // //       <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
// // // // //         <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
// // // // //           {/* Role Section */}
// // // // //           <div>
// // // // //             <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
// // // // //               <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
// // // // //                 <Shield className="w-4 h-4 text-blue-600" />
// // // // //               </span>
// // // // //               Role Information
// // // // //             </h3>

// // // // //             <div className="space-y-4">
// // // // //               <div>
// // // // //                 <label
// // // // //                   htmlFor="roleName"
// // // // //                   className="block text-sm font-medium text-gray-700 mb-2"
// // // // //                 >
// // // // //                   Role Name <span className="text-red-500">*</span>
// // // // //                 </label>
// // // // //                 <input
// // // // //                   id="roleName"
// // // // //                   type="text"
// // // // //                   placeholder="Enter role name (e.g., Admin, Editor)"
// // // // //                   {...register("roleName", { required: "Role name is required" })}
// // // // //                   className={`w-full px-4 py-3 border rounded-lg shadow-sm bg-white transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
// // // // //                     errors.roleName
// // // // //                       ? "border-red-300 bg-red-50"
// // // // //                       : "border-gray-300 hover:border-gray-400"
// // // // //                   }`}
// // // // //                 />
// // // // //                 {errors.roleName && (
// // // // //                   <p className="mt-1 text-sm text-red-600 flex items-center">
// // // // //                     <AlertCircle className="w-4 h-4 mr-1" />
// // // // //                     {errors.roleName.message}
// // // // //                   </p>
// // // // //                 )}
// // // // //               </div>
// // // // //             </div>
// // // // //           </div>

// // // // //           {/* Permissions Section */}
// // // // //           <div>
// // // // //             <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
// // // // //               <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
// // // // //                 <CheckCircle className="w-4 h-4 text-green-600" />
// // // // //               </span>
// // // // //               Screen Access Permissions
// // // // //             </h3>

// // // // //             {/* Selected Permissions Display */}
// // // // //             {selectedPermissions.length > 0 && (
// // // // //               <div className="mb-4">
// // // // //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// // // // //                   Selected Permissions ({selectedPermissions.length})
// // // // //                 </label>
// // // // //                 <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg bg-white">
// // // // //                   {selectedPermissions.map((permission) => (
// // // // //                     <span
// // // // //                       key={permission.id}
// // // // //                       className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
// // // // //                     >
// // // // //                       {permission.displayName}
// // // // //                       <button
// // // // //                         type="button"
// // // // //                         onClick={() => removePermission(permission.id)}
// // // // //                         className="ml-1 hover:text-blue-600 focus:outline-none"
// // // // //                       >
// // // // //                         <X className="w-3 h-3" />
// // // // //                       </button>
// // // // //                     </span>
// // // // //                   ))}
// // // // //                 </div>
// // // // //               </div>
// // // // //             )}

// // // // //             {/* Permissions Dropdown */}
// // // // //             <div className="space-y-2">
// // // // //               <div className="flex justify-between items-center mb-2">
// // // // //                 <label className="block text-sm font-medium text-gray-700">
// // // // //                   Select Permissions
// // // // //                 </label>
// // // // //                 <div className="flex gap-2">
// // // // //                   <button
// // // // //                     type="button"
// // // // //                     onClick={selectAllPermissions}
// // // // //                     className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
// // // // //                   >
// // // // //                     Select All
// // // // //                   </button>
// // // // //                   <button
// // // // //                     type="button"
// // // // //                     onClick={clearAllPermissions}
// // // // //                     className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
// // // // //                   >
// // // // //                     Clear All
// // // // //                   </button>
// // // // //                 </div>
// // // // //               </div>

// // // // //               <div className="relative">
// // // // //                 {/* Dropdown Trigger */}
// // // // //                 <button
// // // // //                   type="button"
// // // // //                   onClick={togglePermissionsDropdown}
// // // // //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
// // // // //                 >
// // // // //                   <span className="text-gray-700">
// // // // //                     {selectedPermissions.length > 0 
// // // // //                       ? `${selectedPermissions.length} permission(s) selected`
// // // // //                       : "Click to select permissions"
// // // // //                     }
// // // // //                   </span>
// // // // //                   {isPermissionsOpen ? (
// // // // //                     <ChevronUp className="w-5 h-5 text-gray-400" />
// // // // //                   ) : (
// // // // //                     <ChevronDown className="w-5 h-5 text-gray-400" />
// // // // //                   )}
// // // // //                 </button>

// // // // //                 {/* Dropdown Content */}
// // // // //                 {isPermissionsOpen && (
// // // // //                   <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
// // // // //                     <div className="p-2">
// // // // //                       {screenPermissions.length > 0 ? (
// // // // //                         screenPermissions.map((ele) => (
// // // // //                           <div
// // // // //                             key={ele.id}
// // // // //                             className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md transition cursor-pointer"
// // // // //                             onClick={() => {
// // // // //                               const isChecked = watchedPermissions[`permission_${ele.id}`];
// // // // //                               handlePermissionChange(ele.id, !isChecked);
// // // // //                             }}
// // // // //                           >
// // // // //                             <input
// // // // //                               type="checkbox"
// // // // //                               id={`permission_${ele.id}`}
// // // // //                               {...register(`permission_${ele.id}`)}
// // // // //                               className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
// // // // //                               onChange={(e) => {
// // // // //                                 handlePermissionChange(ele.id, e.target.checked);
// // // // //                               }}
// // // // //                             />
// // // // //                             <label
// // // // //                               htmlFor={`permission_${ele.id}`}
// // // // //                               className="text-sm text-gray-700 cursor-pointer flex-1"
// // // // //                             >
// // // // //                               {ele.displayName}
// // // // //                             </label>
// // // // //                           </div>
// // // // //                         ))
// // // // //                       ) : (
// // // // //                         <p className="text-gray-500 text-sm p-2">{t("permissions.loading")}</p>
// // // // //                       )}
// // // // //                     </div>
// // // // //                   </div>
// // // // //                 )}
// // // // //               </div>

// // // // //               <p className="text-xs text-gray-500 mt-1">
// // // // //                 Click the dropdown to view and select available permissions
// // // // //               </p>
// // // // //             </div>
// // // // //           </div>

// // // // //           {/* Form Actions */}
// // // // //           <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
// // // // //             <button
// // // // //               type="submit"
// // // // //               disabled={isSubmitting}
// // // // //               className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
// // // // //             >
// // // // //               {isSubmitting ? (
// // // // //                 <>
// // // // //                   <Loader2 className="w-5 h-5 mr-2 animate-spin" />
// // // // //                   Saving Permissions...
// // // // //                 </>
// // // // //               ) : (
// // // // //                 <>
// // // // //                   <CheckCircle className="w-5 h-5 mr-2" />
// // // // //                   Save Permissions
// // // // //                 </>
// // // // //               )}
// // // // //             </button>

// // // // //             <button
// // // // //               type="button"
// // // // //               onClick={handleReset}
// // // // //               disabled={isSubmitting}
// // // // //               className="flex-none bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center"
// // // // //             >
// // // // //               <RotateCcw className="w-4 h-4 mr-2" />
// // // // //               {t("reset")}
// // // // //             </button>

// // // // //             <button
// // // // //               type="button"
// // // // //               onClick={handleCancel}
// // // // //               disabled={isSubmitting}
// // // // //               className="flex-none bg-red-200 hover:bg-red-300 disabled:bg-red-100 text-red-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
// // // // //             >
// // // // //               {t("cancel")}
// // // // //             </button>
// // // // //           </div>
// // // // //         </form>
// // // // //       </div>
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // // export default ScreenPermissions;


// // // // /* eslint-disable react/prop-types */
// // // // import { useEffect, useState, useRef } from "react";
// // // // import { useDispatch, useSelector } from "react-redux";
// // // // import { useForm } from "react-hook-form";
// // // // import { useTranslation } from "react-i18next";
// // // // import {
// // // //   Shield,
// // // //   CheckCircle,
// // // //   Loader2,
// // // //   AlertCircle,
// // // //   RotateCcw,
// // // //   ChevronDown,
// // // //   ChevronUp,
// // // //   X,
// // // // } from "lucide-react";
// // // // import { fetchScreensPermissions } from "./permissionsThunks";
// // // // import { createNewRole } from "../../services/apiServices";

// // // // function ScreenPermissions({ onClose }) {
// // // //   const dispatch = useDispatch();
// // // //   const { t } = useTranslation();
// // // //   const { screenPermissions = [] } = useSelector(
// // // //     (state) => state.permissionsReducer
// // // //   );

// // // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // // //   const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
// // // //   const [selectedPermissions, setSelectedPermissions] = useState([]);
// // // //   const {
// // // //     register,
// // // //     handleSubmit,
// // // //     reset,
// // // //     formState: { errors },
// // // //     setValue,
// // // //     watch,
// // // //   } = useForm();

// // // //   // Ref for dropdown container
// // // //   const dropdownRef = useRef(null);

// // // //   useEffect(() => {
// // // //     dispatch(fetchScreensPermissions());
// // // //   }, [dispatch]);

// // // //   // Watch for permission changes to update selectedPermissions
// // // //   const watchedPermissions = watch();
// // // //   useEffect(() => {
// // // //     const selected = screenPermissions.filter(
// // // //       (permission) => watchedPermissions[`permission_${permission.id}`]
// // // //     );
// // // //     setSelectedPermissions(selected);
// // // //   }, [screenPermissions]);

// // // //   // Handle click outside to close dropdown
// // // //   useEffect(() => {
// // // //     const handleClickOutside = (event) => {
// // // //       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
// // // //         setIsPermissionsOpen(false);
// // // //       }
// // // //     };

// // // //     document.addEventListener("mousedown", handleClickOutside);
// // // //     return () => {
// // // //       document.removeEventListener("mousedown", handleClickOutside);
// // // //     };
// // // //   }, []);

// // // //   const onSubmit = async (data) => {
// // // //     setIsSubmitting(true);
    
// // // //     const permissionIds = Object.entries(data)
// // // //     .filter(([key, value]) => key.startsWith("permission_") && value === true)
// // // //     .map(([key]) => key.replace("permission_", ""));
    
// // // //     const formattedData = {
// // // //       roleName: data.roleName,
// // // //       permissionIds,
// // // //     };
    
// // // //     console.log("Data to send to backend:", formattedData);
    
// // // //     // Simulate API call
// // // //     setTimeout(() => {
// // // //       console.log("Permissions assigned successfully!");
// // // //       setIsSubmitting(false);
// // // //       reset();
// // // //       setSelectedPermissions([]);
// // // //       setIsPermissionsOpen(false);
// // // //       if (onClose) onClose();
// // // //     }, 1000);
// // // //     dispatch(createNewRole(formattedData));
// // // //   };

// // // //   const handleReset = () => {
// // // //     reset();
// // // //     setSelectedPermissions([]);
// // // //     setIsPermissionsOpen(false);
// // // //   };

// // // //   const handleCancel = () => {
// // // //     reset();
// // // //     setSelectedPermissions([]);
// // // //     setIsPermissionsOpen(false);
// // // //     if (onClose) {
// // // //       onClose();
// // // //     }
// // // //     console.log("Form canceled and popup closed");
// // // //   };

// // // //   const togglePermissionsDropdown = () => {
// // // //     setIsPermissionsOpen(!isPermissionsOpen);
// // // //   };

// // // //   const handlePermissionChange = (permissionId, isChecked) => {
// // // //     setValue(`permission_${permissionId}`, isChecked);
// // // //   };

// // // //   const removePermission = (permissionId) => {
// // // //     setValue(`permission_${permissionId}`, false);
// // // //   };

// // // //   const selectAllPermissions = () => {
// // // //     screenPermissions.forEach(permission => {
// // // //       setValue(`permission_${permission.id}`, true);
// // // //     });
// // // //   };

// // // //   const clearAllPermissions = () => {
// // // //     screenPermissions.forEach(permission => {
// // // //       setValue(`permission_${permission.id}`, false);
// // // //     });
// // // //     setSelectedPermissions([]);
// // // //   };

// // // //   return (
// // // //     <div className="max-w-lg mx-auto">
// // // //       {/* Header */}
// // // //       <div className="text-center mb-8">
// // // //         <h2 className="text-3xl font-bold text-gray-900 mb-4">
// // // //           Assign Screen Permissions
// // // //         </h2>
// // // //         <p className="text-lg text-gray-600">
// // // //           Select the role and choose which screens it can access.
// // // //         </p>
// // // //       </div>

// // // //       {/* Form Container */}
// // // //       <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
// // // //         <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
// // // //           {/* Role Section */}
// // // //           <div>
// // // //             <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
// // // //               <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
// // // //                 <Shield className="w-4 h-4 text-blue-600" />
// // // //               </span>
// // // //               Role Information
// // // //             </h3>

// // // //             <div className="space-y-4">
// // // //               <div>
// // // //                 <label
// // // //                   htmlFor="roleName"
// // // //                   className="block text-sm font-medium text-gray-700 mb-2"
// // // //                 >
// // // //                   Role Name <span className="text-red-500">*</span>
// // // //                 </label>
// // // //                 <input
// // // //                   id="roleName"
// // // //                   type="text"
// // // //                   placeholder="Enter role name (e.g., Admin, Editor)"
// // // //                   {...register("roleName", { required: "Role name is required" })}
// // // //                   className={`w-full px-4 py-3 border rounded-lg shadow-sm bg-white transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
// // // //                     errors.roleName
// // // //                       ? "border-red-300 bg-red-50"
// // // //                       : "border-gray-300 hover:border-gray-400"
// // // //                   }`}
// // // //                 />
// // // //                 {errors.roleName && (
// // // //                   <p className="mt-1 text-sm text-red-600 flex items-center">
// // // //                     <AlertCircle className="w-4 h-4 mr-1" />
// // // //                     {errors.roleName.message}
// // // //                   </p>
// // // //                 )}
// // // //               </div>
// // // //             </div>
// // // //           </div>

// // // //           {/* Permissions Section */}
// // // //           <div>
// // // //             <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
// // // //               <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
// // // //                 <CheckCircle className="w-4 h-4 text-green-600" />
// // // //               </span>
// // // //               Screen Access Permissions
// // // //             </h3>

// // // //             {/* Selected Permissions Display */}
// // // //             {selectedPermissions.length > 0 && (
// // // //               <div className="mb-4">
// // // //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// // // //                   Selected Permissions ({selectedPermissions.length})
// // // //                 </label>
// // // //                 <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg bg-white">
// // // //                   {selectedPermissions.map((permission) => (
// // // //                     <span
// // // //                       key={permission.id}
// // // //                       className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
// // // //                     >
// // // //                       {permission.displayName}
// // // //                       <button
// // // //                         type="button"
// // // //                         onClick={() => removePermission(permission.id)}
// // // //                         className="ml-1 hover:text-blue-600 focus:outline-none"
// // // //                       >
// // // //                         <X className="w-3 h-3" />
// // // //                       </button>
// // // //                     </span>
// // // //                   ))}
// // // //                 </div>
// // // //               </div>
// // // //             )}

// // // //             {/* Permissions Dropdown */}
// // // //             <div className="space-y-2" ref={dropdownRef}>
// // // //               <div className="flex justify-between items-center mb-2">
// // // //                 <label className="block text-sm font-medium text-gray-700">
// // // //                   Select Permissions
// // // //                 </label>
// // // //                 <div className="flex gap-2">
// // // //                   <button
// // // //                     type="button"
// // // //                     onClick={selectAllPermissions}
// // // //                     className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
// // // //                   >
// // // //                     Select All
// // // //                   </button>
// // // //                   <button
// // // //                     type="button"
// // // //                     onClick={clearAllPermissions}
// // // //                     className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
// // // //                   >
// // // //                     Clear All
// // // //                   </button>
// // // //                 </div>
// // // //               </div>

// // // //               <div className="relative">
// // // //                 {/* Dropdown Trigger */}
// // // //                 <button
// // // //                   type="button"
// // // //                   onClick={togglePermissionsDropdown}
// // // //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
// // // //                 >
// // // //                   <span className="text-gray-700">
// // // //                     {selectedPermissions.length > 0 
// // // //                       ? `${selectedPermissions.length} permission(s) selected`
// // // //                       : "Click to select permissions"
// // // //                     }
// // // //                   </span>
// // // //                   {isPermissionsOpen ? (
// // // //                     <ChevronUp className="w-5 h-5 text-gray-400" />
// // // //                   ) : (
// // // //                     <ChevronDown className="w-5 h-5 text-gray-400" />
// // // //                   )}
// // // //                 </button>

// // // //                 {/* Dropdown Content */}
// // // //                 {isPermissionsOpen && (
// // // //                   <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
// // // //                     <div className="p-2">
// // // //                       {screenPermissions.length > 0 ? (
// // // //                         screenPermissions.map((ele) => (
// // // //                           <div
// // // //                             key={ele.id}
// // // //                             className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md transition cursor-pointer"
// // // //                             onClick={() => {
// // // //                               const isChecked = watchedPermissions[`permission_${ele.id}`];
// // // //                               handlePermissionChange(ele.id, !isChecked);
// // // //                             }}
// // // //                           >
// // // //                             <input
// // // //                               type="checkbox"
// // // //                               id={`permission_${ele.id}`}
// // // //                               {...register(`permission_${ele.id}`)}
// // // //                               className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
// // // //                               onChange={(e) => {
// // // //                                 handlePermissionChange(ele.id, e.target.checked);
// // // //                               }}
// // // //                             />
// // // //                             <label
// // // //                               htmlFor={`permission_${ele.id}`}
// // // //                               className="text-sm text-gray-700 cursor-pointer flex-1"
// // // //                             >
// // // //                               {ele.displayName}
// // // //                             </label>
// // // //                           </div>
// // // //                         ))
// // // //                       ) : (
// // // //                         <p className="text-gray-500 text-sm p-2">{t("permissions.loading")}</p>
// // // //                       )}
// // // //                     </div>
// // // //                   </div>
// // // //                 )}
// // // //               </div>

// // // //               <p className="text-xs text-gray-500 mt-1">
// // // //                 Click the dropdown to view and select available permissions
// // // //               </p>
// // // //             </div>
// // // //           </div>

// // // //           {/* Form Actions */}
// // // //           <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
// // // //             <button
// // // //               type="submit"
// // // //               disabled={isSubmitting}
// // // //               className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
// // // //             >
// // // //               {isSubmitting ? (
// // // //                 <>
// // // //                   <Loader2 className="w-5 h-5 mr-2 animate-spin" />
// // // //                   Saving Permissions...
// // // //                 </>
// // // //               ) : (
// // // //                 <>
// // // //                   <CheckCircle className="w-5 h-5 mr-2" />
// // // //                   Save Permissions
// // // //                 </>
// // // //               )}
// // // //             </button>

// // // //             <button
// // // //               type="button"
// // // //               onClick={handleReset}
// // // //               disabled={isSubmitting}
// // // //               className="flex-none bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center"
// // // //             >
// // // //               <RotateCcw className="w-4 h-4 mr-2" />
// // // //               {t("reset")}
// // // //             </button>

// // // //             <button
// // // //               type="button"
// // // //               onClick={handleCancel}
// // // //               disabled={isSubmitting}
// // // //               className="flex-none bg-red-200 hover:bg-red-300 disabled:bg-red-100 text-red-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
// // // //             >
// // // //               {t("cancel")}
// // // //             </button>
// // // //           </div>
// // // //         </form>
// // // //       </div>
// // // //     </div>
// // // //   );
// // // // }

// // // // export default ScreenPermissions;

// // // /* eslint-disable react/prop-types */
// // // import { useEffect, useState, useRef } from "react";
// // // import { useDispatch, useSelector } from "react-redux";
// // // import { useForm } from "react-hook-form";
// // // import { useTranslation } from "react-i18next";
// // // import {
// // //   Shield,
// // //   CheckCircle,
// // //   Loader2,
// // //   AlertCircle,
// // //   RotateCcw,
// // //   ChevronDown,
// // //   ChevronUp,
// // //   X,
// // // } from "lucide-react";
// // // import { fetchScreensPermissions } from "./permissionsThunks";
// // // import { createRole } from "../Roles/RolesThunks";
// // // import SuccessAlert from "../../globalComponents/Alerts/SuccessAlert";

// // // function ScreenPermissions({ onClose }) {
// // //   const dispatch = useDispatch();
// // //   const { t } = useTranslation();
// // //   const { screenPermissions = [] } = useSelector(
// // //     (state) => state.permissionsReducer
// // //   );
  
// // //   // Add selector for roles state to track creation status
// // //   const { status: createRoleStatus, error: createRoleError } = useSelector(
// // //     (state) => state.rolesReducer
// // //   );

// // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // //   const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
// // //   const [selectedPermissions, setSelectedPermissions] = useState([]);
// // //   // Alert states
// // //     const [showSuccessAlert, setShowSuccessAlert] = useState(false);
// // //   const {
// // //     register,
// // //     handleSubmit,
// // //     reset,
// // //     formState: { errors },
// // //     setValue,
// // //     watch,
// // //   } = useForm();

// // //   // Ref for dropdown container
// // //   const dropdownRef = useRef(null);

// // //   useEffect(() => {
// // //     dispatch(fetchScreensPermissions());
// // //   }, [dispatch]);

// // //   // Watch for permission changes to update selectedPermissions
// // //   const watchedPermissions = watch();
// // //   useEffect(() => {
// // //     const selected = screenPermissions.filter(
// // //       (permission) => watchedPermissions[`permission_${permission.id}`]
// // //     );
// // //     setSelectedPermissions(selected);
// // //   }, [screenPermissions]);

// // //   // Handle API response
// // //   useEffect(() => {
// // //     if (createRoleStatus === 'succeeded' && isSubmitting) { 
// // //       console.log("Role created successfully!");
// // //       setIsSubmitting(false);
// // //       reset();
// // //       setSelectedPermissions([]);
// // //       setIsPermissionsOpen(false);
// // //       if (onClose) onClose();
// // //     }
    
// // //     if (createRoleStatus === 'failed' && isSubmitting) {
// // //       console.error("Failed to create role:", createRoleError);
// // //       setIsSubmitting(false);
// // //     }
// // //   }, [createRoleStatus, createRoleError, isSubmitting, reset, onClose]);

// // //   // Handle click outside to close dropdown
// // //   useEffect(() => {
// // //     const handleClickOutside = (event) => {
// // //       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
// // //         setIsPermissionsOpen(false);
// // //       }
// // //     };

// // //     document.addEventListener("mousedown", handleClickOutside);
// // //     return () => {
// // //       document.removeEventListener("mousedown", handleClickOutside);
// // //     };
// // //   }, []);

// // //   const onSubmit = async (data) => {
// // //     setIsSubmitting(true);
    
// // //     const permissionIds = Object.entries(data)
// // //       .filter(([key, value]) => key.startsWith("permission_") && value === true)
// // //       .map(([key]) => key.replace("permission_", ""));
    
// // //     const formattedData = {
// // //       roleName: data.roleName,
// // //       permissionIds,
// // //     };
    
// // //     console.log("Data to send to backend:", formattedData);
    
// // //     // Dispatch the createRole thunk
// // //     dispatch(createRole(formattedData));

      
// // //   };

// // //   const handleReset = () => {
// // //     reset();
// // //     setSelectedPermissions([]);
// // //     setIsPermissionsOpen(false);
// // //   };

// // //   const handleCancel = () => {
// // //     reset();
// // //     setSelectedPermissions([]);
// // //     setIsPermissionsOpen(false);
// // //     if (onClose) {
// // //       onClose();
// // //     }
// // //     console.log("Form canceled and popup closed");
// // //   };

// // //   const togglePermissionsDropdown = () => {
// // //     setIsPermissionsOpen(!isPermissionsOpen);
// // //   };

// // //   const handlePermissionChange = (permissionId, isChecked) => {
// // //     setValue(`permission_${permissionId}`, isChecked);
// // //   };

// // //   const removePermission = (permissionId) => {
// // //     setValue(`permission_${permissionId}`, false);
// // //   };

// // //   const selectAllPermissions = () => {
// // //     screenPermissions.forEach(permission => {
// // //       setValue(`permission_${permission.id}`, true);
// // //     });
// // //   };

// // //   const clearAllPermissions = () => {
// // //     screenPermissions.forEach(permission => {
// // //       setValue(`permission_${permission.id}`, false);
// // //     });
// // //     setSelectedPermissions([]);
// // //   };

// // //   return (
// // //     <div className="max-w-lg mx-auto">
// // //       {/* Header */}
// // //       <div className="text-center mb-8">
// // //         <h2 className="text-3xl font-bold text-gray-900 mb-4">
// // //           Assign Screen Permissions
// // //         </h2>
// // //         <p className="text-lg text-gray-600">
// // //           Select the role and choose which screens it can access.
// // //         </p>
// // //       </div>

// // //       {/* Form Container */}
// // //       <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
// // //         <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
// // //           {/* Role Section */}
// // //           <div>
// // //             <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
// // //               <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
// // //                 <Shield className="w-4 h-4 text-blue-600" />
// // //               </span>
// // //               Role Information
// // //             </h3>

// // //             <div className="space-y-4">
// // //               <div>
// // //                 <label
// // //                   htmlFor="roleName"
// // //                   className="block text-sm font-medium text-gray-700 mb-2"
// // //                 >
// // //                   Role Name <span className="text-red-500">*</span>
// // //                 </label>
// // //                 <input
// // //                   id="roleName"
// // //                   type="text"
// // //                   placeholder="Enter role name (e.g., Admin, Editor)"
// // //                   {...register("roleName", { required: "Role name is required" })}
// // //                   className={`w-full px-4 py-3 border rounded-lg shadow-sm bg-white transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
// // //                     errors.roleName
// // //                       ? "border-red-300 bg-red-50"
// // //                       : "border-gray-300 hover:border-gray-400"
// // //                   }`}
// // //                 />
// // //                 {errors.roleName && (
// // //                   <p className="mt-1 text-sm text-red-600 flex items-center">
// // //                     <AlertCircle className="w-4 h-4 mr-1" />
// // //                     {errors.roleName.message}
// // //                   </p>
// // //                 )}
// // //               </div>
// // //             </div>
// // //           </div>

// // //           {/* Permissions Section */}
// // //           <div>
// // //             <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
// // //               <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
// // //                 <CheckCircle className="w-4 h-4 text-green-600" />
// // //               </span>
// // //               Screen Access Permissions
// // //             </h3>

// // //             {/* Show error if role creation fails */}
// // //             {createRoleError && (
// // //               <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
// // //                 <p className="text-red-600 flex items-center">
// // //                   <AlertCircle className="w-4 h-4 mr-2" />
// // //                   {createRoleError}
// // //                 </p>
// // //               </div>
// // //             )}

// // //             {/* Selected Permissions Display */}
// // //             {selectedPermissions.length > 0 && (
// // //               <div className="mb-4">
// // //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// // //                   Selected Permissions ({selectedPermissions.length})
// // //                 </label>
// // //                 <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg bg-white">
// // //                   {selectedPermissions.map((permission) => (
// // //                     <span
// // //                       key={permission.id}
// // //                       className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
// // //                     >
// // //                       {permission.displayName}
// // //                       <button
// // //                         type="button"
// // //                         onClick={() => removePermission(permission.id)}
// // //                         className="ml-1 hover:text-blue-600 focus:outline-none"
// // //                       >
// // //                         <X className="w-3 h-3" />
// // //                       </button>
// // //                     </span>
// // //                   ))}
// // //                 </div>
// // //               </div>
// // //             )}

// // //             {/* Permissions Dropdown */}
// // //             <div className="space-y-2" ref={dropdownRef}>
// // //               <div className="flex justify-between items-center mb-2">
// // //                 <label className="block text-sm font-medium text-gray-700">
// // //                   Select Permissions
// // //                 </label>
// // //                 <div className="flex gap-2">
// // //                   <button
// // //                     type="button"
// // //                     onClick={selectAllPermissions}
// // //                     className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
// // //                   >
// // //                     Select All
// // //                   </button>
// // //                   <button
// // //                     type="button"
// // //                     onClick={clearAllPermissions}
// // //                     className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
// // //                   >
// // //                     Clear All
// // //                   </button>
// // //                 </div>
// // //               </div>

// // //               <div className="relative">
// // //                 {/* Dropdown Trigger */}
// // //                 <button
// // //                   type="button"
// // //                   onClick={togglePermissionsDropdown}
// // //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
// // //                 >
// // //                   <span className="text-gray-700">
// // //                     {selectedPermissions.length > 0 
// // //                       ? `${selectedPermissions.length} permission(s) selected`
// // //                       : "Click to select permissions"
// // //                     }
// // //                   </span>
// // //                   {isPermissionsOpen ? (
// // //                     <ChevronUp className="w-5 h-5 text-gray-400" />
// // //                   ) : (
// // //                     <ChevronDown className="w-5 h-5 text-gray-400" />
// // //                   )}
// // //                 </button>

// // //                 {/* Dropdown Content */}
// // //                 {isPermissionsOpen && (
// // //                   <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
// // //                     <div className="p-2">
// // //                       {screenPermissions.length > 0 ? (
// // //                         screenPermissions.map((ele) => (
// // //                           <div
// // //                             key={ele.id}
// // //                             className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md transition cursor-pointer"
// // //                             onClick={() => {
// // //                               const isChecked = watchedPermissions[`permission_${ele.id}`];
// // //                               handlePermissionChange(ele.id, !isChecked);
// // //                             }}
// // //                           >
// // //                             <input
// // //                               type="checkbox"
// // //                               id={`permission_${ele.id}`}
// // //                               {...register(`permission_${ele.id}`)}
// // //                               className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
// // //                               onChange={(e) => {
// // //                                 handlePermissionChange(ele.id, e.target.checked);
// // //                               }}
// // //                             />
// // //                             <label
// // //                               htmlFor={`permission_${ele.id}`}
// // //                               className="text-sm text-gray-700 cursor-pointer flex-1"
// // //                             >
// // //                               {ele.displayName}
// // //                             </label>
// // //                           </div>
// // //                         ))
// // //                       ) : (
// // //                         <p className="text-gray-500 text-sm p-2">{t("permissions.loading")}</p>
// // //                       )}
// // //                     </div>
// // //                   </div>
// // //                 )}
// // //               </div>

// // //               <p className="text-xs text-gray-500 mt-1">
// // //                 Click the dropdown to view and select available permissions
// // //               </p>
// // //             </div>
// // //           </div>

// // //           {/* Form Actions */}
// // //           <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
// // //             <button
// // //               type="submit"
// // //               disabled={isSubmitting || createRoleStatus === 'loading'}
// // //               className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
// // //             >
// // //               {(isSubmitting || createRoleStatus === 'loading') ? (
// // //                 <>
// // //                   <Loader2 className="w-5 h-5 mr-2 animate-spin" />
// // //                   Saving Permissions...
// // //                 </>
// // //               ) : (
// // //                 <>
// // //                   <CheckCircle className="w-5 h-5 mr-2" />
// // //                   Save Permissions
// // //                 </>
// // //               )}
// // //             </button>

// // //             <button
// // //               type="button"
// // //               onClick={handleReset}
// // //               disabled={isSubmitting || createRoleStatus === 'loading'}
// // //               className="flex-none bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center"
// // //             >
// // //               <RotateCcw className="w-4 h-4 mr-2" />
// // //               {t("reset")}
// // //             </button>

// // //             <button
// // //               type="button"
// // //               onClick={handleCancel}
// // //               disabled={isSubmitting || createRoleStatus === 'loading'}
// // //               className="flex-none bg-red-200 hover:bg-red-300 disabled:bg-red-100 text-red-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
// // //             >
// // //               {t("cancel")}
// // //             </button>
// // //             {/* Alert Components */}
// // //             {showSuccessAlert && (
// // //               <SuccessAlert
// // //                 show={showSuccessAlert}
// // //                 onClose={() => setShowSuccessAlert(false)}
// // //                 title="Successfully saved!"
// // //                 message="Your Role has been created successfully"
// // //               />
// // //             )}
// // //           </div>
// // //         </form>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // export default ScreenPermissions;

// // /* eslint-disable react/prop-types */
// // import { useEffect, useState, useRef } from "react";
// // import { useDispatch, useSelector } from "react-redux";
// // import { useForm } from "react-hook-form";
// // import { useTranslation } from "react-i18next";
// // import {
// //   Shield,
// //   CheckCircle,
// //   Loader2,
// //   AlertCircle,
// //   RotateCcw,
// //   ChevronDown,
// //   ChevronUp,
// //   X,
// // } from "lucide-react";
// // import { fetchScreensPermissions } from "./permissionsThunks";
// // import { createRole } from "../Roles/RolesThunks";
// // import SuccessAlert from "../../globalComponents/Alerts/SuccessAlert";

// // function ScreenPermissions({ onClose }) {
// //   const dispatch = useDispatch();
// //   const { t } = useTranslation();
// //   const { screenPermissions = [] } = useSelector(
// //     (state) => state.permissionsReducer
// //   );
  
// //   // Add selector for roles state to track creation status
// //   const { status: createRoleStatus, error: createRoleError } = useSelector(
// //     (state) => state.rolesReducer
// //   );

// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
// //   const [selectedPermissions, setSelectedPermissions] = useState([]);
// //   // Alert states
// //   const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  
// //   const {
// //     register,
// //     handleSubmit,
// //     reset,
// //     formState: { errors },
// //     setValue,
// //     watch,
// //   } = useForm();

// //   // Ref for dropdown container
// //   const dropdownRef = useRef(null);

// //   useEffect(() => {
// //     dispatch(fetchScreensPermissions());
// //   }, [dispatch]);

// //   // Watch for permission changes to update selectedPermissions
// //   const watchedPermissions = watch();
// //   useEffect(() => {
// //     const selected = screenPermissions.filter(
// //       (permission) => watchedPermissions[`permission_${permission.id}`]
// //     );
// //     setSelectedPermissions(selected);
// //   }, [screenPermissions]);

// //   // Handle API response
// //   useEffect(() => {
// //     if (createRoleStatus === 'succeeded' && isSubmitting) { 
// //       console.log("Role created successfully!");
// //       setIsSubmitting(false);
// //       setShowSuccessAlert(true); // Show success alert
// //       reset();
// //       setSelectedPermissions([]);
// //       setIsPermissionsOpen(false);
// //     }
    
// //     if (createRoleStatus === 'failed' && isSubmitting) {
// //       console.error("Failed to create role:", createRoleError);
// //       setIsSubmitting(false);
// //     }
// //   }, [createRoleStatus, createRoleError, isSubmitting, reset, onClose]);

// //   // Handle click outside to close dropdown
// //   useEffect(() => {
// //     const handleClickOutside = (event) => {
// //       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
// //         setIsPermissionsOpen(false);
// //       }
// //     };

// //     document.addEventListener("mousedown", handleClickOutside);
// //     return () => {
// //       document.removeEventListener("mousedown", handleClickOutside);
// //     };
// //   }, []);

// //   const onSubmit = async (data) => {
// //     setIsSubmitting(true);
// //     setShowSuccessAlert(false); // Reset alert state
    
// //     const permissionIds = Object.entries(data)
// //       .filter(([key, value]) => key.startsWith("permission_") && value === true)
// //       .map(([key]) => key.replace("permission_", ""));
    
// //     const formattedData = {
// //       roleName: data.roleName,
// //       permissionIds,
// //     };
    
// //     console.log("Data to send to backend:", formattedData);
    
// //     // Dispatch the createRole thunk
// //     dispatch(createRole(formattedData));
// //   };

// //   const handleReset = () => {
// //     reset();
// //     setSelectedPermissions([]);
// //     setIsPermissionsOpen(false);
// //     setShowSuccessAlert(false);
// //   };

// //   const handleCancel = () => {
// //     reset();
// //     setSelectedPermissions([]);
// //     setIsPermissionsOpen(false);
// //     setShowSuccessAlert(false);
// //     if (onClose) {
// //       onClose();
// //     }
// //     console.log("Form canceled and popup closed");
// //   };

// //   const togglePermissionsDropdown = () => {
// //     setIsPermissionsOpen(!isPermissionsOpen);
// //   };

// //   const handlePermissionChange = (permissionId, isChecked) => {
// //     setValue(`permission_${permissionId}`, isChecked);
// //   };

// //   const removePermission = (permissionId) => {
// //     setValue(`permission_${permissionId}`, false);
// //   };

// //   const selectAllPermissions = () => {
// //     screenPermissions.forEach(permission => {
// //       setValue(`permission_${permission.id}`, true);
// //     });
// //   };

// //   const clearAllPermissions = () => {
// //     screenPermissions.forEach(permission => {
// //       setValue(`permission_${permission.id}`, false);
// //     });
// //     setSelectedPermissions([]);
// //   };

// //   const handleSuccessAlertClose = () => {
// //     setShowSuccessAlert(false);
// //     if (onClose) {
// //       onClose(); // Close the popup when alert is dismissed
// //     }
// //   };

// //   return (
// //     <div className="max-w-lg mx-auto">
// //       {/* Success Alert - Render outside the form */}
// //       {showSuccessAlert && (
// //         <SuccessAlert
// //           show={showSuccessAlert}
// //           onClose={handleSuccessAlertClose}
// //           title="Successfully saved!"
// //           message="Your Role has been created successfully"
// //         />
// //       )}

// //       {/* Header */}
// //       <div className="text-center mb-8">
// //         <h2 className="text-3xl font-bold text-gray-900 mb-4">
// //           Assign Screen Permissions
// //         </h2>
// //         <p className="text-lg text-gray-600">
// //           Select the role and choose which screens it can access.
// //         </p>
// //       </div>

// //       {/* Form Container */}
// //       <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
// //         <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
// //           {/* Role Section */}
// //           <div>
// //             <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
// //               <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
// //                 <Shield className="w-4 h-4 text-blue-600" />
// //               </span>
// //               Role Information
// //             </h3>

// //             <div className="space-y-4">
// //               <div>
// //                 <label
// //                   htmlFor="roleName"
// //                   className="block text-sm font-medium text-gray-700 mb-2"
// //                 >
// //                   Role Name <span className="text-red-500">*</span>
// //                 </label>
// //                 <input
// //                   id="roleName"
// //                   type="text"
// //                   placeholder="Enter role name (e.g., Admin, Editor)"
// //                   {...register("roleName", { required: "Role name is required" })}
// //                   className={`w-full px-4 py-3 border rounded-lg shadow-sm bg-white transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
// //                     errors.roleName
// //                       ? "border-red-300 bg-red-50"
// //                       : "border-gray-300 hover:border-gray-400"
// //                   }`}
// //                 />
// //                 {errors.roleName && (
// //                   <p className="mt-1 text-sm text-red-600 flex items-center">
// //                     <AlertCircle className="w-4 h-4 mr-1" />
// //                     {errors.roleName.message}
// //                   </p>
// //                 )}
// //               </div>
// //             </div>
// //           </div>

// //           {/* Permissions Section */}
// //           <div>
// //             <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
// //               <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
// //                 <CheckCircle className="w-4 h-4 text-green-600" />
// //               </span>
// //               Screen Access Permissions
// //             </h3>

// //             {/* Show error if role creation fails */}
// //             {createRoleError && (
// //               <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
// //                 <p className="text-red-600 flex items-center">
// //                   <AlertCircle className="w-4 h-4 mr-2" />
// //                   {createRoleError}
// //                 </p>
// //               </div>
// //             )}

// //             {/* Selected Permissions Display */}
// //             {selectedPermissions.length > 0 && (
// //               <div className="mb-4">
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Selected Permissions ({selectedPermissions.length})
// //                 </label>
// //                 <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg bg-white">
// //                   {selectedPermissions.map((permission) => (
// //                     <span
// //                       key={permission.id}
// //                       className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
// //                     >
// //                       {permission.displayName}
// //                       <button
// //                         type="button"
// //                         onClick={() => removePermission(permission.id)}
// //                         className="ml-1 hover:text-blue-600 focus:outline-none"
// //                       >
// //                         <X className="w-3 h-3" />
// //                       </button>
// //                     </span>
// //                   ))}
// //                 </div>
// //               </div>
// //             )}

// //             {/* Permissions Dropdown */}
// //             <div className="space-y-2" ref={dropdownRef}>
// //               <div className="flex justify-between items-center mb-2">
// //                 <label className="block text-sm font-medium text-gray-700">
// //                   Select Permissions
// //                 </label>
// //                 <div className="flex gap-2">
// //                   <button
// //                     type="button"
// //                     onClick={selectAllPermissions}
// //                     className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
// //                   >
// //                     Select All
// //                   </button>
// //                   <button
// //                     type="button"
// //                     onClick={clearAllPermissions}
// //                     className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
// //                   >
// //                     Clear All
// //                   </button>
// //                 </div>
// //               </div>

// //               <div className="relative">
// //                 {/* Dropdown Trigger */}
// //                 <button
// //                   type="button"
// //                   onClick={togglePermissionsDropdown}
// //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
// //                 >
// //                   <span className="text-gray-700">
// //                     {selectedPermissions.length > 0 
// //                       ? `${selectedPermissions.length} permission(s) selected`
// //                       : "Click to select permissions"
// //                     }
// //                   </span>
// //                   {isPermissionsOpen ? (
// //                     <ChevronUp className="w-5 h-5 text-gray-400" />
// //                   ) : (
// //                     <ChevronDown className="w-5 h-5 text-gray-400" />
// //                   )}
// //                 </button>

// //                 {/* Dropdown Content */}
// //                 {isPermissionsOpen && (
// //                   <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
// //                     <div className="p-2">
// //                       {screenPermissions.length > 0 ? (
// //                         screenPermissions.map((ele) => (
// //                           <div
// //                             key={ele.id}
// //                             className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md transition cursor-pointer"
// //                             onClick={() => {
// //                               const isChecked = watchedPermissions[`permission_${ele.id}`];
// //                               handlePermissionChange(ele.id, !isChecked);
// //                             }}
// //                           >
// //                             <input
// //                               type="checkbox"
// //                               id={`permission_${ele.id}`}
// //                               {...register(`permission_${ele.id}`)}
// //                               className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
// //                               onChange={(e) => {
// //                                 handlePermissionChange(ele.id, e.target.checked);
// //                               }}
// //                             />
// //                             <label
// //                               htmlFor={`permission_${ele.id}`}
// //                               className="text-sm text-gray-700 cursor-pointer flex-1"
// //                             >
// //                               {ele.displayName}
// //                             </label>
// //                           </div>
// //                         ))
// //                       ) : (
// //                         <p className="text-gray-500 text-sm p-2">{t("permissions.loading")}</p>
// //                       )}
// //                     </div>
// //                   </div>
// //                 )}
// //               </div>

// //               <p className="text-xs text-gray-500 mt-1">
// //                 Click the dropdown to view and select available permissions
// //               </p>
// //             </div>
// //           </div>

// //           {/* Form Actions */}
// //           <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
// //             <button
// //               type="submit"
// //               disabled={isSubmitting || createRoleStatus === 'loading'}
// //               className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
// //             >
// //               {(isSubmitting || createRoleStatus === 'loading') ? (
// //                 <>
// //                   <Loader2 className="w-5 h-5 mr-2 animate-spin" />
// //                   Saving Permissions...
// //                 </>
// //               ) : (
// //                 <>
// //                   <CheckCircle className="w-5 h-5 mr-2" />
// //                   Save Permissions
// //                 </>
// //               )}
// //             </button>

// //             <button
// //               type="button"
// //               onClick={handleReset}
// //               disabled={isSubmitting || createRoleStatus === 'loading'}
// //               className="flex-none bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center"
// //             >
// //               <RotateCcw className="w-4 h-4 mr-2" />
// //               {t("reset")}
// //             </button>

// //             <button
// //               type="button"
// //               onClick={handleCancel}
// //               disabled={isSubmitting || createRoleStatus === 'loading'}
// //               className="flex-none bg-red-200 hover:bg-red-300 disabled:bg-red-100 text-red-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
// //             >
// //               {t("cancel")}
// //             </button>
// //           </div>
// //         </form>
// //       </div>
// //     </div>
// //   );
// // }

// // export default ScreenPermissions;


// /* eslint-disable react/prop-types */
// import { useEffect, useState, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useForm } from "react-hook-form";
// import { useTranslation } from "react-i18next";
// import {
//   Shield,
//   CheckCircle,
//   Loader2,
//   AlertCircle,
//   RotateCcw,
//   ChevronDown,
//   ChevronUp,
//   X,
// } from "lucide-react";
// import { fetchScreensPermissions } from "./permissionsThunks";
// import { createRole } from "../Roles/RolesThunks";
// import SuccessAlert from "../../globalComponents/Alerts/SuccessAlert";

// function ScreenPermissions({ onClose }) {
//   const dispatch = useDispatch();
//   const { t } = useTranslation();
//   const { screenPermissions = [] } = useSelector(
//     (state) => state.permissionsReducer
//   );
  
//   // Add selector for roles state to track creation status
//   const { status: createRoleStatus, error: createRoleError } = useSelector(
//     (state) => state.rolesReducer
//   );

//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
//   const [selectedPermissions, setSelectedPermissions] = useState([]);
//   // Alert states
//   const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//     setValue,
//     watch,
//   } = useForm();

//   // Ref for dropdown container
//   const dropdownRef = useRef(null);
//   // Ref for timeout to clear on unmount
//   const autoCloseTimeoutRef = useRef(null);

//   useEffect(() => {
//     dispatch(fetchScreensPermissions());
//   }, [dispatch]);

//   // Watch for permission changes to update selectedPermissions
//   const watchedPermissions = watch();
//   useEffect(() => {
//     const selected = screenPermissions.filter(
//       (permission) => watchedPermissions[`permission_${permission.id}`]
//     );
//     setSelectedPermissions(selected);
//   }, [   screenPermissions]);

//   // Handle API response
//   useEffect(() => {
//     if (createRoleStatus === 'succeeded' && isSubmitting) { 
//       console.log("Role created successfully!");
//       setIsSubmitting(false);
//       setShowSuccessAlert(true); // Show success alert
      
//       // Auto close after 3 seconds
//       autoCloseTimeoutRef.current = setTimeout(() => {
//         handleAutoClose();
//       }, 3000);
//     }
    
//     if (createRoleStatus === 'failed' && isSubmitting) {
//       console.error("Failed to create role:", createRoleError);
//       setIsSubmitting(false);
//     }
//   }, [createRoleStatus, createRoleError, isSubmitting, reset, onClose]);

//   // Cleanup timeout on unmount
//   useEffect(() => {
//     return () => {
//       if (autoCloseTimeoutRef.current) {
//         clearTimeout(autoCloseTimeoutRef.current);
//       }
//     };
//   }, []);

//   // Handle click outside to close dropdown
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsPermissionsOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleAutoClose = () => {
//     setShowSuccessAlert(false);
//     reset();
//     setSelectedPermissions([]);
//     setIsPermissionsOpen(false);
//     if (onClose) {
//       onClose(); // Close the popup
//     }
//   };

//   const onSubmit = async (data) => {
//     setIsSubmitting(true);
//     setShowSuccessAlert(false); // Reset alert state
    
//     // Clear any existing timeout
//     if (autoCloseTimeoutRef.current) {
//       clearTimeout(autoCloseTimeoutRef.current);
//     }
    
//     const permissionIds = Object.entries(data)
//       .filter(([key, value]) => key.startsWith("permission_") && value === true)
//       .map(([key]) => key.replace("permission_", ""));
    
//     const formattedData = {
//       roleName: data.roleName,
//       permissionIds,
//     };
    
//     console.log("Data to send to backend:", formattedData);
    
//     // Dispatch the createRole thunk
//     dispatch(createRole(formattedData));
//   };

//   const handleReset = () => {
//     // Clear any existing timeout
//     if (autoCloseTimeoutRef.current) {
//       clearTimeout(autoCloseTimeoutRef.current);
//     }
    
//     reset();
//     setSelectedPermissions([]);
//     setIsPermissionsOpen(false);
//     setShowSuccessAlert(false);
//   };

//   const handleCancel = () => {
//     // Clear any existing timeout
//     if (autoCloseTimeoutRef.current) {
//       clearTimeout(autoCloseTimeoutRef.current);
//     }
    
//     reset();
//     setSelectedPermissions([]);
//     setIsPermissionsOpen(false);
//     setShowSuccessAlert(false);
//     if (onClose) {
//       onClose();
//     }
//     console.log("Form canceled and popup closed");
//   };

//   const handleSuccessAlertClose = () => {
//     // Clear any existing timeout
//     if (autoCloseTimeoutRef.current) {
//       clearTimeout(autoCloseTimeoutRef.current);
//     }
    
//     setShowSuccessAlert(false);
//     if (onClose) {
//       onClose(); // Close the popup when alert is dismissed
//     }
//   };

//   const togglePermissionsDropdown = () => {
//     setIsPermissionsOpen(!isPermissionsOpen);
//   };

//   const handlePermissionChange = (permissionId, isChecked) => {
//     setValue(`permission_${permissionId}`, isChecked);
//   };

//   const removePermission = (permissionId) => {
//     setValue(`permission_${permissionId}`, false);
//   };

//   const selectAllPermissions = () => {
//     screenPermissions.forEach(permission => {
//       setValue(`permission_${permission.id}`, true);
//     });
//   };

//   const clearAllPermissions = () => {
//     screenPermissions.forEach(permission => {
//       setValue(`permission_${permission.id}`, false);
//     });
//     setSelectedPermissions([]);
//   };

//   return (
//     <div className="max-w-lg mx-auto">
//       {/* Success Alert - Render outside the form */}
//       {showSuccessAlert && (
//         <SuccessAlert
//           show={showSuccessAlert}
//           onClose={handleSuccessAlertClose}
//           title="Successfully saved!"
//           message="Your Role has been created successfully"
//           autoClose={3000} // Optional: if your SuccessAlert component supports autoClose prop
//         />
//       )}

//       {/* Header */}
//       <div className="text-center mb-8">
//         <h2 className="text-3xl font-bold text-gray-900 mb-4">
//           Assign Screen Permissions
//         </h2>
//         <p className="text-lg text-gray-600">
//           Select the role and choose which screens it can access.
//         </p>
//       </div>

//       {/* Form Container */}
//       <div className="bg-gray-50 rounded-xl p-6 shadow-sm">
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
//           {/* Role Section */}
//           <div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//               <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
//                 <Shield className="w-4 h-4 text-blue-600" />
//               </span>
//               Role Information
//             </h3>

//             <div className="space-y-4">
//               <div>
//                 <label
//                   htmlFor="roleName"
//                   className="block text-sm font-medium text-gray-700 mb-2"
//                 >
//                   Role Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   id="roleName"
//                   type="text"
//                   placeholder="Enter role name (e.g., Admin, Editor)"
//                   {...register("roleName", { required: "Role name is required" })}
//                   className={`w-full px-4 py-3 border rounded-lg shadow-sm bg-white transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     errors.roleName
//                       ? "border-red-300 bg-red-50"
//                       : "border-gray-300 hover:border-gray-400"
//                   }`}
//                 />
//                 {errors.roleName && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center">
//                     <AlertCircle className="w-4 h-4 mr-1" />
//                     {errors.roleName.message}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Permissions Section */}
//           <div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//               <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
//                 <CheckCircle className="w-4 h-4 text-green-600" />
//               </span>
//               Screen Access Permissions
//             </h3>

//             {/* Show error if role creation fails */}
//             {createRoleError && (
//               <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
//                 <p className="text-red-600 flex items-center">
//                   <AlertCircle className="w-4 h-4 mr-2" />
//                   {createRoleError}
//                 </p>
//               </div>
//             )}

//             {/* Selected Permissions Display */}
//             {selectedPermissions.length > 0 && (
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Selected Permissions ({selectedPermissions.length})
//                 </label>
//                 <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg bg-white">
//                   {selectedPermissions.map((permission) => (
//                     <span
//                       key={permission.id}
//                       className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
//                     >
//                       {permission.displayName}
//                       <button
//                         type="button"
//                         onClick={() => removePermission(permission.id)}
//                         className="ml-1 hover:text-blue-600 focus:outline-none"
//                       >
//                         <X className="w-3 h-3" />
//                       </button>
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Permissions Dropdown */}
//             <div className="space-y-2" ref={dropdownRef}>
//               <div className="flex justify-between items-center mb-2">
//                 <label className="block text-sm font-medium text-gray-700">
//                   Select Permissions
//                 </label>
//                 <div className="flex gap-2">
//                   <button
//                     type="button"
//                     onClick={selectAllPermissions}
//                     className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
//                   >
//                     Select All
//                   </button>
//                   <button
//                     type="button"
//                     onClick={clearAllPermissions}
//                     className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
//                   >
//                     Clear All
//                   </button>
//                 </div>
//               </div>

//               <div className="relative">
//                 {/* Dropdown Trigger */}
//                 <button
//                   type="button"
//                   onClick={togglePermissionsDropdown}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
//                 >
//                   <span className="text-gray-700">
//                     {selectedPermissions.length > 0 
//                       ? `${selectedPermissions.length} permission(s) selected`
//                       : "Click to select permissions"
//                     }
//                   </span>
//                   {isPermissionsOpen ? (
//                     <ChevronUp className="w-5 h-5 text-gray-400" />
//                   ) : (
//                     <ChevronDown className="w-5 h-5 text-gray-400" />
//                   )}
//                 </button>

//                 {/* Dropdown Content */}
//                 {isPermissionsOpen && (
//                   <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//                     <div className="p-2">
//                       {screenPermissions.length > 0 ? (
//                         screenPermissions.map((ele) => (
//                           <div
//                             key={ele.id}
//                             className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md transition cursor-pointer"
//                             onClick={() => {
//                               const isChecked = watchedPermissions[`permission_${ele.id}`];
//                               handlePermissionChange(ele.id, !isChecked);
//                             }}
//                           >
//                             <input
//                               type="checkbox"
//                               id={`permission_${ele.id}`}
//                               {...register(`permission_${ele.id}`)}
//                               className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//                               onChange={(e) => {
//                                 handlePermissionChange(ele.id, e.target.checked);
//                               }}
//                             />
//                             <label
//                               htmlFor={`permission_${ele.id}`}
//                               className="text-sm text-gray-700 cursor-pointer flex-1"
//                             >
//                               {ele.displayName}
//                             </label>
//                           </div>
//                         ))
//                       ) : (
//                         <p className="text-gray-500 text-sm p-2">{t("permissions.loading")}</p>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>

//               <p className="text-xs text-gray-500 mt-1">
//                 Click the dropdown to view and select available permissions
//               </p>
//             </div>
//           </div>

//           {/* Form Actions */}
//           <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
//             <button
//               type="submit"
//               disabled={isSubmitting || createRoleStatus === 'loading'}
//               className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
//             >
//               {(isSubmitting || createRoleStatus === 'loading') ? (
//                 <>
//                   <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                   Saving Permissions...
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle className="w-5 h-5 mr-2" />
//                   Save Permissions
//                 </>
//               )}
//             </button>

//             <button
//               type="button"
//               onClick={handleReset}
//               disabled={isSubmitting || createRoleStatus === 'loading'}
//               className="flex-none bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center"
//             >
//               <RotateCcw className="w-4 h-4 mr-2" />
//               {t("reset")}
//             </button>

//             <button
//               type="button"
//               onClick={handleCancel}
//               disabled={isSubmitting || createRoleStatus === 'loading'}
//               className="flex-none bg-red-200 hover:bg-red-300 disabled:bg-red-100 text-red-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
//             >
//               {t("cancel")}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default ScreenPermissions;

/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  Shield,
  CheckCircle,
  Loader2,
  AlertCircle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { fetchScreensPermissions } from "./permissionsThunks";
import { createRole } from "../Roles/RolesThunks";
import SuccessAlert from "../../globalComponents/Alerts/SuccessAlert";

function ScreenPermissions({ onClose }) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { screenPermissions = [] } = useSelector(
    (state) => state.permissionsReducer
  );
  
  // Add selector for roles state to track creation status
  const { status: createRoleStatus, error: createRoleError } = useSelector(
    (state) => state.rolesReducer
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  // Alert states
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm();

  // Ref for dropdown container
  const dropdownRef = useRef(null);
  // Ref for timeout to clear on unmount
  const autoCloseTimeoutRef = useRef(null);

  useEffect(() => {
    dispatch(fetchScreensPermissions());
  }, [dispatch]);

  // Watch for permission changes to update selectedPermissions
  const watchedPermissions = watch();
  useEffect(() => {
    const selected = screenPermissions.filter(
      (permission) => watchedPermissions[`permission_${permission.id}`]
    );
    setSelectedPermissions(selected);
  }, [screenPermissions]);

  // Handle API response
  useEffect(() => {
    if (createRoleStatus === 'succeeded' && isSubmitting) { 
      console.log("Role created successfully!");
      setIsSubmitting(false);
      setShowSuccessAlert(true); // Show success alert
      
      // Auto close after 3 seconds
      autoCloseTimeoutRef.current = setTimeout(() => {
        handleAutoClose();
      }, 3000);
    }
    
    if (createRoleStatus === 'failed' && isSubmitting) {
      console.error("Failed to create role:", createRoleError);
      setIsSubmitting(false);
    }
  }, [createRoleStatus, createRoleError, isSubmitting]);

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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsPermissionsOpen(false);
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
    setIsPermissionsOpen(false);
    // Close the popup
    if (onClose) {
      onClose();
    }
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setShowSuccessAlert(false); // Reset alert state
    
    // Clear any existing timeout
    if (autoCloseTimeoutRef.current) {
      clearTimeout(autoCloseTimeoutRef.current);
    }
    
    const permissionIds = Object.entries(data)
      .filter(([key, value]) => key.startsWith("permission_") && value === true)
      .map(([key]) => key.replace("permission_", ""));
    
    const formattedData = {
      roleName: data.roleName,
      permissionIds,
    };
    
    console.log("Data to send to backend:", formattedData);
    
    // Dispatch the createRole thunk
    dispatch(createRole(formattedData));
  };

  const handleReset = () => {
    // Clear any existing timeout
    if (autoCloseTimeoutRef.current) {
      clearTimeout(autoCloseTimeoutRef.current);
    }
    
    reset();
    setSelectedPermissions([]);
    setIsPermissionsOpen(false);
    setShowSuccessAlert(false);
  };

  const handleCancel = () => {
    // Clear any existing timeout
    if (autoCloseTimeoutRef.current) {
      clearTimeout(autoCloseTimeoutRef.current);
    }
    
    reset();
    setSelectedPermissions([]);
    setIsPermissionsOpen(false);
    setShowSuccessAlert(false);
    if (onClose) {
      onClose();
    }
    console.log("Form canceled and popup closed");
  };

  const handleSuccessAlertClose = () => {
    // Clear any existing timeout
    if (autoCloseTimeoutRef.current) {
      clearTimeout(autoCloseTimeoutRef.current);
    }
    
    setShowSuccessAlert(false);
  };

  const togglePermissionsDropdown = () => {
    setIsPermissionsOpen(!isPermissionsOpen);
  };

  const handlePermissionChange = (permissionId, isChecked) => {
    setValue(`permission_${permissionId}`, isChecked);
  };

  const removePermission = (permissionId) => {
    setValue(`permission_${permissionId}`, false);
  };

  const selectAllPermissions = () => {
    screenPermissions.forEach(permission => {
      setValue(`permission_${permission.id}`, true);
    });
  };

  const clearAllPermissions = () => {
    screenPermissions.forEach(permission => {
      setValue(`permission_${permission.id}`, false);
    });
    setSelectedPermissions([]);
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Success Alert - Render outside the form */}
      {showSuccessAlert && (
        <SuccessAlert
          show={showSuccessAlert}
          onClose={handleSuccessAlertClose}
          title="Successfully saved!"
          message="Your Role has been created successfully"
          autoHide={true}
          duration={3000}
        />
      )}

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

            {/* Show error if role creation fails */}
            {createRoleError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {createRoleError}
                </p>
              </div>
            )}

            {/* Selected Permissions Display */}
            {selectedPermissions.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Permissions ({selectedPermissions.length})
                </label>
                <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg bg-white">
                  {selectedPermissions.map((permission) => (
                    <span
                      key={permission.id}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                    >
                      {permission.displayName}
                      <button
                        type="button"
                        onClick={() => removePermission(permission.id)}
                        className="ml-1 hover:text-blue-600 focus:outline-none"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Permissions Dropdown */}
            <div className="space-y-2" ref={dropdownRef}>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Select Permissions
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={selectAllPermissions}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={clearAllPermissions}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className="relative">
                {/* Dropdown Trigger */}
                <button
                  type="button"
                  onClick={togglePermissionsDropdown}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 flex items-center justify-between"
                >
                  <span className="text-gray-700">
                    {selectedPermissions.length > 0 
                      ? `${selectedPermissions.length} permission(s) selected`
                      : "Click to select permissions"
                    }
                  </span>
                  {isPermissionsOpen ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {/* Dropdown Content */}
                {isPermissionsOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    <div className="p-2">
                      {screenPermissions.length > 0 ? (
                        screenPermissions.map((ele) => (
                          <div
                            key={ele.id}
                            className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-md transition cursor-pointer"
                            onClick={() => {
                              const isChecked = watchedPermissions[`permission_${ele.id}`];
                              handlePermissionChange(ele.id, !isChecked);
                            }}
                          >
                            <input
                              type="checkbox"
                              id={`permission_${ele.id}`}
                              {...register(`permission_${ele.id}`)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                              onChange={(e) => {
                                handlePermissionChange(ele.id, e.target.checked);
                              }}
                            />
                            <label
                              htmlFor={`permission_${ele.id}`}
                              className="text-sm text-gray-700 cursor-pointer flex-1"
                            >
                              {ele.displayName}
                            </label>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm p-2">{t("permissions.loading")}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-1">
                Click the dropdown to view and select available permissions
              </p>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting || createRoleStatus === 'loading'}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
            >
              {(isSubmitting || createRoleStatus === 'loading') ? (
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
              disabled={isSubmitting || createRoleStatus === 'loading'}
              className="flex-none bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              {t("reset")}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting || createRoleStatus === 'loading'}
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

export default ScreenPermissions;