// /* eslint-disable react/prop-types */
// import React, { useState, useEffect, useCallback } from "react";
// import { FileText, Database, ChevronDown, Shield } from "lucide-react";
// import { useTranslation } from "react-i18next";
// import { useParams } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import Popup from "../../../globalComponents/Popup";
// import UsersRolesPermissionsTable from "../../Permissions/UsersRolesPermissionsTable";
// import { fetchPrinciples } from "../../Permissions/permissionsThunks";
// import { fetchtDocTypeByAttributes } from "../../DocumentType/docTypeThunks";

// // Mock data for document types with their metadata
// const DOCUMENT_TYPES = [
//   {
//     id: 1,
//     name: "Employee",
//     metadata: [
//       {
//         key: "name",
//         label: "Name",
//         type: "text",
//         required: true,
//         defaultValue: "John Doe",
//       },
//       {
//         key: "age",
//         label: "Age",
//         type: "number",
//         required: true,
//         defaultValue: "30",
//       },
//       {
//         key: "isMarried",
//         label: "Is Married",
//         type: "dropdown",
//         options: ["Yes", "No"],
//         required: false,
//         defaultValue: "Yes",
//       },
//       {
//         key: "salary",
//         label: "Salary",
//         type: "number",
//         required: true,
//         defaultValue: "75000",
//       },
//       {
//         key: "company",
//         label: "Company",
//         type: "dropdown",
//         options: ["Company A", "Company B", "Company C"],
//         required: true,
//         defaultValue: "Company A",
//       },
//     ],
//   },
//   {
//     id: 2,
//     name: "Invoice",
//     metadata: [
//       {
//         key: "invoiceNumber",
//         label: "Invoice Number",
//         type: "text",
//         required: true,
//         defaultValue: "INV-2024-001",
//       },
//       {
//         key: "clientName",
//         label: "Client Name",
//         type: "text",
//         required: true,
//         defaultValue: "Acme Corporation",
//       },
//       {
//         key: "amount",
//         label: "Amount",
//         type: "number",
//         required: true,
//         defaultValue: "5000",
//       },
//       {
//         key: "date",
//         label: "Date",
//         type: "date",
//         required: true,
//         defaultValue: "2024-01-15",
//       },
//       {
//         key: "status",
//         label: "Status",
//         type: "dropdown",
//         options: ["Paid", "Pending", "Overdue"],
//         required: true,
//         defaultValue: "Paid",
//       },
//     ],
//   },
//   {
//     id: 3,
//     name: "Contract",
//     metadata: [
//       {
//         key: "contractTitle",
//         label: "Contract Title",
//         type: "text",
//         required: true,
//         defaultValue: "Software Development Agreement",
//       },
//       {
//         key: "partyA",
//         label: "Party A",
//         type: "text",
//         required: true,
//         defaultValue: "Tech Solutions Inc.",
//       },
//       {
//         key: "partyB",
//         label: "Party B",
//         type: "text",
//         required: true,
//         defaultValue: "Global Enterprises LLC",
//       },
//       {
//         key: "startDate",
//         label: "Start Date",
//         type: "date",
//         required: true,
//         defaultValue: "2024-01-01",
//       },
//       {
//         key: "endDate",
//         label: "End Date",
//         type: "date",
//         required: true,
//         defaultValue: "2024-12-31",
//       },
//       {
//         key: "value",
//         label: "Contract Value",
//         type: "number",
//         required: true,
//         defaultValue: "250000",
//       },
//       {
//         key: "contractType",
//         label: "Contract Type",
//         type: "dropdown",
//         options: ["Service", "Product", "Partnership", "Employment"],
//         required: true,
//         defaultValue: "Service",
//       },
//     ],
//   },
// ];

// function DocumentForm() {
//   const { t } = useTranslation();
//   const { repoId } = useParams();
//   const dispatch = useDispatch();
//   const currentRepoId = 1;

//   // State management
//   const [selectedDocumentType, setSelectedDocumentType] = useState("");
//   const [currentMetadata, setCurrentMetadata] = useState([]);
//   const [jsonData, setJsonData] = useState({});

//   // Permissions state
//   const [openPermissions, setOpenPermissions] = useState(false);
//   const [permissionsData, setPermissionsData] = useState({
//     clearanceRules: [],
//     aclRules: [],
//   });
// useEffect(() => {
//   dispatch(fetchtDocTypeByAttributes(1));
// }, [])

//   // Handle document type selection
//   const handleDocumentTypeChange = (e) => {
//     const documentTypeName = e.target.value;
//     setSelectedDocumentType(documentTypeName);

//     // Find the selected document type and its metadata
//     const selectedType = DOCUMENT_TYPES.find(
//       (type) => type.name === documentTypeName
//     );

//     if (selectedType) {
//       setCurrentMetadata(selectedType.metadata);

