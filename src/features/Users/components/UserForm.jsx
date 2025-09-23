// /* eslint-disable react/prop-types */
// import React, { useState, useRef, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useDispatch } from "react-redux";
// import {
//   User,
//   Mail,
//   Lock,
//   Briefcase,
//   CheckCircle,
//   AlertCircle,
//   Loader2,
//   RotateCcw,
//   Eye,
//   EyeOff,
// } from "lucide-react";
// import { createUser } from "../usersThunks";

// // Array of available roles
// const ROLES = [
//   { value: "admin", label: "Administrator" },
//   { value: "manager", label: "Manager" },
//   { value: "editor", label: "Editor" },
//   { value: "user", label: "User" },
//   { value: "viewer", label: "Viewer" },
// ];

// // Validation schema with Zod
// const validationSchema = z.object({
//   userName: z
//     .string()
//     .min(1, "Username is required")
//     .min(3, "Username must be at least 3 characters")
//     .max(30, "Username must be less than 30 characters")
//     .regex(
//       /^[a-zA-Z0-9_]+$/,
//       "Username can only contain letters, numbers, and underscores"
//     )
//     .trim(),
//   email: z
//     .string()
//     .min(1, "Email is required")
//     .email("Please enter a valid email address")
//     .toLowerCase(),
//   password: z
//     .string()
//     .min(1, "Password is required")
//     .min(8, "Password must be at least 8 characters")
//     .max(100, "Password must be less than 100 characters")
//     .regex(
//       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
//       "Password must contain at least one uppercase letter, one lowercase letter, and one number"
//     ),
//   role: z
//     .array(z.string())
//     .min(1, "At least one role is required")
//     .refine(
//       (roles) => roles.every((role) => ROLES.some((r) => r.value === role)),
//       {
//         message: "Please select valid roles only",
//       }
//     ),
// });

// const UserForm = ({ onSuccess, onCancel }) => {
//   const dispatch = useDispatch();
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   // Multi-select role states
//   const [selectedRoles, setSelectedRoles] = useState([]);
//   const [roleSearchTerm, setRoleSearchTerm] = useState("");
//   const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

//   // Ref for dropdown container
//   const dropdownRef = useRef(null);

//   // React Hook Form with Zod resolver
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isValid, isDirty },
//     reset,
//     watch,
//     setValue,
//     trigger,
//   } = useForm({
//     resolver: zodResolver(validationSchema),
//     mode: "onChange",
//     defaultValues: {
//       userName: "",
//       email: "",
//       password: "",
//       role: [],
//     },
//   });

//   // Handle click outside to close dropdown
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsRoleDropdownOpen(false);
//       }
//     };

//     if (isRoleDropdownOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//     }

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, [isRoleDropdownOpen]);

//   // Watch form values for dynamic behavior
//   const watchedRole = watch("role");

//   // Filter roles based on search term
//   const filteredRoles = ROLES.filter((role) =>
//     role.label.toLowerCase().includes(roleSearchTerm.toLowerCase())
//   );

//   // Handle role selection
//   const handleRoleToggle = (roleValue) => {
//     let updatedRoles;
//     if (selectedRoles.includes(roleValue)) {
//       updatedRoles = selectedRoles.filter((role) => role !== roleValue);
//     } else {
//       updatedRoles = [...selectedRoles, roleValue];
//     }

//     setSelectedRoles(updatedRoles);
//     setValue("role", updatedRoles);
//     trigger("role"); // Trigger validation
//   };

//   // Remove role
//   const removeRole = (roleValue) => {
//     const updatedRoles = selectedRoles.filter((role) => role !== roleValue);
//     setSelectedRoles(updatedRoles);
//     setValue("role", updatedRoles);
//     trigger("role");
//   };

//   // Get role label by value
//   const getRoleLabel = (value) => {
//     return ROLES.find((role) => role.value === value)?.label || value;
//   };

//   // Toggle password visibility
//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   // Form submission handler
//   const onSubmit = async (data) => {
//     try {
//       setIsSubmitting(true);
//       console.log(data);

//       // Dispatch create user action
//       const result = await dispatch(createUser(data));

//       if (result.payload) {
//         console.log("User created successfully:", result.payload);

//         // Call success callback to close modal and refresh data
//         if (onSuccess) {
//           onSuccess(result.payload);
//         }
//       } else {
//         throw new Error("Failed to create user");
//       }
//     } catch (error) {
//       console.error("Failed to create user:", error);
//       alert("Failed to create user. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Reset form handler
//   const handleReset = () => {
//     reset();
//     setSelectedRoles([]);
//     setRoleSearchTerm("");
//     setIsRoleDropdownOpen(false);
//   };

