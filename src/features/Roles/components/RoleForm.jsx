// /* eslint-disable react/prop-types */
// import React, { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useDispatch } from "react-redux";
// import {
//   Briefcase,
//   CheckCircle,
//   AlertCircle,
//   Loader2,
//   RotateCcw,
// } from "lucide-react";
// import { createRole } from "../RolesThunks";

// // Simple validation schema for role name only
// const getValidationSchema = () =>
//   z.object({
//     name: z
//       .string()
//       .min(1, "Role name is required")
//       .min(2, "Role name must be at least 2 characters")
//       .max(50, "Role name must be less than 50 characters")
//       .trim(),
//   });

// const RoleForm = ({
//   mode = "create",
//   initialData = null,
//   onSuccess,
//   onCancel,
// }) => {
//   const dispatch = useDispatch();
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const isEditMode = mode === "edit";

//   // Get default values based on mode
//   const getDefaultValues = () => {
//     if (isEditMode && initialData) {
//       return {
//         name: initialData.name || "",
//       };
//     }
//     return {
//       name: "",
//     };
//   };

//   // React Hook Form with validation schema
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isValid },
//     reset,
//     setValue,
//     trigger,
//   } = useForm({
//     resolver: zodResolver(getValidationSchema()),
//     mode: "onChange",
//     defaultValues: getDefaultValues(),
//   });

//   // Initialize form data when in edit mode or when initialData changes
//   useEffect(() => {
//     if (isEditMode && initialData) {
//       console.log("Initializing role form with data:", initialData);

//       // Set form values
//       setValue("name", initialData.name || "");

//       // Trigger validation
//       trigger();
//     }
//   }, [isEditMode, initialData, setValue, trigger]);

//   // Form submission handler
//   const onSubmit = async (data) => {
//     try {
//       setIsSubmitting(true);

//       // Prepare data for submission
//       const submitData = { ...data };

//       // In edit mode, include the ID
//       if (isEditMode && initialData) {
//         submitData.id = initialData.id;
//       }

//       console.log(`${isEditMode ? "UPDATE" : "CREATE"} Role Data:`, submitData);

//       // TODO: Replace with actual API calls
//       // For now, just simulate success
//       setTimeout(() => {
//         console.log(`Role ${isEditMode ? "updated" : "created"} successfully!`);

//         // Call success callback to close modal and refresh data
//         if (onSuccess) {
//           onSuccess(submitData);
//         }
//         setIsSubmitting(false);
//       }, 1000);
//     } catch (error) {
//       console.error(
//         `Failed to ${isEditMode ? "update" : "create"} role:`,
//         error
//       );
//       alert(
//         `Failed to ${isEditMode ? "update" : "create"} role. Please try again.`
//       );
//       setIsSubmitting(false);
//     }
//   };

//   // Reset form handler
//   const handleReset = () => {
//     if (isEditMode && initialData) {
//       // Reset to initial data in edit mode
//       setValue("name", initialData.name || "");
//     } else {
//       // Reset to empty in create mode
//       reset();
//     }
//   };

//   // Cancel handler
//   const handleCancel = () => {
//     if (onCancel) {
//       onCancel();
//     }
//   };

//   return (
//     <div className="max-w-lg mx-auto">
//       {/* Header */}
//       <div className="text-center mb-8">
//         <h2 className="text-3xl font-bold text-gray-900 mb-4">
//           {isEditMode ? "Update Role" : "Create New Role"}
//         </h2>
//         <p className="text-lg text-gray-600">
//           {isEditMode
//             ? "Update the role name below"
//             : "Enter a name for the new role"}
//         </p>
//       </div>

//       {/* Form Container */}
//       <div className="bg-gray-50 rounded-xl p-6">
//         <div className="space-y-6">
//           {/* Role Information Section */}
//           <div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//               <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
//                 <Briefcase className="w-4 h-4 text-blue-600" />
//               </span>
//               Role Information
//             </h3>