//       // Initialize JSON data with default values from metadata
//       const initialData = {};
//       selectedType.metadata.forEach((field) => {
//         // Use defaultValue if provided, otherwise use empty string or first option for dropdowns
//         if (field.defaultValue) {
//           initialData[field.key] = field.defaultValue;
//         } else if (field.type === "dropdown" && field.options.length > 0) {
//           initialData[field.key] = field.options[0];
//         } else {
//           initialData[field.key] = "";
//         }
//       });
//       setJsonData(initialData);
//     } else {
//       setCurrentMetadata([]);
//       setJsonData({});
//     }
//   };

//   // Handle JSON field changes
//   const handleFieldChange = (key, value) => {
//     setJsonData((prev) => ({
//       ...prev,
//       [key]: value,
//     }));
//   };

//   //   // Refresh principles data
//   //   const refreshPrinciplesData = useCallback(() => {
//   //     if (currentRepoId) {
//   //       dispatch(fetchPrinciples(currentRepoId));
//   //     }
//   //   }, [dispatch, currentRepoId]);

//   useEffect(() => {
//     if (currentRepoId) {
//       dispatch(fetchPrinciples(currentRepoId));
//     }
//   }, [dispatch, currentRepoId]);

//   // Handle permissions button click
//   const handlePermissions = () => {
//     setOpenPermissions(true);
//   };

//   // Handle permissions data from UsersRolesPermissionsTable
//   const handlePermissionsDataChange = (data) => {
//     setPermissionsData(data);
//     setOpenPermissions(false);
//   };

//   // Log JSON data whenever it changes (ready for backend)
//   useEffect(() => {
//     if (selectedDocumentType && Object.keys(jsonData).length > 0) {
//       // Transform ACL Rules to match backend format (similar to CreateFolder)
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

//       const completeJsonData = {
//         documentType: selectedDocumentType,
//         metadata: jsonData,
//         aclRules: transformedAclRules,
//       };

//       console.log("=== JSON Data (Ready for Backend) ===");
//       console.log(JSON.stringify(completeJsonData, null, 2));
//       console.log("=====================================");

//       // This is what you would send to the backend:
//       // fetch('/api/documents', {
//       //   method: 'POST',
//       //   headers: { 'Content-Type': 'application/json' },
//       //   body: JSON.stringify(completeJsonData)
//       // });
//     }
//   }, [jsonData, selectedDocumentType, permissionsData]);

//   // Render input field based on metadata type
//   const renderField = (field) => {
//     switch (field.type) {
//       case "text":
//         return (
//           <input
//             type="text"
//             value={jsonData[field.key] || ""}
//             onChange={(e) => handleFieldChange(field.key, e.target.value)}
//             className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
//             placeholder={`Enter ${field.label}`}
//             required={field.required}
//           />
//         );

//       case "number":
//         return (
//           <input
//             type="number"
//             value={jsonData[field.key] || ""}
//             onChange={(e) => handleFieldChange(field.key, e.target.value)}
//             className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
//             placeholder={`Enter ${field.label}`}
//             required={field.required}
//           />
//         );

//       case "date":
//         return (
//           <input
//             type="date"
//             value={jsonData[field.key] || ""}
//             onChange={(e) => handleFieldChange(field.key, e.target.value)}
//             className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
//             required={field.required}
//           />
//         );

//       case "dropdown":
//         return (
//           <select
//             value={jsonData[field.key] || ""}
//             onChange={(e) => handleFieldChange(field.key, e.target.value)}
//             className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
//             required={field.required}
//           >
//             {field.options.map((option, index) => (
//               <option key={index} value={option}>
//                 {option}
//               </option>
//             ))}
//           </select>
//         );

//       case "checkbox":
//         return (
//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               checked={jsonData[field.key] || false}
//               onChange={(e) => handleFieldChange(field.key, e.target.checked)}
//               className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
//             />
//             <span className="ml-2 text-sm text-gray-700">{field.label}</span>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="py-1 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="text-center mb-3">
//           <div className="inline-flex items-center gap-4 bg-white rounded-xl px-8 py-4 shadow-sm border border-gray-200">
//             <div className="p-3 bg-blue-100 rounded-lg">
//               <FileText className="w-6 h-6 text-blue-600" />
//             </div>
//             <div className="text-left">
//               <h1 className="text-xl font-bold text-gray-900">
//                 Create New Document
//               </h1>
//               <p className="text-gray-600 text-sm mt-1">
//                 Select document type and fill metadata - Data saved as JSON
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Main Form Area */}
//         <div className="space-y-8">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//             {/* Left Column - Document Type Selection */}
//             <div className="space-y-6">
//               {/* Document Type Selection Card */}
//               <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//                 <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
//                   <div className="flex items-center gap-3">
//                     <div className="p-2 bg-blue-100 rounded-lg">
//                       <Database className="w-5 h-5 text-blue-600" />
//                     </div>
//                     <h2 className="text-xl font-semibold text-gray-900">
//                       Document Type
//                     </h2>
//                   </div>
//                 </div>

