// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useForm } from "react-hook-form";
// import { useTranslation } from "react-i18next";
// // import AssignTabsViewer from "./../../Assign/RoleAssign/AssignTabsViewer";
// // import CustomButton from "./../../CustomButton";
// // import BasicAlerts from "../../BasicAlerts";
// // import DeleteIcon from "@mui/icons-material/Delete";

// // Fake data replacements
// const fakeIndexFieldsTypes = [
//   { id: 1, name: "STRING" },
//   { id: 2, name: "INT" },
//   { id: 3, name: "MEMO" },
//   { id: 4, name: "DROPDOWNLIST" },
//   { id: 5, name: "DATE" },
//   { id: 6, name: "BOOLEAN" },
// ];

// const fakeRoles = [
//   { id: 1, name: "Admin" },
//   { id: 2, name: "Editor" },
//   { id: 3, name: "Viewer" },
// ];

// const fakeUsers = [
//   { id: 1, name: "John Doe", email: "john@example.com" },
//   { id: 2, name: "Jane Smith", email: "jane@example.com" },
//   { id: 3, name: "Bob Johnson", email: "bob@example.com" },
// ];

// // Mock functions to replace Redux actions
// const mockCreateDocTypeWithAttribute = async ({ payload }) => {
//   console.log("Creating document type with payload:", payload);
//   // Simulate API delay
//   await new Promise(resolve => setTimeout(resolve, 1000));

//   // Simulate successful response
//   return {
//     type: "CREATE_DOC_TYPE_WITH_ATTRIBUTE/fulfilled",
//     payload: {
//       data: {
//         message: "Document type created successfully",
//         id: Math.random().toString(36).substr(2, 9)
//       }
//     }
//   };
// };

// const mockGetDocTypesFromRepo = (repoId) => {
//   console.log("Fetching document types for repo:", repoId);
//   return { type: "GET_DOC_TYPES/fulfilled" };
// };

// const DocTypeForm = () => {
//   const { t } = useTranslation();
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { errors },
//   } = useForm();

//   const { repoId } = useParams();

//   const [indexFields, setIndexFields] = useState([]);
//   const [showIndexFields, setShowIndexFields] = useState(false);
//   const [indexName, setIndexName] = useState("");
//   const [indexType, setIndexType] = useState("");
//   const [indexSize, setIndexSize] = useState("");
//   const [isRequired, setIsRequired] = useState(false);
//   const [isNamed, setIsNamed] = useState(false);
//   const [editIndex, setEditIndex] = useState(null);
//   const [indexFieldVisable, setIndexFieldVisable] = useState(true);
//   const [dropdownValues, setDropdownValues] = useState([]);
//   const [inputValue, setInputValue] = useState("");
//   const [open, setOpen] = useState(false);
//   const [message, setMessage] = useState("");
//   const [severityMessage, setSeverityMessage] = useState("");
//   const navigate = useNavigate();

//   // Replace useSelector with static data
//   const indexFieldsTypes = fakeIndexFieldsTypes;
//   const roles = fakeRoles;
//   const users = fakeUsers;

//   // Replace useDispatch with mock functions
//   const dispatch = (action) => {
//     if (typeof action === 'function') {
//       // Handle thunk actions
//       return action((actionObj) => {
//         if (actionObj.type === 'CREATE_DOC_TYPE_WITH_ATTRIBUTE/fulfilled') {
//           return Promise.resolve(actionObj);
//         }
//         return Promise.resolve({ type: 'MOCK_ACTION' });
//       });
//     }

//     // Handle object actions
//     if (action.type && action.type.includes('createDocTypeWithAttribute')) {
//       return mockCreateDocTypeWithAttribute(action);
//     }

//     return Promise.resolve({ type: 'MOCK_ACTION' });
//   };

//   // Mock dispatch functions
//   const setDocumentTypeAssignValues = (values) => {
//     console.log("Setting document type assign values:", values);
//   };

//   const clearDocumentTypeAssignValues = () => {
//     console.log("Clearing document type assign values");
//   };

//   useEffect(() => {
//     // Simulate fetching index field types
//     console.log("Fetching index field types...");
//   }, []);

//   const resetIndexFieldForm = () => {
//     setIndexName("");
//     setIndexType("");
//     setIndexSize("");
//     setDropdownValues([]);
//     setIsRequired(false);
//     setIsNamed(false);
//     setEditIndex(null);
//     setShowIndexFields(false);
//   };

//   const handleAddDropdownValue = () => {
//     if (inputValue.trim() !== "") {
//       setDropdownValues((prev) => [...prev, inputValue.trim()]);
//       setInputValue("");
//       setMessage("");
//     } else {
//       setSeverityMessage("error");
//       setMessage(t("dropdownValueRequired"));
//     }
//   };

