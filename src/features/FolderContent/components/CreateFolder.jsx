// /* eslint-disable react/prop-types */
// import { useCallback, useState } from "react";
// import { useForm, useFieldArray } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { FolderPlus, Shield, Loader2, AlertCircle } from "lucide-react";
// import { useParams } from "react-router-dom";
// import Popup from "../../../globalComponents/Popup";
// import { fetchPrinciples } from "../../Permissions/permissionsThunks";
// import { useDispatch } from "react-redux";
// import UsersRolesPermissionsTable from "../../Permissions/UsersRolesPermissionsTable";
// import { useTranslation } from "react-i18next";
// import { createNewFolder } from "../folderContentsThunks";

// // Zod validation schema
// const createFolderSchema = z.object({
//   name: z.string().min(1, "Folder name is required").trim(),
//   repositoryId: z.string().or(z.number()),
//   parentFolderId: z.string().nullable().optional(),
//   securityLevel: z
//     .string()
//     .optional()
//     .refine(
//       (val) => {
//         if (!val || val === "") return true; // Optional field
//         const num = parseInt(val);
//         return !isNaN(num) && num >= 0 && num <= 99;
//       },
//       {
//         message: "Security level must be between 0 and 99",
//       }
//     ),
//   aclRules: z.array(z.any()).optional(),
// });

// const CreateFolder = () => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const { repoId } = useParams();
//   const repoIdFromStorage = localStorage.getItem("repoId");
//   const currentRepoId = repoId || repoIdFromStorage;
//   const [openPermissions, setOpenPermissions] = useState(false);
//   const { t } = useTranslation();

//   const {
//     register,
//     handleSubmit,
//     control,
//     reset,
//     watch,
//     formState: { errors },
//   } = useForm({
//     resolver: zodResolver(createFolderSchema),
//     defaultValues: {
//       name: "",
//       repositoryId: currentRepoId,
//       parentFolderId: null,
//       securityLevel: "",
//       aclRules: [],
//     },
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "aclRules",
//   });

//   const dispatch = useDispatch();

//   // State to store permissions data
//   const [permissionsData, setPermissionsData] = useState({
//     clearanceRules: [],
//     aclRules: [],
//   });

//   const onSubmit = async (data) => {
//     // Validate required fields
//     if (
//       !data.name ||
//       typeof data.name !== "string" ||
//       data.name.trim() === ""
//     ) {
//       alert("Please enter a valid folder name");
//       return;
//     }

//     if (!currentRepoId) {
//       alert("Repository ID is required");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       // Transform ACL Rules to match backend format
//       const transformedAclRules =
//         permissionsData.aclRules && permissionsData.aclRules.length > 0
//           ? permissionsData.aclRules.map((rule) => {
//               let permissionsArray = [];
//               if (Array.isArray(rule.permissions)) {
//                 permissionsArray = rule.permissions
//                   .filter((p) => p != null)
//                   .map((p) => {
//                     if (typeof p === "object" && p.code) {
//                       return p.code;
//                     } else if (typeof p === "string" && p.trim() !== "") {
//                       return p.trim();
//                     }
//                     return null;
//                   })
//                   .filter((p) => p != null);
//               } else if (
//                 typeof rule.permissions === "string" &&
//                 rule.permissions.trim() !== ""
//               ) {
//                 permissionsArray = [rule.permissions.trim()];
//               }

//               return {
//                 principalId: String(rule.principalId || ""),
//                 principalType: rule.principalType || "user",
//                 permissions: permissionsArray,
//                 accessType: rule.accessType === 0 ? "deny" : "allow",
//               };
//             })
//           : [];

//       const cleanName = data.name.trim();

//       const submissionData = {
//         name: cleanName,
//         repositoryId: parseInt(currentRepoId),
//         parentFolderId: data.parentFolderId
//           ? parseInt(data.parentFolderId)
//           : null,
//         securityLevel: data.securityLevel ? parseInt(data.securityLevel) : 0,
//         aclRules: transformedAclRules,
//       };