//                 <div className="p-6 space-y-4">
//                   {/* Document Type Dropdown */}
//                   <div>
//                     <label className="block text-sm font-semibold text-gray-700 mb-2">
//                       Select Document Type
//                       <span className="text-red-500">*</span>
//                     </label>
//                     <div className="relative">
//                       <select
//                         value={selectedDocumentType}
//                         onChange={handleDocumentTypeChange}
//                         className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white appearance-none"
//                       >
//                         <option value="">Select a document type...</option>
//                         {DOCUMENT_TYPES.map((type) => (
//                           <option key={type.id} value={type.name}>
//                             {type.name}
//                           </option>
//                         ))}
//                       </select>
//                       <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
//                     </div>
//                   </div>

//                   {/* Info box when no document type selected */}
//                   {!selectedDocumentType && (
//                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
//                       <p className="text-sm text-blue-800">
//                         Please select a document type to view and fill the
//                         metadata fields.
//                       </p>
//                     </div>
//                   )}

//                   {/* Display selected document type info */}
//                   {selectedDocumentType && (
//                     <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
//                       <p className="text-sm font-semibold text-green-900 mb-1">
//                         Selected: {selectedDocumentType}
//                       </p>
//                       <p className="text-xs text-green-700">
//                         {currentMetadata.length} metadata fields available
//                       </p>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Permissions Card */}
//               {selectedDocumentType && (
//                 <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//                   <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-orange-100 rounded-lg">
//                         <Shield className="w-5 h-5 text-orange-600" />
//                       </div>
//                       <h2 className="text-xl font-semibold text-gray-900">
//                         Permissions
//                       </h2>
//                     </div>
//                   </div>

//                   <div className="p-6">
//                     <p className="text-sm text-gray-600 mb-4">
//                       Configure access control rules for this document
//                     </p>
//                     <button
//                       type="button"
//                       onClick={handlePermissions}
//                       className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium"
//                     >
//                       <Shield className="w-4 h-4" />
//                       Configure Permissions
//                       {permissionsData.aclRules.length > 0 && (
//                         <span className="bg-orange-800 text-white px-2 py-1 rounded-full text-xs">
//                           {permissionsData.aclRules.length}
//                         </span>
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Right Column - Dynamic Metadata Fields */}
//             <div className="space-y-6">
//               {selectedDocumentType && currentMetadata.length > 0 && (
//                 <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//                   <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
//                     <div className="flex items-center gap-3">
//                       <div className="p-2 bg-green-100 rounded-lg">
//                         <FileText className="w-5 h-5 text-green-600" />
//                       </div>
//                       <h2 className="text-xl font-semibold text-gray-900">
//                         Document Metadata
//                       </h2>
//                     </div>
//                   </div>

//                   <div className="p-6 space-y-4">
//                     {currentMetadata.map((field, index) => (
//                       <div key={index}>
//                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                           {field.label}
//                           {field.required && (
//                             <span className="text-red-500 ml-1">*</span>
//                           )}
//                         </label>
//                         {renderField(field)}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Empty state when no document type selected */}
//               {!selectedDocumentType && (
//                 <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//                   <div className="p-12 text-center">
//                     <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
//                       <FileText className="w-8 h-8 text-gray-400" />
//                     </div>
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">
//                       No Document Type Selected
//                     </h3>
//                     <p className="text-sm text-gray-600">
//                       Select a document type from the left panel to view and
//                       fill the metadata fields.
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Permissions Popup */}
//           {openPermissions && (
//             <Popup
//               isOpen={openPermissions}
//               setIsOpen={setOpenPermissions}
//               component={
//                 <UsersRolesPermissionsTable
//                   entityType="document"
//                   onDone={handlePermissionsDataChange}
//                   savedData={permissionsData}
//                 />
//               }
//             />
//           )}

//           {/* JSON Preview Card (shows current JSON data) */}
//           {selectedDocumentType && Object.keys(jsonData).length > 0 && (
//             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//               <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   JSON Data Preview (Ready for Backend)
//                 </h3>
//               </div>
//               <div className="p-6">
//                 <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
//                   <pre className="text-green-400 overflow-x-auto">
//                     {JSON.stringify(
//                       {
//                         documentType: selectedDocumentType,
//                         metadata: jsonData,
//                         aclRules: permissionsData.aclRules.map((rule) => {
//                           let permissionsArray = [];
//                           if (Array.isArray(rule.permissions)) {
//                             permissionsArray = rule.permissions
//                               .filter((p) => p != null)
//                               .map((p) => {
//                                 if (typeof p === "object" && p.code) {
//                                   return p.code;
//                                 } else if (
//                                   typeof p === "string" &&
//                                   p.trim() !== ""
//                                 ) {
//                                   return p.trim();
//                                 }
//                                 return null;
//                               })
//                               .filter((p) => p != null);
//                           } else if (
//                             typeof rule.permissions === "string" &&
//                             rule.permissions.trim() !== ""
//                           ) {
//                             permissionsArray = [rule.permissions.trim()];
//                           }