//   const handleDeleteDropdownValue = (index) => {
//     if (window.confirm(t("confirmDeleteDropdownValue"))) {
//       setDropdownValues(dropdownValues.filter((_, i) => i !== index));
//     }
//   };

//   const handleAddIndexField = () => {
//     if (!indexName.trim() || !indexType) {
//       setSeverityMessage("error");
//       setMessage(t("fillRequiredFields"));
//       return;
//     }

//     const newField = {
//       name: indexName.trim(),
//       type: indexType,
//       size: ["STRING", "INT", "MEMO"].includes(indexType.toUpperCase())
//         ? indexSize
//         : null,
//       isRequired,
//       isNamed,
//       values: indexType === "DROPDOWNLIST" ? dropdownValues : [],
//     };

//     if (editIndex !== null) {
//       setIndexFields((prev) => {
//         const copy = [...prev];
//         copy[editIndex] = newField;
//         return copy;
//       });
//     } else {
//       setIndexFields((prev) => [...prev, newField]);
//     }

//     resetIndexFieldForm();
//     setIndexFieldVisable(true);
//   };

//   const onSubmit = async (values) => {
//     const finalIndexFields = [...indexFields];

//     if (indexName.trim() && indexType) {
//       const newField = {
//         name: indexName.trim(),
//         type: indexType,
//         size: ["STRING", "INT", "MEMO"].includes(indexType.toUpperCase())
//           ? indexSize
//           : null,
//         isRequired,
//         isNamed,
//         values: indexType === "DROPDOWNLIST" ? dropdownValues : [],
//       };

//       if (editIndex !== null) {
//         finalIndexFields[editIndex] = newField;
//       } else {
//         finalIndexFields.push(newField);
//       }
//     }

//     const payload = {
//       name: values.documentType,
//       folderId: 0,
//       repositoryId: Number(repoId),
//       documentTypeAttributeAddRequests: finalIndexFields.map((f) => ({
//         attributeName: f.name,
//         attributeType: f.type,
//         attributeSize: f.size ?? "",
//         attributeValue: "",
//         valuesOfMemoType: f.type === "DROPDOWNLIST" ? f.values : [],
//         isRequired: f.isRequired ?? true,
//         isNamed: f.isNamed ?? false,
//       })),
//       roleDocTypDto: roles || [],
//       userDocTypDto: users || [],
//     };

//     try {
//       const resultAction = await dispatch(
//         mockCreateDocTypeWithAttribute({ payload })
//       );

//       if (resultAction.type === "CREATE_DOC_TYPE_WITH_ATTRIBUTE/fulfilled") {
//         setMessage(resultAction.payload.data.message);
//         setSeverityMessage("success");
//         setMessage(t("documentTypeUpdatedSuccessfully"));
//         setTimeout(() => {
//           setMessage("");
//           setSeverityMessage("");
//         }, 1000);
//         setTimeout(() => {
//           navigate(`/AdminRepository/${repoId}`);
//         }, 1000);
//         reset();
//         resetIndexFieldForm();
//         setIndexFields([]);
//         clearDocumentTypeAssignValues();
//         mockGetDocTypesFromRepo(repoId);
//       } else {
//         console.error("Failed to create document type.");
//         setSeverityMessage("error");
//         setMessage(t("createDocumentTypeFailed"));
//       }
//     } catch (error) {
//       console.error("Error during document type creation:", error);
//       setSeverityMessage("error");
//       setMessage(error?.message || t("unexpectedError"));
//     }
//   };

//   return (
//     <div className="w-full max-w-[90%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       <div className="bg-violet-800 bg-gradient-to-r from-indigo-900 to-violet-400 rounded-xl shadow-lg overflow-hidden">
//         <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
//           <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">
//             {t("createDocumentType")}
//           </h1>
//         </div>

//         <div className="px-6 py-4">
//           <div className="flex flex-col lg:flex-row gap-6">
//             {/* Form Section */}
//             <div className="lg:w-1/2 bg-white rounded-lg shadow-md border border-gray-200 p-6">
//               <form onSubmit={handleSubmit(onSubmit)}>
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     {t("documentTypeName")}{" "}
//                     <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     {...register("documentType", {
//                       required: t("documentTypeRequired"),
//                     })}
//                     className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
//                       errors.documentType ? "border-red-500" : "border-gray-300"
//                     }`}
//                     placeholder={t("enterDocumentTypeName")}
//                   />
//                   {errors.documentType && (
//                     <p className="mt-1 text-sm text-red-600">
//                       {errors.documentType.message}
//                     </p>
//                   )}
//                 </div>

