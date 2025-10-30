// /* eslint-disable react/prop-types */
// import React, { useCallback, useState } from "react";
// import { useForm, useFieldArray } from "react-hook-form";
// import {
//   FolderPlus,
//   Shield,
//   CheckCircle,
//   Loader2,
//   RotateCcw,
//   Trash2,
//   PlusCircle,
//   AlertCircle,
//   Plus,
// } from "lucide-react";
// import { useParams } from "react-router-dom";
// import UserForm from "../../Users/components/UserForm";
// import Popup from "../../../globalComponents/Popup";
// import { fetchUsers } from "../../Users/usersThunks";
// import { useDispatch } from "react-redux";
// import UsersRolesPermissionsTable from "../../Permissions/UsersRolesPermissionsTable";
// import { useTranslation } from "react-i18next";

// const CreateFolder = () => {
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   // Modal states
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const repoId = localStorage.getItem('repoId');
//   const [openPermissions, setOpenPermissions] = useState(false);
//     const { t } = useTranslation();
  

//   const {
//     register,
//     handleSubmit,
//     control,
//     reset,
//     formState: { errors },
//   } = useForm({
//     defaultValues: {
//       name: "",
//       repositoryId: repoId,
//       parentFolderId: "",
//       securityLevel: "",
//       aclRules: [
//         {
//           principalId: "",
//           principalType: 1,
//           permissions: [""],
//           accessType: 1,
//         },
//       ],
//     },
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "aclRules",
//   });

//   const dispatch = useDispatch();

//   const onSubmit = async (data) => {
//     setIsSubmitting(true);
//     console.log("Folder data:", data);
//     // simulate API delay
//     setTimeout(() => {
//       alert("Folder created successfully!");
//       reset();
//       setIsSubmitting(false);
//     }, 1000);
//   };

//   // Simplified refresh - just dispatch again
//   const refreshUsersData = useCallback(() => {
//     dispatch(fetchUsers());
//   }, [dispatch]);

//   // Handle User Created
//   const handleUserCreated = useCallback(() => {
//     setIsCreateModalOpen(false);
//     refreshUsersData();
//   }, [refreshUsersData]);

//   const handleReset = () => reset();

//   const handleCancel = () => {
//     reset();
//     console.log("Action canceled");
//   };

//   // Handle Create User
//   const handleCreateClick = useCallback(() => {
//     setIsCreateModalOpen(true);
//   }, []);

//   // Handle permissions button click
//   const handlePermissions = () => {
//     setOpenPermissions(true);
//     console.log("Opening permissions modal/page");
//   };

//   // State to store permissions data
//   const [permissionsData, setPermissionsData] = useState({
//     clearanceRules: [],
//     aclRules: [],
//   });

//   // Handle permissions data from UsersRolesPermissionsTable
//   const handlePermissionsDataChange = (data) => {
//     console.log("Received permissions data:", data);
//     setPermissionsData(data);
//     setOpenPermissions(false); // Close the popup
//   };

//   return (
//     <div className="max-w-2xl mx-auto">
//       {/* Header */}
//       <div className="text-center mb-8">
//         <h2 className="text-3xl font-bold text-gray-900 mb-3 flex justify-center items-center">
//           <FolderPlus className="w-7 h-7 mr-2 text-blue-600" />
//           {t("title")}
//         </h2>
//         <p className="text-gray-600 text-lg">
//           {t.description}
//         </p>
//       </div>

//       {/* Form Container */}
//       <div className="bg-gray-50 rounded-xl shadow-sm">
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
//           {/* Folder Info Section */}
//           <div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//               <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
//                 <Shield className="w-4 h-4 text-blue-600" />
//               </span>
//               {t.folderInfo}
//             </h3>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Folder Name */}
//               <div>
//                 <label
//                   htmlFor="name"
//                   className="block text-sm font-medium text-gray-700 mb-2"
//                 >
//                   {t("folderName")} <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   id="name"
//                   type="text"
//                   placeholder={t("enterFolderName")}
//                   {...register("name", { required: t("folderNameRequired") })}
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
//                   {t("securityLevel")}
//                 </label>
//                 <input
//                   type="number"
//                   {...register("securityLevel")}
//                   placeholder={t("enterSecurityLevel")}
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>