//                           return {
//                             principalId: String(rule.principalId || ""),
//                             principalType: rule.principalType || "user",
//                             permissions: permissionsArray,
//                             accessType:
//                               rule.accessType === 0 ? "deny" : "allow",
//                           };
//                         }),
//                       },
//                       null,
//                       2
//                     )}
//                   </pre>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-3">
//                   * JSON data is automatically logged to console on every change
//                 </p>
//                 <p className="text-xs text-gray-500 mt-1">
//                   * This JSON format is ready to be sent to your backend API
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default DocumentForm;

// // * THIS VERSION IS FETCHING THE DOCUMENT TYPES AND JUST NEED TO FETCH THE INDEX FIELDS ACCORDING TO THE DOCUMENT TYPE

// // /* eslint-disable react/prop-types */
// // import React, { useState, useEffect } from "react";
// // import { FileText, Database, ChevronDown } from "lucide-react";
// // import { useTranslation } from "react-i18next";
// // import { useDispatch, useSelector } from "react-redux";
// // import { useParams } from "react-router-dom";
// // import { fetchDocTypesByRepo } from "../../DocumentType/docTypeThunks";

// // // Mock data for document types with their metadata
// // const DOCUMENT_TYPES = [
// //   {
// //     id: 1,
// //     name: "Employee",
// //     metadata: [
// //       {
// //         key: "name",
// //         label: "Name",
// //         type: "text",
// //         required: true,
// //         defaultValue: "John Doe",
// //       },
// //       {
// //         key: "age",
// //         label: "Age",
// //         type: "number",
// //         required: true,
// //         defaultValue: "30",
// //       },
// //       {
// //         key: "isMarried",
// //         label: "Is Married",
// //         type: "dropdown",
// //         options: ["Yes", "No"],
// //         required: false,
// //         defaultValue: "Yes",
// //       },
// //       {
// //         key: "salary",
// //         label: "Salary",
// //         type: "number",
// //         required: true,
// //         defaultValue: "75000",
// //       },
// //       {
// //         key: "company",
// //         label: "Company",
// //         type: "dropdown",
// //         options: ["Company A", "Company B", "Company C"],
// //         required: true,
// //         defaultValue: "Company A",
// //       },
// //     ],
// //   },
// //   {
// //     id: 2,
// //     name: "Invoice",
// //     metadata: [
// //       {
// //         key: "invoiceNumber",
// //         label: "Invoice Number",
// //         type: "text",
// //         required: true,
// //         defaultValue: "INV-2024-001",
// //       },
// //       {
// //         key: "clientName",
// //         label: "Client Name",
// //         type: "text",
// //         required: true,
// //         defaultValue: "Acme Corporation",
// //       },
// //       {
// //         key: "amount",
// //         label: "Amount",
// //         type: "number",
// //         required: true,
// //         defaultValue: "5000",
// //       },
// //       {
// //         key: "date",
// //         label: "Date",
// //         type: "date",
// //         required: true,
// //         defaultValue: "2024-01-15",
// //       },
// //       {
// //         key: "status",
// //         label: "Status",
// //         type: "dropdown",
// //         options: ["Paid", "Pending", "Overdue"],
// //         required: true,
// //         defaultValue: "Paid",
// //       },
// //     ],
// //   },
// //   {
// //     id: 3,
// //     name: "Contract",
// //     metadata: [
// //       {
// //         key: "contractTitle",
// //         label: "Contract Title",
// //         type: "text",
// //         required: true,
// //         defaultValue: "Software Development Agreement",
// //       },
// //       {
// //         key: "partyA",
// //         label: "Party A",
// //         type: "text",
// //         required: true,
// //         defaultValue: "Tech Solutions Inc.",
// //       },
// //       {
// //         key: "partyB",
// //         label: "Party B",
// //         type: "text",
// //         required: true,
// //         defaultValue: "Global Enterprises LLC",
// //       },
// //       {
// //         key: "startDate",
// //         label: "Start Date",
// //         type: "date",
// //         required: true,
// //         defaultValue: "2024-01-01",
// //       },
// //       {
// //         key: "endDate",
// //         label: "End Date",
// //         type: "date",
// //         required: true,
// //         defaultValue: "2024-12-31",
// //       },
// //       {
// //         key: "value",
// //         label: "Contract Value",
// //         type: "number",
// //         required: true,
// //         defaultValue: "250000",
// //       },
// //       {
// //         key: "contractType",
// //         label: "Contract Type",
// //         type: "dropdown",
// //         options: ["Service", "Product", "Partnership", "Employment"],
// //         required: true,
// //         defaultValue: "Service",
// //       },
// //     ],
// //   },
// // ];

// // function DocumentForm() {
// //   const { t } = useTranslation();

// //   // State management
// //   const [selectedDocumentType, setSelectedDocumentType] = useState("");
// //   const [currentMetadata, setCurrentMetadata] = useState([]);
// //   const [jsonData, setJsonData] = useState({});
// //   const [fetchedDocumentTypes, setFetchedDocumentTypes] = useState(null);
// //   const dispatch = useDispatch();
// //   const params = useParams();