//       const result = await dispatch(createNewFolder(submissionData));

//       // Check for success
//       const isSuccess =
//         (result &&
//           result.type &&
//           result.type.includes("createNewFolder/fulfilled")) ||
//         (result && !result.error) ||
//         (result && result.payload && !result.payload.error) ||
//         result;

//       if (isSuccess) {
//         // Reset the form

//         reset({
//           name: "",
//           repositoryId: currentRepoId,
//           parentFolderId: null,
//           securityLevel: "",
//           aclRules: [],
//         });

//         // Reset permissions data
//         setPermissionsData({
//           clearanceRules: [],
//           aclRules: [],
//         });
//       } else {
//         alert("Failed to create folder. Please try again.");
//       }
//     } catch (error) {
//       alert("An error occurred while creating the folder. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Refresh principles data
//   const refreshPrinciplesData = useCallback(() => {
//     if (currentRepoId) {
//       dispatch(fetchPrinciples(currentRepoId));
//     }
//   }, [dispatch, currentRepoId]);

//   // Handle User Created
//   const handleUserCreated = useCallback(() => {
//     setIsCreateModalOpen(false);
//     refreshPrinciplesData();
//   }, [refreshPrinciplesData]);

//   const handleReset = () => {
//     reset({
//       name: "",
//       repositoryId: currentRepoId,
//       parentFolderId: null,
//       securityLevel: "",
//       aclRules: [],
//     });
//     setPermissionsData({
//       clearanceRules: [],
//       aclRules: [],
//     });
//   };

//   const handleCancel = () => {
//     reset({
//       name: "",
//       repositoryId: currentRepoId,
//       parentFolderId: null,
//       securityLevel: "",
//       aclRules: [],
//     });
//     setPermissionsData({
//       clearanceRules: [],
//       aclRules: [],
//     });
//   };

//   // Handle Create User
//   const handleCreateClick = useCallback(() => {
//     setIsCreateModalOpen(true);
//   }, []);

//   // Handle permissions button click
//   const handlePermissions = () => {
//     setOpenPermissions(true);
//   };

//   // Handle permissions data from UsersRolesPermissionsTable
//   const handlePermissionsDataChange = (data) => {
//     setPermissionsData(data);
//     setOpenPermissions(false);
//   };

//   return (
//     <div className="max-w-2xl mx-auto">
//       {/* Header */}
//       <div className="text-center mb-8">
//         <h2 className="text-3xl font-bold text-gray-900 mb-3 flex justify-center items-center">
//           <FolderPlus className="w-7 h-7 mr-2 text-blue-600" />
//           {t("title")}
//         </h2>
//         <p className="text-gray-600 text-lg">{t("description")}</p>
//       </div>

//       {/* Form Container */}
//       <div className="bg-gray-50 rounded-xl shadow-sm p-6">
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
//           {/* Folder Info Section */}
//           <div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//               <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
//                 <Shield className="w-4 h-4 text-blue-600" />
//               </span>
//               Folder Information
//             </h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Folder Name */}
//               <div>
//                 <label
//                   htmlFor="name"
//                   className="block text-sm font-medium text-gray-700 mb-2"
//                 >
//                   Folder Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   id="name"
//                   name="name"
//                   type="text"
//                   placeholder="Enter folder name"
//                   {...register("name")}
//                   className={`w-full px-4 py-3 border rounded-lg shadow-sm bg-white transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     errors.name
//                       ? "border-red-300 bg-red-50"
//                       : "border-gray-300 hover:border-gray-400"
//                   }`}
//                 />
//                 {errors.name && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center">
//                     <AlertCircle className="w-4 h-4 mr-1" />
//                     {errors.name.message}
//                   </p>
//                 )}
//               </div>