//             <div className="space-y-4">
//               {/* Role name */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Role Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   {...register("name")}
//                   type="text"
//                   autoComplete="off"
//                   className={`w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
//                     errors.name
//                       ? "border-red-300 bg-red-50"
//                       : "border-gray-300 hover:border-gray-400 focus:border-blue-500"
//                   }`}
//                   placeholder="Enter role name (e.g., Administrator, Manager, Editor)"
//                 />
//                 {errors.name && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center">
//                     <AlertCircle className="w-4 h-4 mr-1" />
//                     {errors.name.message}
//                   </p>
//                 )}
//                 <p className="mt-1 text-xs text-gray-500">
//                   This will be the display name for the role in the system
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
//                   {isEditMode ? "Updating Role..." : "Creating Role..."}
//                 </>
//               ) : (
//                 <>
//                   <CheckCircle className="w-5 h-5 mr-2" />
//                   {isEditMode ? "Update Role" : "Create Role"}
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

// export default React.memo(RoleForm);

/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch } from "react-redux";
import {
  Database,
  CheckCircle,
  AlertCircle,
  Loader2,
  RotateCcw,
} from "lucide-react";

// Simple validation schema for repository name only
const getValidationSchema = () =>
  z.object({
    name: z
      .string()
      .min(1, "Repository name is required")
      .min(2, "Repository name must be at least 2 characters")
      .max(100, "Repository name must be less than 100 characters")
      .regex(
        /^[a-zA-Z0-9_\-\s]+$/,
        "Repository name can only contain letters, numbers, underscores, hyphens, and spaces"
      )
      .trim(),
  });

const RepositoryForm = ({
  mode = "create",
  initialData = null,
  onSuccess,
  onCancel,
}) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = mode === "edit";

  // Get default values based on mode
  const getDefaultValues = () => {
    if (isEditMode && initialData) {
      return {
        name: initialData.name || "",
      };
    }
    return {
      name: "",
    };
  };

  // React Hook Form with validation schema
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    trigger,
  } = useForm({
    resolver: zodResolver(getValidationSchema()),
    mode: "onChange",
    defaultValues: getDefaultValues(),
  });

  // Initialize form data when in edit mode or when initialData changes
  useEffect(() => {
    if (isEditMode && initialData) {
      console.log("Initializing repository form with data:", initialData);

      // Set form values
      setValue("name", initialData.name || "");

      // Trigger validation
      trigger();
    }
  }, [isEditMode, initialData, setValue, trigger]);

  // Form submission handler
  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);

      // Prepare data for submission
      const submitData = { ...data };

      // In edit mode, include the ID
      if (isEditMode && initialData) {
        submitData.id = initialData.id;
      }

      console.log(
        `${isEditMode ? "UPDATE" : "CREATE"} Repository Data:`,
        submitData
      );

      // TODO: Replace with actual API calls
      // For now, just simulate success
      setTimeout(() => {
        console.log(
          `Repository ${isEditMode ? "updated" : "created"} successfully!`
        );

        // Call success callback to close modal and refresh data
        if (onSuccess) {
          onSuccess(submitData);
        }
        setIsSubmitting(false);
      }, 1000);
    } catch (error) {
      console.error(
        `Failed to ${isEditMode ? "update" : "create"} repository:`,
        error
      );
      alert(
        `Failed to ${
          isEditMode ? "update" : "create"
        } repository. Please try again.`
      );
      setIsSubmitting(false);
    }
  };

  // Reset form handler
  const handleReset = () => {
    if (isEditMode && initialData) {
      // Reset to initial data in edit mode
      setValue("name", initialData.name || "");
    } else {
      // Reset to empty in create mode
      reset();
    }
  };

  // Cancel handler
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {isEditMode ? "Update Repository" : "Create New Repository"}
        </h2>
        <p className="text-lg text-gray-600">
          {isEditMode
            ? "Update the repository name below"
            : "Enter a name for the new repository"}
        </p>
      </div>

      {/* Form Container */}
      <div className="bg-gray-50 rounded-xl p-6">
        <div className="space-y-6">
          {/* Repository Information Section */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <Database className="w-4 h-4 text-blue-600" />
              </span>
              Repository Information
            </h3>

            <div className="space-y-4">
              {/* Repository name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Repository Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("name")}
                  type="text"
                  autoComplete="off"
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white ${
                    errors.name
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400 focus:border-blue-500"
                  }`}
                  placeholder="Enter repository name (e.g., My Project, Data Archive, Documents)"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.name.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  This will be the display name for the repository in the system
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
                  {isEditMode
                    ? "Updating Repository..."
                    : "Creating Repository..."}
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5 mr-2" />
                  {isEditMode ? "Update Repository" : "Create Repository"}
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

export default React.memo(RepositoryForm);