// //   const { docTypes } = useSelector((state) => state.docTypeReducer);

// //   useEffect(() => {
// //     dispatch(fetchDocTypesByRepo());
// //   }, [dispatch]);

// //   useEffect(() => {
// //     console.log(docTypes);
// //   }, [docTypes]);

// //   // Handle document type selection
// //   const handleDocumentTypeChange = (e) => {
// //     const documentTypeName = e.target.value;
// //     setSelectedDocumentType(documentTypeName);
// //     console.log(selectedDocumentType.id);

// //     // Find the selected document type and its metadata
// //     const selectedType = DOCUMENT_TYPES.find(
// //       (type) => type.name === documentTypeName
// //     );

// //     if (selectedType) {
// //       setCurrentMetadata(selectedType.metadata);

// //       // Initialize JSON data with default values from metadata
// //       const initialData = {};
// //       selectedType.metadata.forEach((field) => {
// //         // Use defaultValue if provided, otherwise use empty string or first option for dropdowns
// //         if (field.defaultValue) {
// //           initialData[field.key] = field.defaultValue;
// //         } else if (field.type === "dropdown" && field.options.length > 0) {
// //           initialData[field.key] = field.options[0];
// //         } else {
// //           initialData[field.key] = "";
// //         }
// //       });
// //       setJsonData(initialData);
// //     } else {
// //       setCurrentMetadata([]);
// //       setJsonData({});
// //     }
// //   };

// //   // Handle JSON field changes
// //   const handleFieldChange = (key, value) => {
// //     setJsonData((prev) => ({
// //       ...prev,
// //       [key]: value,
// //     }));
// //   };

// //   // Log JSON data whenever it changes (ready for backend)
// //   useEffect(() => {
// //     if (selectedDocumentType && Object.keys(jsonData).length > 0) {
// //       const completeJsonData = {
// //         documentType: selectedDocumentType,
// //         metadata: jsonData,
// //       };

// //       console.log("=== JSON Data (Ready for Backend) ===");
// //       console.log(JSON.stringify(completeJsonData, null, 2));
// //       console.log("=====================================");

// //       // This is what you would send to the backend:
// //       // fetch('/api/documents', {
// //       //   method: 'POST',
// //       //   headers: { 'Content-Type': 'application/json' },
// //       //   body: JSON.stringify(completeJsonData)
// //       // });
// //     }
// //   }, [jsonData, selectedDocumentType]);

// //   // Render input field based on metadata type
// //   const renderField = (field) => {
// //     switch (field.type) {
// //       case "text":
// //         return (
// //           <input
// //             type="text"
// //             value={jsonData[field.key] || ""}
// //             onChange={(e) => handleFieldChange(field.key, e.target.value)}
// //             className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
// //             placeholder={`Enter ${field.label}`}
// //             required={field.required}
// //           />
// //         );

// //       case "number":
// //         return (
// //           <input
// //             type="number"
// //             value={jsonData[field.key] || ""}
// //             onChange={(e) => handleFieldChange(field.key, e.target.value)}
// //             className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
// //             placeholder={`Enter ${field.label}`}
// //             required={field.required}
// //           />
// //         );

// //       case "date":
// //         return (
// //           <input
// //             type="date"
// //             value={jsonData[field.key] || ""}
// //             onChange={(e) => handleFieldChange(field.key, e.target.value)}
// //             className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
// //             required={field.required}
// //           />
// //         );

// //       case "dropdown":
// //         return (
// //           <select
// //             value={jsonData[field.key] || ""}
// //             onChange={(e) => handleFieldChange(field.key, e.target.value)}
// //             className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
// //             required={field.required}
// //           >
// //             {field.options.map((option, index) => (
// //               <option key={index} value={option}>
// //                 {option}
// //               </option>
// //             ))}
// //           </select>
// //         );

// //       case "checkbox":
// //         return (
// //           <div className="flex items-center">
// //             <input
// //               type="checkbox"
// //               checked={jsonData[field.key] || false}
// //               onChange={(e) => handleFieldChange(field.key, e.target.checked)}
// //               className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
// //             />
// //             <span className="ml-2 text-sm text-gray-700">{field.label}</span>
// //           </div>
// //         );

// //       default:
// //         return null;
// //     }
// //   };

// //   return (
// //     <div className="py-1 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50">
// //       <div className="max-w-7xl mx-auto">
// //         {/* Header */}
// //         <div className="text-center mb-3">
// //           <div className="inline-flex items-center gap-4 bg-white rounded-xl px-8 py-4 shadow-sm border border-gray-200">
// //             <div className="p-3 bg-blue-100 rounded-lg">
// //               <FileText className="w-6 h-6 text-blue-600" />
// //             </div>
// //             <div className="text-left">
// //               <h1 className="text-xl font-bold text-gray-900">
// //                 Create New Document
// //               </h1>
// //               <p className="text-gray-600 text-sm mt-1">
// //                 Select document type and fill metadata - Data saved as JSON
// //               </p>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Main Form Area */}
// //         <div className="space-y-8">
// //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
// //             {/* Left Column - Document Type Selection */}
// //             <div className="space-y-6">
// //               {/* Document Type Selection Card */}
// //               <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
// //                 <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
// //                   <div className="flex items-center gap-3">
// //                     <div className="p-2 bg-blue-100 rounded-lg">
// //                       <Database className="w-5 h-5 text-blue-600" />
// //                     </div>
// //                     <h2 className="text-xl font-semibold text-gray-900">
// //                       Document Type
// //                     </h2>
// //                   </div>
// //                 </div>