//                 <div className="mb-6 flex justify-between">
//                   <button
//                     type="button"
//                     onClick={() => {
//                       resetIndexFieldForm();
//                       setShowIndexFields(true);
//                       setIndexFieldVisable(false);
//                     }}
//                     className={`px-6 py-2 rounded-md font-medium transition-colors ${
//                       !indexFieldVisable
//                         ? "bg-gray-300 cursor-not-allowed"
//                         : "bg-teal-600 hover:bg-teal-800 text-white"
//                     }`}
//                     disabled={!indexFieldVisable}
//                   >
//                     {t("addIndexField")}
//                   </button>

//                   {/* <CustomButton
//                     text={t("addPermissions")}
//                     background={"#6172C3"}
//                     onHover={"#696eee"}
//                     component={
//                       <AssignTabsViewer
//                         assignFrom={"doctype"}
//                         assignedValues={setDocumentTypeAssignValues}
//                         clearAssignedValues={clearDocumentTypeAssignValues}
//                         roles={roles}
//                         users={users}
//                       />
//                     }
//                     method={() => setOpen(true)}
//                     modal={true}
//                   /> */}
//                 </div>

//                 {showIndexFields && (
//                   <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
//                     <h3 className="text-lg font-semibold text-gray-800 mb-4">
//                       {editIndex !== null
//                         ? t("editIndexField")
//                         : t("addNewIndexField")}
//                     </h3>

//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           {t("attributeName")}{" "}
//                           <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                           value={indexName}
//                           onChange={(e) => setIndexName(e.target.value)}
//                           required
//                           autoFocus
//                           placeholder={t("enterAttributeName")}
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           {t("attributeType")}{" "}
//                           <span className="text-red-500">*</span>
//                         </label>
//                         <select
//                           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                           value={indexType}
//                           onChange={(e) => setIndexType(e.target.value)}
//                           required
//                         >
//                           <option value="" disabled hidden>
//                             {t("selectType")}
//                           </option>
//                           {indexFieldsTypes?.map((field, i) => (
//                             <option key={i} value={field.name}>
//                               {field.name}
//                             </option>
//                           ))}
//                         </select>
//                       </div>
//                     </div>

//                     {["STRING", "INT", "MEMO"].includes(
//                       indexType.toUpperCase()
//                     ) && (
//                       <div className="mb-3">
//                         <label className="block text-sm font-medium text-gray-700 mb-1">
//                           {t("size")}
//                         </label>
//                         <input
//                           type="number"
//                           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                           value={indexSize}
//                           onChange={(e) => setIndexSize(e.target.value)}
//                           placeholder={t("enterSize")}
//                         />
//                       </div>
//                     )}

//                     {indexType === "DROPDOWNLIST" && (
//                       <div className="mb-4">
//                         <div className="flex items-end gap-2 mb-3">
//                           <div className="flex-grow">
//                             <label className="block text-sm font-medium text-gray-700 mb-1">
//                               {t("dropdownValues")}
//                             </label>
//                             <input
//                               type="text"
//                               className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                               value={inputValue}
//                               onChange={(e) => setInputValue(e.target.value)}
//                               placeholder={t("enterDropdownValue")}
//                               onKeyDown={(e) =>
//                                 e.key === "Enter" && handleAddDropdownValue()
//                               }
//                             />
//                           </div>
//                           <button
//                             type="button"
//                             className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//                             onClick={handleAddDropdownValue}
//                           >
//                             {t("addValue")}
//                           </button>
//                         </div>
//                         {dropdownValues.length > 0 && (
//                           <div className="space-y-2 mb-4">
//                             {dropdownValues.map((value, index) => (
//                               <div
//                                 key={index}
//                                 className="flex items-center gap-2"
//                               >
//                                 <input
//                                   type="text"
//                                   className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                   value={value}
//                                   onChange={(e) => {
//                                     const newValues = [...dropdownValues];
//                                     newValues[index] = e.target.value;
//                                     setDropdownValues(newValues);
//                                   }}
//                                 />
//                                 <button
//                                   type="button"
//                                   className="px-1 py-1 text-red-500 rounded-md hover:text-red-700 hover:scale-105 transition-colors"
//                                   onClick={() =>
//                                     handleDeleteDropdownValue(index)
//                                   }
//                                 >
//                                   {/* <DeleteIcon /> */}
//                                   {t("delete")}
//                                 </button>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
//                     )}

//                     <div className="flex items-center my-4">
//                       <input
//                         type="checkbox"
//                         id="isRequired"
//                         checked={isRequired}
//                         onChange={(e) => setIsRequired(e.target.checked)}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                       />
//                       <label
//                         htmlFor="isRequired"
//                         className="ml-2 block text-sm text-gray-700"
//                       >
//                         {t("requiredField")}
//                       </label>
//                     </div>