//   // Cancel handler
//   const handleCancel = () => {
//     if (onCancel) {
//       onCancel();
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto">
//       {/* Header */}
//       <div className="text-center mb-8">
//         <h2 className="text-3xl font-bold text-gray-900 mb-4">
//           Create New User
//         </h2>
//         <p className="text-lg text-gray-600">
//           Fill in the basic information to create a new user account
//         </p>
//       </div>

//       {/* Form Container */}
//       <div className="bg-gray-50 rounded-xl p-6">
//         <div className="space-y-6">
//           {/* Account Information Section */}
//           <div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//               <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
//                 <User className="w-4 h-4 text-blue-600" />
//               </span>
//               Account Information
//             </h3>

//             <div className="space-y-4">
//               {/* Username */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Username <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   {...register("userName")}
//                   type="text"
//                   autoComplete="new-password"
//                   className={`w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
//                     errors.userName
//                       ? "border-red-300 bg-red-50"
//                       : "border-gray-300 hover:border-gray-400 focus:border-blue-500"
//                   }`}
//                   placeholder="Enter username"
//                 />
//                 {errors.userName && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center">
//                     <AlertCircle className="w-4 h-4 mr-1" />
//                     {errors.userName.message}
//                   </p>
//                 )}
//               </div>

//               {/* Email */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Email Address <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Mail className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     {...register("email")}
//                     type="email"
//                     autoComplete="new-password"
//                     className={`w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
//                       errors.email
//                         ? "border-red-300 bg-red-50"
//                         : "border-gray-300 hover:border-gray-400 focus:border-blue-500"
//                     }`}
//                     placeholder="john@example.com"
//                   />
//                 </div>
//                 {errors.email && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center">
//                     <AlertCircle className="w-4 h-4 mr-1" />
//                     {errors.email.message}
//                   </p>
//                 )}
//               </div>

//               {/* Password */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Password <span className="text-red-500">*</span>
//                 </label>
//                 <div className="relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Lock className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     {...register("password")}
//                     type={showPassword ? "text" : "password"}
//                     autoComplete="new-password"
//                     className={`w-full pl-10 pr-12 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
//                       errors.password
//                         ? "border-red-300 bg-red-50"
//                         : "border-gray-300 hover:border-gray-400 focus:border-blue-500"
//                     }`}
//                     placeholder="Enter a strong password"
//                   />
//                   <button
//                     type="button"
//                     onClick={togglePasswordVisibility}
//                     className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   >
//                     {showPassword ? (
//                       <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                     ) : (
//                       <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                     )}
//                   </button>
//                 </div>
//                 {errors.password && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center">
//                     <AlertCircle className="w-4 h-4 mr-1" />
//                     {errors.password.message}
//                   </p>
//                 )}
//                 <p className="mt-1 text-xs text-gray-500">
//                   Password must contain at least 8 characters with uppercase,
//                   lowercase, and numbers
//                 </p>
//               </div>

//               {/* Roles - Multi Select */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Roles <span className="text-red-500">*</span>
//                 </label>

//                 {/* Selected Roles Display */}
//                 {selectedRoles.length > 0 && (
//                   <div className="flex flex-wrap gap-2 mb-2">
//                     {selectedRoles.map((roleValue) => (
//                       <span
//                         key={roleValue}
//                         className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
//                       >
//                         {getRoleLabel(roleValue)}
//                         <button
//                           type="button"
//                           onClick={() => removeRole(roleValue)}
//                           className="ml-1 hover:text-blue-600"
//                         >
//                           ×
//                         </button>
//                       </span>
//                     ))}
//                   </div>
//                 )}

//                 {/* Role Search Input */}
//                 <div className="relative" ref={dropdownRef}>
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <Briefcase className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     type="text"
//                     value={roleSearchTerm}
//                     onChange={(e) => setRoleSearchTerm(e.target.value)}
//                     onFocus={() => setIsRoleDropdownOpen(true)}
//                     className={`w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
//                       errors.role
//                         ? "border-red-300 bg-red-50"
//                         : "border-gray-300 hover:border-gray-400 focus:border-blue-500"
//                     }`}
//                     placeholder="Search and select roles..."
//                   />

//                   {/* Dropdown */}
//                   {isRoleDropdownOpen && (
//                     <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//                       {filteredRoles.length > 0 ? (
//                         filteredRoles.map((role) => (
//                           <div
//                             key={role.value}
//                             className={`flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer ${
//                               selectedRoles.includes(role.value)
//                                 ? "bg-blue-50"
//                                 : ""
//                             }`}
//                             onClick={() => handleRoleToggle(role.value)}
//                           >
//                             <div className="flex items-center">
//                               <input
//                                 type="checkbox"
//                                 checked={selectedRoles.includes(role.value)}
//                                 onChange={() => {}} // Handled by onClick
//                                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
//                               />
//                               <span className="text-sm font-medium text-gray-700">
//                                 {role.label}
//                               </span>
//                             </div>
//                             {selectedRoles.includes(role.value) && (
//                               <CheckCircle className="h-4 w-4 text-blue-600" />
//                             )}
//                           </div>
//                         ))
//                       ) : (
//                         <div className="px-4 py-2 text-sm text-gray-500">
//                           No roles found matching &quot;{roleSearchTerm}&quot;
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>