// //                 <div className="p-6 space-y-4">
// //                   {/* Document Type Dropdown */}
// //                   <div>
// //                     <label className="block text-sm font-semibold text-gray-700 mb-2">
// //                       Select Document Type
// //                       <span className="text-red-500">*</span>
// //                     </label>
// //                     <div className="relative">
// //                       <select
// //                         value={selectedDocumentType}
// //                         onChange={handleDocumentTypeChange}
// //                         className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white appearance-none"
// //                       >
// //                         <option value="">Select a document type...</option>
// //                         {docTypes.map((type) => (
// //                           <option key={type.id} value={type.name}>
// //                             {type.name}
// //                           </option>
// //                         ))}
// //                       </select>
// //                       <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
// //                     </div>
// //                   </div>

// //                   {/* Info box when no document type selected */}
// //                   {!selectedDocumentType && (
// //                     <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
// //                       <p className="text-sm text-blue-800">
// //                         Please select a document type to view and fill the
// //                         metadata fields.
// //                       </p>
// //                     </div>
// //                   )}

// //                   {/* Display selected document type info */}
// //                   {selectedDocumentType && (
// //                     <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
// //                       <p className="text-sm font-semibold text-green-900 mb-1">
// //                         Selected: {selectedDocumentType}
// //                       </p>
// //                       <p className="text-xs text-green-700">
// //                         {currentMetadata.length} metadata fields available
// //                       </p>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>

// //             {/* Right Column - Dynamic Metadata Fields */}
// //             <div className="space-y-6">
// //               {selectedDocumentType && currentMetadata.length > 0 && (
// //                 <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
// //                   <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
// //                     <div className="flex items-center gap-3">
// //                       <div className="p-2 bg-green-100 rounded-lg">
// //                         <FileText className="w-5 h-5 text-green-600" />
// //                       </div>
// //                       <h2 className="text-xl font-semibold text-gray-900">
// //                         Document Metadata
// //                       </h2>
// //                     </div>
// //                   </div>

// //                   <div className="p-6 space-y-4">
// //                     {currentMetadata.map((field, index) => (
// //                       <div key={index}>
// //                         <label className="block text-sm font-semibold text-gray-700 mb-2">
// //                           {field.label}
// //                           {field.required && (
// //                             <span className="text-red-500 ml-1">*</span>
// //                           )}
// //                         </label>
// //                         {renderField(field)}
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}

// //               {/* Empty state when no document type selected */}
// //               {!selectedDocumentType && (
// //                 <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
// //                   <div className="p-12 text-center">
// //                     <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
// //                       <FileText className="w-8 h-8 text-gray-400" />
// //                     </div>
// //                     <h3 className="text-lg font-semibold text-gray-900 mb-2">
// //                       No Document Type Selected
// //                     </h3>
// //                     <p className="text-sm text-gray-600">
// //                       Select a document type from the left panel to view and
// //                       fill the metadata fields.
// //                     </p>
// //                   </div>
// //                 </div>
// //               )}
// //             </div>
// //           </div>

// //           {/* JSON Preview Card (shows current JSON data) */}
// //           {selectedDocumentType && Object.keys(jsonData).length > 0 && (
// //             <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
// //               <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
// //                 <h3 className="text-lg font-semibold text-gray-900">
// //                   JSON Data Preview (Ready for Backend)
// //                 </h3>
// //               </div>
// //               <div className="p-6">
// //                 <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
// //                   <pre className="text-green-400 overflow-x-auto">
// //                     {JSON.stringify(
// //                       {
// //                         documentType: selectedDocumentType,
// //                         metadata: jsonData,
// //                       },
// //                       null,
// //                       2
// //                     )}
// //                   </pre>
// //                 </div>
// //                 <p className="text-xs text-gray-500 mt-3">
// //                   * JSON data is automatically logged to console on every change
// //                 </p>
// //                 <p className="text-xs text-gray-500 mt-1">
// //                   * This JSON format is ready to be sent to your backend API
// //                 </p>
// //               </div>
// //             </div>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default DocumentForm;