//                     <div className="flex items-center my-4">
//                       <input
//                         type="checkbox"
//                         id="isNamed"
//                         checked={isNamed}
//                         onChange={(e) => setIsNamed(e.target.checked)}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                       />
//                       <label
//                         htmlFor="isNamed"
//                         className="ml-2 block text-sm text-gray-700"
//                       >
//                         {t("namedField")}
//                       </label>
//                     </div>

//                     <div className="flex justify-end gap-3">
//                       <button
//                         type="button"
//                         onClick={() => {
//                           resetIndexFieldForm();
//                           setIndexFieldVisable(true);
//                         }}
//                         className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
//                       >
//                         {t("cancel")}
//                       </button>
//                       <button
//                         type="button"
//                         onClick={handleAddIndexField}
//                         className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
//                       >
//                         {editIndex !== null ? t("updateField") : t("addField")}
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 <div>
//                   <button
//                     type="submit"
//                     className="w-full px-6 py-2 bg-[#6172C3] hover:bg-[#696eee] text-white font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
//                   >
//                     {t("save")}
//                   </button>
//                 </div>

//                 <div className="w-full my-3">
//                   {/* {message && (
//                     <BasicAlerts
//                       severityMessage={severityMessage}
//                       Message={message}
//                     />
//                   )} */}
//                 </div>
//               </form>
//             </div>

//             {/* Table Section */}
//             <div className="lg:w-1/2 bg-white rounded-lg shadow-md border border-gray-200 p-6">
//               <h3 className="text-lg font-semibold text-gray-800 mb-3">
//                 {t("indexFields")}
//               </h3>
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         {t("name")}
//                       </th>
//                       <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         {t("type")}
//                       </th>
//                       <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         {t("size")}
//                       </th>
//                       <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         {t("required")}
//                       </th>
//                       <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         {t("named")}
//                       </th>
//                       <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         {t("actions")}
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {indexFields.length > 0 ? (
//                       indexFields.map((field, i) => (
//                         <tr key={i} className="hover:bg-gray-50">
//                           <td className="px-4 py-3 text-sm text-gray-700 text-center">
//                             {field.name}
//                           </td>
//                           <td className="px-4 py-3 text-sm text-gray-700 text-center">
//                             {field.type}
//                           </td>
//                           <td className="px-4 py-3 text-sm text-gray-700 text-center">
//                             {field.size || "—"}
//                           </td>
//                           <td className="px-4 py-3 text-sm text-gray-700 text-center">
//                             {field.isRequired ? (
//                               <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
//                                 {t("yes")}
//                               </span>
//                             ) : (
//                               <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
//                                 {t("no")}
//                               </span>
//                             )}
//                           </td>
//                           <td className="px-4 py-3 text-sm text-gray-700 text-center">
//                             {field.isNamed ? (
//                               <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
//                                 {t("yes")}
//                               </span>
//                             ) : (
//                               <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
//                                 {t("no")}
//                               </span>
//                             )}
//                           </td>
//                           <td className="px-4 py-3 text-sm text-gray-700 text-center">
//                             <div className="flex justify-center gap-3">
//                               <button
//                                 type="button"
//                                 onClick={() => {
//                                   setIndexName(field.name);
//                                   setIndexType(field.type);
//                                   setIndexSize(field.size || "");
//                                   setIsRequired(field.isRequired);
//                                   setIsNamed(field.isNamed);
//                                   setDropdownValues(field.values || []);
//                                   setEditIndex(i);
//                                   setShowIndexFields(true);
//                                   setIndexFieldVisable(false);
//                                 }}
//                                 className="text-blue-600 hover:text-blue-900"
//                               >
//                                 {t("edit")}
//                               </button>
//                               <button
//                                 type="button"
//                                 onClick={() => {
//                                   if (window.confirm(t("confirmDeleteField"))) {
//                                     setIndexFields((prev) =>
//                                       prev.filter((_, idx) => idx !== i)
//                                     );
//                                   }
//                                 }}
//                                 className="text-red-600 hover:text-red-900"
//                               >
//                                 {t("delete")}
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))
//                     ) : (
//                       <tr>
//                         <td
//                           colSpan="6"
//                           className="px-4 py-3 text-sm text-gray-500 text-center"
//                         >
//                           {t("noIndexFieldsAdded")}
//                         </td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DocTypeForm;

import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import {
  Plus,
  X,
  Edit2,
  Trash2,
  Database,
  FileText,
  Settings,
  Save,
  ChevronLeft,
  ChevronRight,
  Shield,
  Users,
} from "lucide-react";
import Popup from "../../globalComponents/Popup";
import UsersRolesPermissionsTable from "../Permissions/UsersRolesPermissionsTable";