//               {/* Security Level */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Security Level
//                 </label>
//                 <input
//                   type="number"
//                   min="0"
//                   max="99"
//                   {...register("securityLevel")}
//                   placeholder="Enter security level (0-99)"
//                   className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     errors.securityLevel
//                       ? "border-red-300 bg-red-50"
//                       : "border-gray-300 hover:border-gray-400"
//                   }`}
//                 />
//                 {errors.securityLevel && (
//                   <p className="mt-1 text-sm text-red-600 flex items-center">
//                     <AlertCircle className="w-4 h-4 mr-1" />
//                     {errors.securityLevel.message}
//                   </p>
//                 )}
//               </div>

//               {/* Hidden fields */}
//               <input {...register("repositoryId")} type="hidden" />
//               <input {...register("parentFolderId")} type="hidden" />
//             </div>
//           </div>

//           {/* Permissions Button */}
//           <div>
//             <div className="text-center">
//               <button
//                 type="button"
//                 onClick={handlePermissions}
//                 className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium"
//               >
//                 <Shield className="w-4 h-4" />
//                 Configure Permissions
//                 {permissionsData.aclRules.length > 0 && (
//                   <span className="bg-orange-800 text-white px-2 py-1 rounded-full text-xs">
//                     {permissionsData.aclRules.length}
//                   </span>
//                 )}
//               </button>
//             </div>
//           </div>

//           {openPermissions && (
//             <Popup
//               isOpen={openPermissions}
//               setIsOpen={setOpenPermissions}
//               component={
//                 <UsersRolesPermissionsTable
//                   entityType="folder"
//                   onDone={handlePermissionsDataChange}
//                   savedData={permissionsData}
//                 />
//               }
//             />
//           )}

//           {/* Actions */}
//           <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
//             >
//               {isSubmitting ? (
//                 <>
//                   <Loader2 className="w-5 h-5 mr-2 animate-spin" />
//                   Creating Folder...
//                 </>
//               ) : (
//                 <>Create Folder</>
//               )}
//             </button>

//             <button
//               type="button"
//               onClick={handleReset}
//               disabled={isSubmitting}
//               className="flex-none bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center"
//             >
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
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateFolder;

/* eslint-disable react/prop-types */
import { useCallback, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FolderPlus, Shield, Loader2, AlertCircle } from "lucide-react";
import { useParams } from "react-router-dom";
import Popup from "../../../globalComponents/Popup";
import { fetchPrinciples } from "../../Permissions/permissionsThunks";
import { useDispatch } from "react-redux";
import UsersRolesPermissionsTable from "../../Permissions/UsersRolesPermissionsTable";
import { useTranslation } from "react-i18next";
import { createNewFolder } from "../folderContentsThunks";
import ErrorAlert from "../../../globalComponents/Alerts/ErrorAlert";
import SuccessAlert from "../../../globalComponents/Alerts/SuccessAlert";

// Zod validation schema
const createFolderSchema = z.object({
  name: z.string().min(1, "Folder name is required").trim(),
  repositoryId: z.string().or(z.number()),
  parentFolderId: z.string().nullable().optional(),
  securityLevel: z
    .string()
    .optional()
    .refine(
      (val) => {
        if (!val || val === "") return true; // Optional field
        const num = parseInt(val);
        return !isNaN(num) && num >= 0 && num <= 99;
      },
      {
        message: "Security level must be between 0 and 99",
      }
    ),
  aclRules: z.array(z.any()).optional(),
});