/* eslint-disable react/prop-types */
import React, { useState, useEffect, useCallback } from "react";
import { FileText, Database, ChevronDown, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Popup from "../../../globalComponents/Popup";
import UsersRolesPermissionsTable from "../../Permissions/UsersRolesPermissionsTable";
import { fetchPrinciples } from "../../Permissions/permissionsThunks";
import {
  fetchtDocTypeByAttributes,
  fetchDocTypesByRepo,
} from "../../DocumentType/docTypeThunks";

function DocumentForm() {
  const { t } = useTranslation();
  const { repoId } = useParams();
  const dispatch = useDispatch();
  const currentRepoId = repoId || 1;
  console.log(currentRepoId);

  // Redux selectors
  const { docTypes } = useSelector((state) => state.docTypeReducer);

  // State management
  const [selectedDocumentType, setSelectedDocumentType] = useState("");
  const [selectedDocumentTypeId, setSelectedDocumentTypeId] = useState(null);
  const [currentMetadata, setCurrentMetadata] = useState([]);
  const [jsonData, setJsonData] = useState({});

  // Permissions state
  const [openPermissions, setOpenPermissions] = useState(false);
  const [permissionsData, setPermissionsData] = useState({
    clearanceRules: [],
    aclRules: [],
  });

  // Fetch document types on component mount
  useEffect(() => {
    dispatch(fetchDocTypesByRepo(currentRepoId));
  }, [dispatch, currentRepoId]);

  // Fetch principles for permissions
  useEffect(() => {
    if (currentRepoId) {
      dispatch(fetchPrinciples(currentRepoId));
    }
  }, [dispatch, currentRepoId]);

  // Handle document type selection
  const handleDocumentTypeChange = async (e) => {
    const documentTypeId = e.target.value;

    if (!documentTypeId) {
      setSelectedDocumentType("");
      setSelectedDocumentTypeId(null);
      setCurrentMetadata([]);
      setJsonData({});
      return;
    }

    // Find the selected document type
    const selectedType = docTypes.find(
      (type) => type.id === parseInt(documentTypeId)
    );

    if (selectedType) {
      setSelectedDocumentType(selectedType.name);
      setSelectedDocumentTypeId(selectedType.id);

      try {
        // Fetch metadata/attributes for the selected document type
        const response = await dispatch(
          fetchtDocTypeByAttributes(documentTypeId)
        );

        console.log("Document Type ID:", documentTypeId);
        console.log("Full response:", response);

        // Access the payload from the Redux action
        // The response structure is: { type: '...', payload: {...}, meta: {...} }
        const attributeData = response?.payload || response;

        console.log("Attribute Data:", attributeData);

        // Transform the API response to match our metadata format
        if (
          attributeData &&
          attributeData.attributeResponses &&
          Array.isArray(attributeData.attributeResponses)
        ) {
          console.log(
            "Transforming attributes:",
            attributeData.attributeResponses
          );

          const transformedMetadata = attributeData.attributeResponses.map(
            (attr) => {
              const field = {
                key: attr.attributeName,
                label: attr.attributeName,
                type: mapAttributeTypeToInputType(attr.attributeType),
                required: attr.attributeValue !== null,
                defaultValue: attr.attributeValue || "",
                attributeSize: attr.attributeSize || null,
              };

              // If you have options for dropdown/select fields, add them here
              // This would need to come from your API or be configured separately
              if (field.type === "dropdown") {
                field.options = []; // Add options if available from API
              }

              return field;
            }
          );

          console.log("Transformed metadata:", transformedMetadata);
          setCurrentMetadata(transformedMetadata);

          // Initialize JSON data with default values
          const initialData = {};
          transformedMetadata.forEach((field) => {
            if (field.defaultValue) {
              initialData[field.key] = field.defaultValue;
            } else if (field.type === "dropdown" && field.options?.length > 0) {
              initialData[field.key] = field.options[0];
            } else {
              initialData[field.key] = "";
            }
          });
          setJsonData(initialData);
        } else {
          console.warn(
            "No attributeResponses found in response:",
            attributeData
          );
          setCurrentMetadata([]);
          setJsonData({});
        }
      } catch (error) {
        console.error("Error fetching document type attributes:", error);
        setCurrentMetadata([]);
        setJsonData({});
      }
    }
  };

  // Helper function to map API attribute types to input types
  const mapAttributeTypeToInputType = (attributeType) => {
    const typeMap = {
      string: "text",
      text: "text",
      number: "number",
      integer: "number",
      date: "date",
      datetime: "date",
      boolean: "checkbox",
      dropdown: "dropdown",
      select: "dropdown",
    };

    return typeMap[attributeType?.toLowerCase()] || "text";
  };

  // Handle JSON field changes
  const handleFieldChange = (key, value) => {
    setJsonData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Handle permissions button click
  const handlePermissions = () => {
    setOpenPermissions(true);
  };

  // Handle permissions data from UsersRolesPermissionsTable
  const handlePermissionsDataChange = (data) => {
    setPermissionsData(data);
    setOpenPermissions(false);
  };

  // Log JSON data whenever it changes (ready for backend)
  useEffect(() => {
    if (selectedDocumentType && Object.keys(jsonData).length > 0) {
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

      const completeJsonData = {
        documentTypeId: selectedDocumentTypeId,
        documentType: selectedDocumentType,
        metadata: jsonData,
        aclRules: transformedAclRules,
      };

      console.log("=== JSON Data (Ready for Backend) ===");
      console.log(JSON.stringify(completeJsonData, null, 2));
      console.log("=====================================");

      // This is what you would send to the backend:
      // fetch('/api/documents', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(completeJsonData)
      // });
    }
  }, [jsonData, selectedDocumentType, selectedDocumentTypeId, permissionsData]);

  // Render input field based on metadata type
  const renderField = (field) => {
    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            value={jsonData[field.key] || ""}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder={`Enter ${field.label}`}
            required={field.required}
            maxLength={field.attributeSize || undefined}
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={jsonData[field.key] || ""}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder={`Enter ${field.label}`}
            required={field.required}
          />
        );

      case "date":
        return (
          <input
            type="date"
            value={jsonData[field.key] || ""}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            required={field.required}
          />
        );

      case "dropdown":
        return (
          <select
            value={jsonData[field.key] || ""}
            onChange={(e) => handleFieldChange(field.key, e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
            required={field.required}
          >
            <option value="">Select an option...</option>
            {field.options &&
              field.options.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
          </select>
        );

      case "checkbox":
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={jsonData[field.key] || false}
              onChange={(e) => handleFieldChange(field.key, e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">{field.label}</span>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="py-1 px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center gap-4 bg-white rounded-xl px-8 py-4 shadow-sm border border-gray-200">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-gray-900">
                Create New Document
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Select document type and fill metadata - Data saved as JSON
              </p>
            </div>
          </div>
        </div>

        {/* Main Form Area */}
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Document Type Selection */}
            <div className="space-y-6">
              {/* Document Type Selection Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Database className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Document Type
                    </h2>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {/* Document Type Dropdown */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Select Document Type
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={selectedDocumentTypeId || ""}
                        onChange={handleDocumentTypeChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white appearance-none"
                      >
                        <option value="">Select a document type...</option>
                        {docTypes &&
                          docTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                              {type.name}
                            </option>
                          ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Info box when no document type selected */}
                  {!selectedDocumentType && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                      <p className="text-sm text-blue-800">
                        Please select a document type to view and fill the
                        metadata fields.
                      </p>
                    </div>
                  )}

                  {/* Display selected document type info */}
                  {selectedDocumentType && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                      <p className="text-sm font-semibold text-green-900 mb-1">
                        Selected: {selectedDocumentType}
                      </p>
                      <p className="text-xs text-green-700">
                        {currentMetadata.length} metadata fields available
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Permissions Card */}
              {selectedDocumentType && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <Shield className="w-5 h-5 text-orange-600" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Permissions
                      </h2>
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-sm text-gray-600 mb-4">
                      Configure access control rules for this document
                    </p>
                    <button
                      type="button"
                      onClick={handlePermissions}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium"
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
              )}
            </div>

            {/* Right Column - Dynamic Metadata Fields */}
            <div className="space-y-6">
              {selectedDocumentType && currentMetadata.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FileText className="w-5 h-5 text-green-600" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Document Metadata
                      </h2>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    {currentMetadata.map((field, index) => (
                      <div key={index}>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {field.label}
                          {field.required && (
                            <span className="text-red-500 ml-1">*</span>
                          )}
                        </label>
                        {renderField(field)}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Empty state when no document type selected */}
              {!selectedDocumentType && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-12 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                      <FileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      No Document Type Selected
                    </h3>
                    <p className="text-sm text-gray-600">
                      Select a document type from the left panel to view and
                      fill the metadata fields.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Permissions Popup */}
          {openPermissions && (
            <Popup
              isOpen={openPermissions}
              setIsOpen={setOpenPermissions}
              component={
                <UsersRolesPermissionsTable
                  entityType="document"
                  onDone={handlePermissionsDataChange}
                  savedData={permissionsData}
                />
              }
            />
          )}

          {/* JSON Preview Card (shows current JSON data) */}
          {selectedDocumentType && Object.keys(jsonData).length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  JSON Data Preview (Ready for Backend)
                </h3>
              </div>
              <div className="p-6">
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
                  <pre className="text-green-400 overflow-x-auto">
                    {JSON.stringify(
                      {
                        documentTypeId: selectedDocumentTypeId,
                        documentType: selectedDocumentType,
                        metadata: jsonData,
                        aclRules: permissionsData.aclRules.map((rule) => {
                          let permissionsArray = [];
                          if (Array.isArray(rule.permissions)) {
                            permissionsArray = rule.permissions
                              .filter((p) => p != null)
                              .map((p) => {
                                if (typeof p === "object" && p.code) {
                                  return p.code;
                                } else if (
                                  typeof p === "string" &&
                                  p.trim() !== ""
                                ) {
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
                            accessType:
                              rule.accessType === 0 ? "deny" : "allow",
                          };
                        }),
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  * JSON data is automatically logged to console on every change
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  * This JSON format is ready to be sent to your backend API
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DocumentForm;