// Fake data replacements
const fakeIndexFieldsTypes = [
  { id: 1, name: "STRING", value: "string", label: "String", hasSize: true },
  { id: 2, name: "INT", value: "int", label: "Integer", hasSize: true },
  { id: 3, name: "MEMO", value: "memo", label: "Memo", hasSize: true },
  {
    id: 4,
    name: "DROPDOWNLIST",
    value: "dropdown",
    label: "Dropdown",
    hasSize: false,
  },
  { id: 5, name: "DATE", value: "date", label: "Date", hasSize: false },
  {
    id: 6,
    name: "BOOLEAN",
    value: "boolean",
    label: "Boolean",
    hasSize: false,
  },
];

const fakeRoles = [
  { id: 1, name: "Admin" },
  { id: 2, name: "Editor" },
  { id: 3, name: "Viewer" },
];

const fakeUsers = [
  { id: 1, name: "John Doe", email: "john@example.com" },
  { id: 2, name: "Jane Smith", email: "jane@example.com" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com" },
];

// Mock functions to replace Redux actions
const mockCreateDocTypeWithAttribute = async ({ payload }) => {
  console.log("Creating document type with payload:", payload);
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Simulate successful response
  return {
    type: "CREATE_DOC_TYPE_WITH_ATTRIBUTE/fulfilled",
    payload: {
      data: {
        message: "Document type created successfully",
        id: Math.random().toString(36).substr(2, 9),
      },
    },
  };
};

const mockGetDocTypesFromRepo = (repoId) => {
  console.log("Fetching document types for repo:", repoId);
  return { type: "GET_DOC_TYPES/fulfilled" };
};

// Simple Alert Component for showing errors
const Alert = ({ message, type = "error" }) => {
  if (!message) return null;

  const styles = {
    error: "bg-red-50 border-red-200 text-red-700",
    success: "bg-green-50 border-green-200 text-green-700",
  };

  return (
    <div className={`p-3 rounded-lg border ${styles[type]} mb-4`}>
      {message}
    </div>
  );
};

// PropTypes for Alert component
Alert.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf(["error", "success"]),
};