const CreateFolder = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { repoId } = useParams();
  const repoIdFromStorage = localStorage.getItem("repoId");
  const currentRepoId = repoId || repoIdFromStorage;
  const [openPermissions, setOpenPermissions] = useState(false);
  const { t } = useTranslation();

  // Alert states
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createFolderSchema),
    defaultValues: {
      name: "",
      repositoryId: currentRepoId,
      parentFolderId: null,
      securityLevel: "",
      aclRules: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "aclRules",
  });

  const dispatch = useDispatch();

  // State to store permissions data
  const [permissionsData, setPermissionsData] = useState({
    clearanceRules: [],
    aclRules: [],
  });

  // Helper function to show success alert
  const showSuccess = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setShowSuccessAlert(true);
    setTimeout(() => {
      setShowSuccessAlert(false);
    }, 2000);
  };

  // Helper function to show error alert
  const showError = (title, message) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setShowErrorAlert(true);
    setTimeout(() => {
      setShowErrorAlert(false);
    }, 2000);
  };

  // Helper function to get error message based on status code
  const getErrorMessage = (statusCode) => {
    statusCode !== 200("Failed to create folder");
  };

  const onSubmit = async (data) => {
    // Validate required fields
    if (
      !data.name ||
      typeof data.name !== "string" ||
      data.name.trim() === ""
    ) {
      showError("Validation Error", "Please enter a valid folder name");
      return;
    }

    if (!currentRepoId) {
      showError("Validation Error", "Repository ID is required");
      return;
    }

    setIsSubmitting(true);

    try {
      // Transform ACL Rules to match backend format
      const transformedAclRules =
        permissionsData.aclRules && permissionsData.aclRules.length > 0
          ? permissionsData.aclRules.map((rule) => {
              let permissionsArray = [];
              if (Array.isArray(rule.permissions)) {
                permissionsArray = rule.permissions
                  .filter((p) => p != null)
                  .map((p) => {
                    if (typeof p === "object" && p.code) {
                      return p.code;
                    } else if (typeof p === "string" && p.trim() !== "") {
                      return p.trim();
                    }
                    return null;
                  })
                  .filter((p) => p != null);
              } else if (
                typeof rule.permissions === "string" &&
                rule.permissions.trim() !== ""
              ) {
                permissionsArray = [rule.permissions.trim()];
              }

              return {
                principalId: String(rule.principalId || ""),
                principalType: rule.principalType || "user",
                permissions: permissionsArray,
                accessType: rule.accessType === 0 ? "deny" : "allow",
              };
            })
          : [];

      const cleanName = data.name.trim();

      const submissionData = {
        name: cleanName,
        repositoryId: parseInt(currentRepoId),
        parentFolderId: data.parentFolderId
          ? parseInt(data.parentFolderId)
          : null,
        securityLevel: data.securityLevel ? parseInt(data.securityLevel) : 0,
        aclRules: transformedAclRules,
      };

      const result = await dispatch(createNewFolder(submissionData));
      console.log(result);

      // Get status from the response
      // result.payload now contains the full response object
      const status = result.payload?.status || findStatusInError(result.error);

      function findStatusInError(error) {
        if (error && typeof error === "object") {
          if (error.status) return error.status;
          for (const value of Object.values(error)) {
            const found = findStatusInError(value);
            if (found) return found;
          }
        }
        return null;
      }

      // Simple check: status 200 = success, anything else = error
      if (status === 200) {
        showSuccess(
          "Folder Created Successfully",
          `The folder "${cleanName}" has been created successfully.`
        );

        reset({
          name: "",
          repositoryId: currentRepoId,
          parentFolderId: null,
          securityLevel: "",
          aclRules: [],
        });

        setPermissionsData({
          clearanceRules: [],
          aclRules: [],
        });
      } else {
        const errorMessage = status
          ? getErrorMessage(status)
          : "Failed to create folder. Please try again.";
        showError("Failed to Create Folder", errorMessage);
      }
    } catch (error) {
      console.error("Error creating folder:", error);

      // Handle network or other unexpected errors
      let errorMessage = "Network error occurred while creating the folder.";
      let statusCode = null;

      if (error.response?.status) {
        statusCode = error.response.status;
        errorMessage = getErrorMessage(statusCode);
      } else if (error.status) {
        statusCode = error.status;
        errorMessage = getErrorMessage(statusCode);
      } else if (error.code === "NETWORK_ERROR") {
        errorMessage =
          "Network connection failed. Please check your connection and try again.";
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }

      showError("Error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Refresh principles data
  const refreshPrinciplesData = useCallback(() => {
    if (currentRepoId) {
      dispatch(fetchPrinciples(currentRepoId));
    }
  }, [dispatch, currentRepoId]);

  // Handle User Created
  const handleUserCreated = useCallback(() => {
    setIsCreateModalOpen(false);
    refreshPrinciplesData();
  }, [refreshPrinciplesData]);

  const handleReset = () => {
    reset({
      name: "",
      repositoryId: currentRepoId,
      parentFolderId: null,
      securityLevel: "",
      aclRules: [],
    });
    setPermissionsData({
      clearanceRules: [],
      aclRules: [],
    });

    // Close any open alerts
    setShowSuccessAlert(false);
    setShowErrorAlert(false);
  };

  const handleCancel = () => {
    reset({
      name: "",
      repositoryId: currentRepoId,
      parentFolderId: null,
      securityLevel: "",
      aclRules: [],
    });
    setPermissionsData({
      clearanceRules: [],
      aclRules: [],
    });

    // Close any open alerts
    setShowSuccessAlert(false);
    setShowErrorAlert(false);
  };

  // Handle Create User
  const handleCreateClick = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  // Handle permissions button click
  const handlePermissions = () => {
    setOpenPermissions(true);
  };

  // Handle permissions data from UsersRolesPermissionsTable
  const handlePermissionsDataChange = (data) => {
    setPermissionsData(data);
    setOpenPermissions(false);
  };

  // Alert close handlers
  const handleCloseSuccessAlert = () => {
    setShowSuccessAlert(false);
  };

  const handleCloseErrorAlert = () => {
    setShowErrorAlert(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-3 flex justify-center items-center">
          <FolderPlus className="w-7 h-7 mr-2 text-blue-600" />
          {t("Create Folder")}
        </h2>
        <p className="text-gray-600 text-lg">{t("description")}</p>
      </div>

      {/* Form Container */}
      <div className="bg-gray-50 rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Folder Info Section */}
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <Shield className="w-4 h-4 text-blue-600" />
              </span>
              Folder Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Folder Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Folder Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Enter folder name"
                  {...register("name")}
                  className={`w-full px-4 py-3 border rounded-lg shadow-sm bg-white transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Security Level */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Security Level
                </label>
                <input
                  type="number"
                  min="0"
                  max="99"
                  {...register("securityLevel")}
                  placeholder="Enter security level (0-99)"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.securityLevel
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                />
                {errors.securityLevel && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.securityLevel.message}
                  </p>
                )}
              </div>

              {/* Hidden fields */}
              <input {...register("repositoryId")} type="hidden" />
              <input {...register("parentFolderId")} type="hidden" />
            </div>
          </div>

          {/* Permissions Button */}
          <div>
            <div className="text-center">
              <button
                type="button"
                onClick={handlePermissions}
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium"
              >
                <Shield className="w-4 h-4" />
                Configure Permissions
                {permissionsData.aclRules.length > 0 && (
                  <span className="bg-orange-800 text-white px-2 py-1 rounded-full text-xs">
                    {permissionsData.aclRules.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {openPermissions && (
            <Popup
              isOpen={openPermissions}
              setIsOpen={setOpenPermissions}
              component={
                <UsersRolesPermissionsTable
                  entityType="folder"
                  onDone={handlePermissionsDataChange}
                  savedData={permissionsData}
                />
              }
            />
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Creating Folder...
                </>
              ) : (
                <>Create Folder</>
              )}
            </button>

            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="flex-none bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center"
            >
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

      {/* Success Alert */}
      <SuccessAlert
        show={showSuccessAlert}
        onClose={handleCloseSuccessAlert}
        title={alertTitle}
        message={alertMessage}
      />

      {/* Error Alert */}
      <ErrorAlert
        show={showErrorAlert}
        onClose={handleCloseErrorAlert}
        title={alertTitle}
        message={alertMessage}
      />
    </div>
  );
};

export default CreateFolder;