//                 {errors.role && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center">
//                     <AlertCircle className="w-4 h-4 mr-1" />
//                     {errors.role.message}
//                   </p>
//                 )}

//                 <p className="mt-1 text-xs text-gray-500">
//                   You can select multiple roles. Selected:{" "}
//                   {selectedRoles.length}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Form Actions */}
//           <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
//             <button
//               type="button"
//               onClick={handleSubmit(onSubmit)}
//               disabled={isSubmitting || !isValid}
//               className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                   Creating User...
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle className="w-5 h-5 mr-2" />
//                   Create User
//                 </>
//               )}
//             </button>

//             <button
//               type="button"
//               onClick={handleReset}
//               disabled={isSubmitting}
//               className="flex-none bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center"
//             >
//               <RotateCcw className="w-4 h-4 mr-2" />
//               Reset
//             </button>

//             <button
//               type="button"
//               onClick={handleCancel}
//               disabled={isSubmitting}
//               className="flex-none bg-red-200 hover:bg-red-300 disabled:bg-red-100 text-red-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
//             >
//               Cancel
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default React.memo(UserForm);

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

// Array of available roles
const ROLES = [
  { value: "admin", label: "Administrator" },
  { value: "manager", label: "Manager" },
  { value: "editor", label: "Editor" },
  { value: "user", label: "User" },
  { value: "viewer", label: "Viewer" },
];

// Dynamic validation schema based on mode
const getValidationSchema = (isEditMode) =>
  z.object({
    userName: z
      .string()
      .min(1, "Username is required")
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be less than 30 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores"
      )
      .trim(),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Please enter a valid email address")
      .toLowerCase(),
    password: isEditMode
      ? z.string().optional().or(z.literal("")) // Optional in edit mode
      : z
          .string()
          .min(1, "Password is required")
          .min(8, "Password must be at least 8 characters")
          .max(100, "Password must be less than 100 characters")
          .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
          ),
    role: z
      .array(z.string())
      .min(1, "At least one role is required")
      .refine(
        (roles) => roles.every((role) => ROLES.some((r) => r.value === role)),
        {
          message: "Please select valid roles only",
        }
      ),
  });