// PropTypes for IndexFieldsTable component
const IndexFieldsTable = ({
  indexFields = [],
  onEdit = () => {},
  onDelete = () => {},
  isAddingField = false,
  itemsPerPage = 3,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation();

  // Calculate pagination values
  const totalPages = Math.ceil(indexFields.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFields = indexFields.slice(startIndex, endIndex);

  // Reset to first page if current page becomes invalid
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages, indexFields.length]);

  // Navigate to specific page
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Get display label for attribute type
  const getTypeLabel = (type) => {
    const typeConfig = fakeIndexFieldsTypes.find(
      (attrType) => attrType.name === type
    );
    return typeConfig?.label || type;
  };

  // Render pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 3;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          {t("showing")} {startIndex + 1} {t("to")}{" "}
          {Math.min(endIndex, indexFields.length)} {t("of")}{" "}
          {indexFields.length} {t("fields")}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => goToPage(number)}
              className={`px-3 py-1 rounded-lg border text-sm font-medium transition-colors ${
                currentPage === number
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-2 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {t("indexFields")}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {indexFields.length === 1
            ? t("fieldConfigured")
            : t("fieldsConfigured", { count: indexFields.length })}
        </p>
      </div>
      <div className="flex-1 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-12">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {t("name")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {t("type")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {t("size")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {t("required")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {t("named")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentFields.length > 0 ? (
              currentFields.map((field, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    {field.name}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getTypeLabel(field.type)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {field.size || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {field.isRequired ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {t("yes")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {t("no")}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {field.isNamed ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {t("yes")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {t("no")}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(startIndex + index)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        disabled={isAddingField}
                        title={t("edit")}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(startIndex + index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        disabled={isAddingField}
                        title={t("delete")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-11 text-center">
                  <div className="text-gray-400">
                    <Database className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-base font-medium mb-1">
                      {t("noIndexFields")}
                    </p>
                    <p className="text-sm">{t("addIndexFieldHint")}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {renderPagination()}
    </div>
  );
};

// PropTypes for IndexFieldsTable
IndexFieldsTable.propTypes = {
  indexFields: PropTypes.array,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  isAddingField: PropTypes.bool,
  itemsPerPage: PropTypes.number,
};

const DocTypeForm = () => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  const { repoId } = useParams();

  const [indexFields, setIndexFields] = useState([]);
  const [showAddField, setShowAddField] = useState(false);
  const [currentField, setCurrentField] = useState({
    name: "",
    type: "",
    size: "",
    isRequired: false,
    isNamed: false,
    values: [],
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [openPermissions, setOpenPermissions] = useState(false);
  const [permissionsData, setPermissionsData] = useState({
    // clearanceRules: [],
    // aclRules: [],
  });
  const navigate = useNavigate();

  // Replace useSelector with static data
  const indexFieldsTypes = fakeIndexFieldsTypes;
  const roles = fakeRoles;
  const users = fakeUsers;

  // Replace useDispatch with mock functions
  const dispatch = (action) => {
    if (typeof action === "function") {
      // Handle thunk actions
      return action((actionObj) => {
        if (actionObj.type === "CREATE_DOC_TYPE_WITH_ATTRIBUTE/fulfilled") {
          return Promise.resolve(actionObj);
        }
        return Promise.resolve({ type: "MOCK_ACTION" });
      });
    }

    // Handle object actions
    if (action.type && action.type.includes("createDocTypeWithAttribute")) {
      return mockCreateDocTypeWithAttribute(action);
    }

    return Promise.resolve({ type: "MOCK_ACTION" });
  };

  useEffect(() => {
    // Simulate fetching index field types
    console.log("Fetching index field types...");
  }, []);

  const resetFieldForm = () => {
    setCurrentField({
      name: "",
      type: "",
      size: "",
      isRequired: false,
      isNamed: false,
      values: [],
    });
    setEditingIndex(null);
    setShowAddField(false);
    setInputValue("");
    setErrorMessage("");
  };

  const handleAddDropdownValue = () => {
    if (inputValue.trim() !== "") {
      setCurrentField((prev) => ({
        ...prev,
        values: [...prev.values, inputValue.trim()],
      }));
      setInputValue("");
      setErrorMessage("");
    } else {
      setErrorMessage(t("dropdownValueRequired"));
    }
  };

  const handleDeleteDropdownValue = (index) => {
    if (window.confirm(t("confirmDeleteDropdownValue"))) {
      setCurrentField((prev) => ({
        ...prev,
        values: prev.values.filter((_, i) => i !== index),
      }));
    }
  };

  const startAddingField = () => {
    setShowAddField(true);
    setCurrentField({
      name: "",
      type: "",
      size: "",
      isRequired: false,
      isNamed: false,
      values: [],
    });
    setEditingIndex(null);
    setErrorMessage("");
  };

  const cancelAddField = () => {
    resetFieldForm();
  };

  const saveIndexField = () => {
    console.log("Saving index field:", currentField);

    // Reset error message
    setErrorMessage("");

    // Validate required fields
    if (!currentField.name.trim()) {
      setErrorMessage(
        t("attributeNameRequired") || "Attribute name is required"
      );
      return;
    }

    if (!currentField.type) {
      setErrorMessage(
        t("attributeTypeRequired") || "Attribute type is required"
      );
      return;
    }

    const selectedType = indexFieldsTypes.find(
      (field) => field.name === currentField.type
    );

    // Validate size for types that require it
    if (selectedType?.hasSize && !currentField.size) {
      setErrorMessage(
        t("specifySize") || "Please specify size for this field type"
      );
      return;
    }

    // Validate dropdown values
    if (
      currentField.type === "DROPDOWNLIST" &&
      currentField.values.length === 0
    ) {
      setErrorMessage(
        t("addDropdownValue") || "Please add at least one dropdown value"
      );
      return;
    }

    // Create the new field object
    const newField = {
      name: currentField.name.trim(),
      type: currentField.type,
      size: selectedType?.hasSize ? currentField.size : null,
      isRequired: currentField.isRequired,
      isNamed: currentField.isNamed,
      values: currentField.type === "DROPDOWNLIST" ? currentField.values : [],
    };

    console.log("New field to add:", newField);

    // Update the indexFields array
    if (editingIndex !== null) {
      // Editing existing field
      setIndexFields((prev) =>
        prev.map((field, index) => (index === editingIndex ? newField : field))
      );
      console.log("Updated field at index:", editingIndex);
    } else {
      // Adding new field
      setIndexFields((prev) => [...prev, newField]);
      console.log("Added new field, total fields:", indexFields.length + 1);
    }

    // Reset the form
    resetFieldForm();
  };

  const editIndexField = (index) => {
    const field = indexFields[index];
    console.log("Editing field:", field);
    setCurrentField({
      name: field.name,
      type: field.type,
      size: field.size || "",
      isRequired: field.isRequired,
      isNamed: field.isNamed,
      values: field.values || [],
    });
    setEditingIndex(index);
    setShowAddField(true);
    setErrorMessage("");
  };

  const deleteIndexField = (index) => {
    if (
      window.confirm(
        t("confirmDeleteField") || "Are you sure you want to delete this field?"
      )
    ) {
      setIndexFields((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Handle permissions button click
  const handlePermissions = () => {
    setOpenPermissions(true);
    console.log("Opening permissions modal/page");
  };

  // Handle permissions data from UsersRolesPermissionsTable
  const handlePermissionsDataChange = (data) => {
    console.log("Received permissions data:", data);
    setPermissionsData(data);
    // Close the popup
    setOpenPermissions(false);
  };

  const onSubmit = async (values) => {
    const finalIndexFields = [...indexFields];
    // Add current field if being edited (in case user forgot to click save)
    if (showAddField && currentField.name.trim() && currentField.type) {
      const selectedType = indexFieldsTypes.find(
        (field) => field.name === currentField.type
      );

      const newField = {
        name: currentField.name.trim(),
        type: currentField.type,
        size: selectedType?.hasSize ? currentField.size : null,
        isRequired: currentField.isRequired,
        isNamed: currentField.isNamed,
        values: currentField.type === "DROPDOWNLIST" ? currentField.values : [],
      };

      if (editingIndex !== null) {
        finalIndexFields[editingIndex] = newField;
      } else {
        finalIndexFields.push(newField);
      }
    }

    // const aclRules = permissionsData.aclRules.map((rule) => ({
    //   principalId: rule.principalId,
    //   principalType: rule.principalType,
    //   permissions: rule.permissions?.map((perm) => perm.code) || [],
    //   accessType: rule.accessType,
    // }));

    const payload = {
      name: values.documentType,
      repositoryId: Number(repoId),
      // Only include securityLevel if it has a value, otherwise exclude it completely
      ...(values.securityLevel && {
        securityLevel: Number(values.securityLevel),
      }),
      documentTypeAttributeAddRequests: finalIndexFields.map((f) => ({
        attributeName: f.name,
        attributeType: f.type,
        attributeSize: f.size ?? "",
        attributeValue: "",
        valuesOfMemoType: f.type === "DROPDOWNLIST" ? f.values : [],
        isRequired: f.isRequired ?? true,
        isNamed: f.isNamed ?? false,
      })),
      // roleDocTypDto: roles || [],
      // userDocTypDto: users || [],
      // clearanceRules: permissionsData.clearanceRules || [],
      // aclRules: aclRules
    };

    try {
      const resultAction = await dispatch(
        mockCreateDocTypeWithAttribute({ payload })
      );

      if (resultAction.type === "CREATE_DOC_TYPE_WITH_ATTRIBUTE/fulfilled") {
        console.log("Document type created successfully");
        setTimeout(() => {
          navigate(`/AdminRepository/${repoId}`);
        }, 1000);
        reset();
        resetFieldForm();
        setIndexFields([]);
        mockGetDocTypesFromRepo(repoId);
      } else {
        console.error("Failed to create document type.");
      }
    } catch (error) {
      console.error("Error during document type creation:", error);
    }
  };

  const selectedType = indexFieldsTypes.find(
    (field) => field.name === currentField.type
  );

  return (
    <div className="py-1 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center gap-4 bg-white rounded-xl px-8 py-4 shadow-sm border border-gray-200">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-gray-900">
                {t("createDocumentType")}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {t("docTypeSetupDescription")}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Document Type Information */}
            <div className="space-y-6">
              {/* Document Type Information Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {t("information")}
                    </h2>
                  </div>
                </div>

                <div className="p-3 space-y-4">
                  {/* Document Type Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t("documentTypeName")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("documentType", {
                        required: t("documentTypeRequired"),
                      })}
                      type="text"
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.documentType
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder={t("enterDocumentTypeName")}
                    />
                    {errors.documentType && (
                      <p className="text-red-600 text-sm mt-2">
                        {errors.documentType.message}
                      </p>
                    )}
                  </div>

                  {/* Security Level - OPTIONAL */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t("securityLevel")}
                    </label>
                    <input
                      {...register("securityLevel", {
                        min: {
                          value: 1,
                          message: t("Min security level is 1"),
                        },
                        max: {
                          value: 99,
                          message: t("Max security level is 99"),
                        },
                      })}
                      type="number"
                      min="1"
                      max="99"
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.securityLevel
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder={t("enterSecurityLevel")}
                    />
                    {errors.securityLevel && (
                      <p className="text-red-600 text-sm mt-2">
                        {errors.securityLevel.message}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      {t("securityLevelHint")}
                    </p>
                  </div>
                </div>
              </div>

              {/* Permissions Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-2 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Users className="w-5 h-5 text-orange-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {t("accessPermissions")}
                    </h2>
                  </div>
                </div>

                <div className="p-3 text-center">
                  <button
                    type="button"
                    onClick={handlePermissions}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium"
                  >
                    <Shield className="w-4 h-4" />
                    {t("configurePermissions")}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column - Index Fields Management */}
            <div className="space-y-6">
              {/* Index Fields Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-2 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Settings className="w-5 h-5 text-green-600" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {t("indexFieldsManagement")}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={startAddingField}
                      disabled={showAddField}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      {t("addIndexField")}
                    </button>
                  </div>
                </div>

                <div className="p-2 space-y-6">
                  {/* Add/Edit Field Form */}
                  {showAddField && (
                    <div className="bg-blue-50 rounded-lg p-3 border-2 border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {editingIndex !== null
                            ? t("editIndexField")
                            : t("addNewIndexField")}
                        </h3>
                        <button
                          onClick={cancelAddField}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Error Message */}
                      {errorMessage && (
                        <Alert message={errorMessage} type="error" />
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Attribute Name */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {t("attributeName")}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={currentField.name}
                            onChange={(e) =>
                              setCurrentField((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            placeholder={t("enterAttributeName")}
                            autoFocus
                          />
                        </div>

                        {/* Attribute Type */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {t("attributeType")}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={currentField.type}
                            onChange={(e) =>
                              setCurrentField((prev) => ({
                                ...prev,
                                type: e.target.value,
                                size: "",
                                values:
                                  e.target.value === "DROPDOWNLIST" ? [] : [],
                              }))
                            }
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                          >
                            <option value="">{t("selectAttributeType")}</option>
                            {indexFieldsTypes?.map((field, i) => (
                              <option key={i} value={field.name}>
                                {field.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Size Field */}
                      {selectedType?.hasSize && (
                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {t("attributeSize")}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={currentField.size}
                            onChange={(e) =>
                              setCurrentField((prev) => ({
                                ...prev,
                                size: e.target.value,
                              }))
                            }
                            className="w-full md:w-48 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            placeholder={t("enterSize")}
                            min="1"
                          />
                        </div>
                      )}

                      {/* Dropdown Values */}
                      {currentField.type === "DROPDOWNLIST" && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-semibold text-gray-700">
                              {t("dropdownValues")}
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={t("enterDropdownValue")}
                                onKeyDown={(e) =>
                                  e.key === "Enter" && handleAddDropdownValue()
                                }
                              />
                              <button
                                type="button"
                                onClick={handleAddDropdownValue}
                                className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                                {t("addValue")}
                              </button>
                            </div>
                          </div>
                          {currentField.values.length > 0 && (
                            <div className="space-y-2 mb-4">
                              {currentField.values.map((value, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <input
                                    type="text"
                                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    value={value}
                                    onChange={(e) => {
                                      const newValues = [
                                        ...currentField.values,
                                      ];
                                      newValues[index] = e.target.value;
                                      setCurrentField((prev) => ({
                                        ...prev,
                                        values: newValues,
                                      }));
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteDropdownValue(index)
                                    }
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Checkboxes */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isRequired"
                            checked={currentField.isRequired}
                            onChange={(e) =>
                              setCurrentField((prev) => ({
                                ...prev,
                                isRequired: e.target.checked,
                              }))
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="isRequired"
                            className="ml-2 block text-sm text-gray-700 font-medium"
                          >
                            {t("requiredField")}
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isNamed"
                            checked={currentField.isNamed}
                            onChange={(e) =>
                              setCurrentField((prev) => ({
                                ...prev,
                                isNamed: e.target.checked,
                              }))
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label
                            htmlFor="isNamed"
                            className="ml-2 block text-sm text-gray-700 font-medium"
                          >
                            {t("namedField")}
                          </label>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={saveIndexField}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                        >
                          {editingIndex !== null
                            ? t("updateField")
                            : t("saveField")}
                        </button>
                        <button
                          type="button"
                          onClick={cancelAddField}
                          className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                        >
                          {t("cancel")}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Index Fields Table */}
                  <IndexFieldsTable
                    indexFields={indexFields}
                    onEdit={editIndexField}
                    onDelete={deleteIndexField}
                    isAddingField={showAddField}
                    itemsPerPage={3}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Permissions Popup */}
          {openPermissions && (
            <Popup
              isOpen={openPermissions}
              setIsOpen={setOpenPermissions}
              component={
                <UsersRolesPermissionsTable
                  onDone={handlePermissionsDataChange}
                  savedData={permissionsData}
                />
              }
            />
          )}
          {/* Sticky Action Bar */}
          <div className="bg-white border-t border-gray-200 py-3 mx-4 sm:-mx-6 lg:-mx-8">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-end gap-4">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={!isValid || showAddField}
                  className="inline-flex items-center justify-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none"
                >
                  <Save className="w-5 h-5" />
                  {t("createDocumentType")}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocTypeForm;
