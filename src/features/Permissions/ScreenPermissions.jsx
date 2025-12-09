

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
  Search,
  Filter,
  Check,
  Square,
  CheckSquare,
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
  const [permissionSearchTerm, setPermissionSearchTerm] = useState("");
  const [filteredPermissions, setFilteredPermissions] = useState([]);
  const [selectAllState, setSelectAllState] = useState('none');
  // Alert states
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useForm();

  // Refs
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const autoCloseTimeoutRef = useRef(null);

  useEffect(() => {
    dispatch(fetchScreensPermissions());
  }, [dispatch]);

  // Watch for permission changes to update selectedPermissions and selectAllState
  const watchedPermissions = watch();
  useEffect(() => {
    const selected = screenPermissions.filter(
      (permission) => watchedPermissions[`permission_${permission.id}`]
    );
    setSelectedPermissions(selected);
    
    // Update select all state
    if (selected.length === 0) {
      setSelectAllState('none');
    } else if (selected.length === screenPermissions.length) {
      setSelectAllState('all');
    } else {
      setSelectAllState('some');
    }
  }, [screenPermissions]);

  // Filter permissions based on search term
  useEffect(() => {
    const filtered = screenPermissions.filter((permission) =>
      permission.displayName.toLowerCase().includes(permissionSearchTerm.toLowerCase())
    );
    setFilteredPermissions(filtered);
  }, [permissionSearchTerm, screenPermissions]);

  // Handle API response
  useEffect(() => {
    if (createRoleStatus === 'succeeded' && isSubmitting) { 
      console.log("Role created successfully!");
      setIsSubmitting(false);
      setShowSuccessAlert(true);
      
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
        setPermissionSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isPermissionsOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  }, [isPermissionsOpen]);

  const handleAutoClose = () => {
    console.log("Auto closing popup and alert...");
    setShowSuccessAlert(false);
    reset();
    setSelectedPermissions([]);
    setIsPermissionsOpen(false);
    setPermissionSearchTerm("");
    if (onClose) {
      onClose();
    }
  };

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      setShowSuccessAlert(false);
      
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
      
      const result = await dispatch(createRole(formattedData)).unwrap();
      console.log("Role created successfully:", result);
    } catch (error) {
      console.error("Failed to create role:", error);
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    if (autoCloseTimeoutRef.current) {
      clearTimeout(autoCloseTimeoutRef.current);
    }
    
    reset();
    setSelectedPermissions([]);
    setIsPermissionsOpen(false);
    setPermissionSearchTerm("");
    setShowSuccessAlert(false);
  };

  const handleCancel = () => {
    if (autoCloseTimeoutRef.current) {
      clearTimeout(autoCloseTimeoutRef.current);
    }
    
    reset();
    setSelectedPermissions([]);
    setIsPermissionsOpen(false);
    setPermissionSearchTerm("");
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
    if (!isPermissionsOpen) {
      setPermissionSearchTerm("");
    }
  };

  const handlePermissionChange = (permissionId, isChecked) => {
    setValue(`permission_${permissionId}`, isChecked);
  };

  const removePermission = (permissionId) => {
    setValue(`permission_${permissionId}`, false);
  };

  const handleSelectAll = () => {
    const permissionsToSelect = permissionSearchTerm ? filteredPermissions : screenPermissions;
    const allChecked = permissionsToSelect.every(permission => 
      getValues(`permission_${permission.id}`)
    );
    
    permissionsToSelect.forEach(permission => {
      setValue(`permission_${permission.id}`, !allChecked);
    });
  };

  const handleSelectAllInView = () => {
    filteredPermissions.forEach(permission => {
      setValue(`permission_${permission.id}`, true);
    });
  };

  const handleClearAllInView = () => {
    filteredPermissions.forEach(permission => {
      setValue(`permission_${permission.id}`, false);
    });
  };

  const clearAllPermissions = () => {
    screenPermissions.forEach(permission => {
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
      case 'all':
        return <CheckSquare className="w-4 h-4" />;
      case 'some':
        return <Square className="w-4 h-4 border-2 border-gray-400 rounded" />;
      default:
        return <Square className="w-4 h-4 border-2 border-gray-400 rounded" />;
    }
  };

  // Check if all filtered permissions are selected
  const allFilteredSelected = filteredPermissions.length > 0 && 
    filteredPermissions.every(permission => getValues(`permission_${permission.id}`));

  // Check if some filtered permissions are selected
  const someFilteredSelected = filteredPermissions.length > 0 && 
    filteredPermissions.some(permission => getValues(`permission_${permission.id}`)) &&
    !allFilteredSelected;

  return (
    <div className="max-w-lg mx-auto">
      {/* Success Alert */}
      {showSuccessAlert && (
        <SuccessAlert
          show={showSuccessAlert}
          onClose={handleSuccessAlertClose}
          title={t('success')}
          message={t('permissionsAssigned')}
          autoHide={true}
          duration={3000}
        />
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t('assignScreenPermissions')}
        </h2>
        <p className="text-lg text-gray-600">
          {t('selectRoleAndScreens')}
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
              {t('roleInformation')}
            </h3>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="roleName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  {t('roleName')} <span className="text-red-500">*</span>
                </label>
                <input
                  id="roleName"
                  type="text"
                  placeholder={t('roleNamePlaceholder')}
                  {...register("roleName", { required: t('roleNameRequired') })}
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
              {t('screenAccessPermissions')}
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
                  {t('selectedPermissionsCount')} ({selectedPermissions.length})
                </label>
                <div className="flex flex-wrap gap-2 p-3 border border-gray-200 rounded-lg bg-white min-h-[3rem]">
                  {selectedPermissions.map((permission) => (
                    <span
                      key={permission.id}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full group hover:bg-blue-200 transition-colors"
                    >
                      {permission.displayName}
                      <button
                        type="button"
                        onClick={() => removePermission(permission.id)}
                        className="ml-1 hover:text-blue-600 focus:outline-none opacity-70 group-hover:opacity-100 transition-opacity"
                        title="Remove permission"
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
                  {t('selectPermissions')}
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSelectAll}
                    className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors flex items-center gap-1"
                    title="Toggle all permissions"
                  >
                    {getSelectAllIcon()}
                    {selectAllState === 'all' ? t('deselect') : t('selectAll')}
                  </button>
                  <button
                    type="button"
                    onClick={clearAllPermissions}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200 transition-colors"
                  >
                    {t('clearAll')}
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
                  <span className="text-gray-700 truncate">
                    {selectedPermissions.length > 0 
                      ? t('permissionsSelected', { count: selectedPermissions.length })
                      : t('clickToSelect')
                    }
                  </span>
                  <div className="flex items-center gap-2">
                    {selectedPermissions.length > 0 && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {selectedPermissions.length}
                      </span>
                    )}
                    {isPermissionsOpen ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                </button>

                {/* Dropdown Content */}
                {isPermissionsOpen && (
                  <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-hidden">
                    {/* Search and Filter Header */}
                    <div className="sticky top-0 bg-white border-b border-gray-200 p-3 space-y-2">
                      {/* Search Input */}
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-4 w-4 text-gray-400" />
                        </div>
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={permissionSearchTerm}
                          onChange={handleSearchChange}
                          placeholder={t('searchPlaceholder')}
                          className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        />
                        {permissionSearchTerm && (
                          <button
                            type="button"
                            onClick={clearSearch}
                            className="absolute inset-y-0 right-0 pr-2 flex items-center hover:text-gray-600"
                          >
                            <X className="h-4 w-4 text-gray-400" />
                          </button>
                        )}
                      </div>

                      {/* Selection Actions for Filtered Results */}
                      {permissionSearchTerm && filteredPermissions.length > 0 && (
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500">
                            {filteredPermissions.length} result(s)
                          </span>
                          <div className="flex gap-1">
                            <button
                              type="button"
                              onClick={handleSelectAllInView}
                              className="text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                            >
                              {t("selectAllInView")}
                            </button>
                            <button
                              type="button"
                              onClick={handleClearAllInView}
                              className="text-gray-600 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-50 transition-colors"
                            >
                              {t("clearAllInView")}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Permissions List */}
                    <div className="max-h-60 overflow-y-auto">
                      {filteredPermissions.length > 0 ? (
                        <div className="divide-y divide-gray-100">
                          {filteredPermissions.map((permission) => {
                            const isChecked = getValues(`permission_${permission.id}`);
                            return (
                              <div
                                key={permission.id}
                                className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-md transition cursor-pointer group"
                                onClick={() => handlePermissionChange(permission.id, !isChecked)}
                              >
                                <div className="relative">
                                  <input
                                    type="checkbox"
                                    id={`permission_${permission.id}`}
                                    {...register(`permission_${permission.id}`)}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    onChange={(e) => {
                                      handlePermissionChange(permission.id, e.target.checked);
                                    }}
                                  />
                                  {isChecked && (
                                    <Check className="w-3 h-3 text-white absolute top-0.5 left-0.5 pointer-events-none" />
                                  )}
                                </div>
                                <label
                                  htmlFor={`permission_${permission.id}`}
                                  className="text-sm text-gray-700 cursor-pointer flex-1 flex items-center justify-between"
                                >
                                  <span>{permission.displayName}</span>
                                  {isChecked && (
                                    <Check className="w-4 h-4 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  )}
                                </label>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="px-4 py-8 text-center">
                          <div className="text-gray-400 mb-2">
                            <Search className="w-8 h-8 mx-auto" />
                          </div>
                          <p className="text-gray-500 text-sm">
                            {permissionSearchTerm ? (
                              <>
                                {t("noPermissionsFoundFor")} {permissionSearchTerm}
                                <br />
                                <button
                                  type="button"
                                  onClick={clearSearch}
                                  className="text-blue-600 hover:text-blue-700 mt-1 text-xs"
                                >
                                  {t('clearSearch')}
                                </button>
                              </>
                            ) : (
                              t('loading')
                            )}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-3 py-2">
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>
                          {selectedPermissions.length} of {screenPermissions.length} selected
                        </span>
                        {permissionSearchTerm && (
                          <button
                            type="button"
                            onClick={clearSearch}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            {t("showAll")} 
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-500 mt-1">
                {t('clickDropdownHint')}
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
                  {t('savingPermissions')}
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {t('savePermissions')}
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
              {t('reset')}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting || createRoleStatus === 'loading'}
              className="flex-none bg-red-200 hover:bg-red-300 disabled:bg-red-100 text-red-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              {t('cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ScreenPermissions;