const UserForm = ({
  mode = "create",
  initialData = null,
  onSuccess,
  onCancel,
}) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const isEditMode = mode === "edit";

  // Multi-select role states
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [roleSearchTerm, setRoleSearchTerm] = useState("");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  // Ref for dropdown container
  const dropdownRef = useRef(null);

  // Get default values based on mode
  const getDefaultValues = () => {
    if (isEditMode && initialData) {
      return {
        userName: initialData.userName || "",
        email: initialData.email || "",
        password: "", // Always start with empty password in edit mode
        role: Array.isArray(initialData.role) ? initialData.role : [],
      };
    }
    return {
      userName: "",
      email: "",
      password: "",
      role: [],
    };
  };

  // React Hook Form with dynamic validation schema
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    watch,
    setValue,
    trigger,
  } = useForm({
    resolver: zodResolver(getValidationSchema(isEditMode)),
    mode: "onChange",
    defaultValues: getDefaultValues(),
  });

  // Initialize form data when in edit mode or when initialData changes
  useEffect(() => {
    if (isEditMode && initialData) {
      console.log("Initializing user form with data:", initialData);

      // Set form values
      setValue("userName", initialData.userName || "");
      setValue("email", initialData.email || "");
      setValue("password", "");
      setValue("role", Array.isArray(initialData.role) ? initialData.role : []);

      // Set selected roles state
      setSelectedRoles(Array.isArray(initialData.role) ? initialData.role : []);

      // Trigger validation
      trigger();
    }
  }, [isEditMode, initialData, setValue, trigger]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsRoleDropdownOpen(false);
      }
    };

    if (isRoleDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isRoleDropdownOpen]);

  // Watch form values for dynamic behavior
  const watchedRole = watch("role");

  // Filter roles based on search term
  const filteredRoles = ROLES.filter((role) =>
    role.label.toLowerCase().includes(roleSearchTerm.toLowerCase())
  );

  // Handle role selection
  const handleRoleToggle = (roleValue) => {
    let updatedRoles;
    if (selectedRoles.includes(roleValue)) {
      updatedRoles = selectedRoles.filter((role) => role !== roleValue);
    } else {
      updatedRoles = [...selectedRoles, roleValue];
    }

    setSelectedRoles(updatedRoles);
    setValue("role", updatedRoles);
    trigger("role"); // Trigger validation
  };

  // Remove role
  const removeRole = (roleValue) => {
    const updatedRoles = selectedRoles.filter((role) => role !== roleValue);
    setSelectedRoles(updatedRoles);
    setValue("role", updatedRoles);
    trigger("role");
  };

  // Get role label by value
  const getRoleLabel = (value) => {
    return ROLES.find((role) => role.value === value)?.label || value;
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Form submission handler
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Prepare data for submission
      const submitData = { ...data };

      // In edit mode, include the ID and handle password
      if (isEditMode && initialData) {
        submitData.id = initialData.id;
        // If password is empty in edit mode, don't include it
        if (!submitData.password || submitData.password.trim() === "") {
          delete submitData.password;
        }
      }

      console.log(`${isEditMode ? "UPDATE" : "CREATE"} User Data:`, submitData);

      // TODO: Replace with actual API calls
      // For now, just simulate success
      setTimeout(() => {
        console.log(`User ${isEditMode ? "updated" : "created"} successfully!`);

        // Call success callback to close modal and refresh data
        if (onSuccess) {
          onSuccess(submitData);
        }
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error(
        `Failed to ${isEditMode ? "update" : "create"} user:`,
        error
      );
      alert(
        `Failed to ${isEditMode ? "update" : "create"} user. Please try again.`
      );
      setIsSubmitting(false);
    }
  };

  // Reset form handler
  const handleReset = () => {
    if (isEditMode && initialData) {
      // Reset to initial data in edit mode
      setValue("userName", initialData.userName || "");
      setValue("email", initialData.email || "");
      setValue("password", "");
      setValue("role", Array.isArray(initialData.role) ? initialData.role : []);
      setSelectedRoles(Array.isArray(initialData.role) ? initialData.role : []);
    } else {
      // Reset to empty in create mode
      reset();
      setSelectedRoles([]);
    }
    setRoleSearchTerm("");
    setIsRoleDropdownOpen(false);
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
          {isEditMode ? "Update User" : "Create New User"}
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
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username <span className="text-red-500">*</span>
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
                  placeholder="Enter username"
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
                  Email Address <span className="text-red-500">*</span>
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
                    placeholder="john@example.com"
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
                  Password{" "}
                  {!isEditMode && <span className="text-red-500">*</span>}
                  {isEditMode && (
                    <span className="text-gray-500 text-xs ml-2">
                      (Leave empty to keep current password)
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
                        ? "Leave empty to keep current password"
                        : "Enter a strong password"
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
                    Password must contain at least 8 characters with uppercase,
                    lowercase, and numbers
                  </p>
                )}
              </div>

              {/* Roles - Multi Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Roles <span className="text-red-500">*</span>
                </label>

                {/* Selected Roles Display */}
                {selectedRoles.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedRoles.map((roleValue) => (
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
                <div className="relative" ref={dropdownRef}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Briefcase className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={roleSearchTerm}
                    onChange={(e) => setRoleSearchTerm(e.target.value)}
                    onFocus={() => setIsRoleDropdownOpen(true)}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
                      errors.role
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 hover:border-gray-400 focus:border-blue-500"
                    }`}
                    placeholder="Search and select roles..."
                  />

                  {/* Dropdown */}
                  {isRoleDropdownOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredRoles.length > 0 ? (
                        filteredRoles.map((role) => (
                          <div
                            key={role.value}
                            className={`flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer ${
                              selectedRoles.includes(role.value)
                                ? "bg-blue-50"
                                : ""
                            }`}
                            onClick={() => handleRoleToggle(role.value)}
                          >
                            <div className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedRoles.includes(role.value)}
                                onChange={() => {}} // Handled by onClick
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mr-3"
                              />
                              <span className="text-sm font-medium text-gray-700">
                                {role.label}
                              </span>
                            </div>
                            {selectedRoles.includes(role.value) && (
                              <CheckCircle className="h-4 w-4 text-blue-600" />
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          No roles found matching &quot;{roleSearchTerm}&quot;
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {errors.role && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.role.message}
                  </p>
                )}

                <p className="mt-1 text-xs text-gray-500">
                  You can select multiple roles. Selected:{" "}
                  {selectedRoles.length}
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting || !isValid}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  {isEditMode ? "Updating User..." : "Creating User..."}
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {isEditMode ? "Update User" : "Create User"}
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
        </div>
      </div>
    </div>
  );
};

export default React.memo(UserForm);