//               {/* Hidden Repository and Parent Folder IDs */}
//               <input
//                 type="number"
//                 {...register("repositoryId")}
//                 hidden
//                 disabled
//               />
//               <input
//                 type="number"
//                 {...register("parentFolderId")}
//                 hidden
//                 disabled
//               />
//             </div>
//           </div>

//           {/* ACL Rules Section */}
//           <div>
//             <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
//               <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
//                 <CheckCircle className="w-4 h-4 text-green-600" />
//               </span>
//               {t("accessControlRules")}
//             </h3>

//             {fields.map((item, index) => (
//               <div
//                 key={item.id}
//                 className="border border-gray-200 rounded-lg p-1 mb-3 bg-white"
//               >
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   {/* Principal ID */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       {t("principalId")}
//                     </label>
//                     <input
//                       type="text"
//                       {...register(`aclRules.${index}.principalId`)}
//                       placeholder={t("enterPrincipalId")}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>

//                   {/* Principal Type */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       {t("principalType")}
//                     </label>
//                     <select
//                       {...register(`aclRules.${index}.principalType`)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                       <option value="1">{t("user")}</option>
//                       <option value="2">{t("group")}</option>
//                     </select>
//                   </div>

//                   {/* Permissions */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       {t("permissions")}
//                     </label>
//                     <input
//                       type="text"
//                       {...register(`aclRules.${index}.permissions.0`)}
//                       placeholder={t("permissionsPlaceholder")}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     />
//                   </div>

//                   {/* Access Type */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       {t("accessType")}
//                     </label>
//                     <select
//                       {...register(`aclRules.${index}.accessType`)}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                     >
//                       <option value="1">{t("allow")}</option>
//                       <option value="2">{t("deny")}</option>
//                     </select>
//                   </div>
//                 </div>

//                 <div className="flex justify-end mt-3">
//                   <button
//                     type="button"
//                     onClick={() => remove(index)}
//                     className="flex items-center text-red-600 hover:text-red-700 text-sm"
//                   >
//                     <Trash2 className="w-4 h-4 mr-1" /> {t("removeRule")}
//                   </button>
//                 </div>
//               </div>
//             ))}

//             <button
//               type="button"
//               onClick={() =>
//                 append({
//                   principalId: "",
//                   principalType: 1,
//                   permissions: [""],
//                   accessType: 1,
//                 })
//               }
//               className="flex items-center text-blue-600 hover:text-blue-700 text-sm mt-2"
//             >
//               <PlusCircle className="w-4 h-4 mr-1" /> {t("addNewRule")}
//             </button>
//           </div>

//           {/* Permissions Button */}
//           <div>
//             <div className="p-1 text-center">
//               <button
//                 type="button"
//                 onClick={handlePermissions}
//                 className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium"
//               >
//                 <Shield className="w-4 h-4" />
//                 {t("configurePermissions")}
//               </button>
//             </div>
//           </div>

//           {openPermissions && (
//             <Popup
//               isOpen={openPermissions}
//               setIsOpen={setOpenPermissions}
//               component={
//                 <UsersRolesPermissionsTable
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
//                   {t("creatingFolder")}
//                 </>
//               ) : (
//                 <>
//                   {/* <CheckCircle className="w-5 h-5 mr-2" /> */}
//                   {t("createFolder")}
//                 </>
//               )}
//             </button>

//             <button
//               type="button"
//               onClick={handleReset}
//               disabled={isSubmitting}
//               className="flex-none bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 flex items-center justify-center"
//             >
//               {/* <RotateCcw className="w-4 h-4 mr-2" /> */}
//               {t("reset")}
//             </button>

//             <button
//               type="button"
//               onClick={handleCancel}
//               disabled={isSubmitting}
//               className="flex-none bg-red-200 hover:bg-red-300 disabled:bg-red-100 text-red-700 font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
//             >
//               {t("cancel")}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default CreateFolder;


export default function CreateFolder() {
  return (
    <div>
      CreateFolder
    </div>
  )
}
