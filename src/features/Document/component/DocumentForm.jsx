// /* eslint-disable react/prop-types */
// import { useState, useEffect } from "react";
// import { FileText, Database, ChevronDown, Shield } from "lucide-react";
// import { useTranslation } from "react-i18next";
// import { useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import Popup from "../../../globalComponents/Popup";
// import UsersRolesPermissionsTable from "../../Permissions/UsersRolesPermissionsTable";
// import { fetchPrinciples } from "../../Permissions/permissionsThunks";
// import { fetchDocTypesByRepo, fetchtDocTypeByAttributes } from "../../DocumentType/DocTypeThunks";

// function DocumentForm({ onDocumentTypeChange }) {
//   const { t } = useTranslation();
//   const { repoId } = useParams();
//   const dispatch = useDispatch();
//   const currentRepoId = repoId || 1;

//   // Redux selectors
//   const { docTypes } = useSelector((state) => state.docTypeReducer);

//   // State management
//   const [selectedDocumentType, setSelectedDocumentType] = useState("");
//   const [selectedDocumentTypeId, setSelectedDocumentTypeId] = useState(null);
//   const [currentMetadata, setCurrentMetadata] = useState([]);
//   const [jsonData, setJsonData] = useState({});

//   // Permissions state
//   const [openPermissions, setOpenPermissions] = useState(false);
//   const [permissionsData, setPermissionsData] = useState({
//     clearanceRules: [],
//     aclRules: [],
//   });

//   // Fetch document types on component mount
//   useEffect(() => {
//     dispatch(fetchDocTypesByRepo(currentRepoId));
//   }, [dispatch, currentRepoId]);

//   // Fetch principles for permissions
//   useEffect(() => {
//     if (currentRepoId) {
//       dispatch(fetchPrinciples(currentRepoId));
//     }
//   }, [dispatch, currentRepoId]);

//   // Handle document type selection
//   const handleDocumentTypeChange = async (e) => {
//     const documentTypeId = e.target.value;

//     if (!documentTypeId) {
//       setSelectedDocumentType("");
//       setSelectedDocumentTypeId(null);
//       setCurrentMetadata([]);
//       setJsonData({});

//       // ✅ Notify parent component
//       if (onDocumentTypeChange) {
//         onDocumentTypeChange(null, []);
//       }
//       return;
//     }

//     // Find the selected document type
//     const selectedType = docTypes.find(
//       (type) => type.id === parseInt(documentTypeId)
//     );

//     if (selectedType) {
//       setSelectedDocumentType(selectedType.name);
//       setSelectedDocumentTypeId(selectedType.id);

//       // ✅ Notify parent component with selected ID and docTypes list
//       if (onDocumentTypeChange) {
//         onDocumentTypeChange(selectedType.id, docTypes);
//       }

//       try {
//         // Fetch metadata/attributes for the selected document type
//         const response = await dispatch(
//           fetchtDocTypeByAttributes(documentTypeId)
//         );

//         console.log("Document Type ID:", documentTypeId);
//         console.log("Full response:", response);

//         // Access the payload from the Redux action
//         const attributeData = response?.payload || response;

//         console.log("Attribute Data:", attributeData);
//         if (
//           attributeData &&
//           attributeData.attributeResponses &&
//           Array.isArray(attributeData.attributeResponses)
//         ) {
//           console.log(
//             "Transforming attributes:",
//             attributeData.attributeResponses
//           );
//           const transformedMetadata = attributeData.attributeResponses.map(
//             (attr) => {
//               const field = {
//                 key: attr.attributeName,
//                 label: attr.attributeName,
//                 type: mapAttributeTypeToInputType(attr.attributeType),
//                 required: attr.attributeValue !== null,
//                 defaultValue: attr.attributeValue || "",
//                 attributeSize: attr.attributeSize || null,
//               };

//               if (field.type === "dropdown") {
//                 field.options = [];
//               }

//               return field;
//             }
//           );

//           console.log("Transformed metadata:", transformedMetadata);
//           setCurrentMetadata(transformedMetadata);

//           // Initialize JSON data with default values
//           const initialData = {};
//           transformedMetadata.forEach((field) => {
//             if (field.defaultValue) {
//               initialData[field.key] = field.defaultValue;
//             } else if (field.type === "dropdown" && field.options?.length > 0) {
//               initialData[field.key] = field.options[0];
//             } else {
//               initialData[field.key] = "";
//             }
//           });
//           setJsonData(initialData);
//         } else {
//           console.warn(
//             "No attributeResponses found in response:",
//             attributeData
//           );
//           setCurrentMetadata([]);
//           setJsonData({});
//         }
//       } catch (error) {
//         console.error("Error fetching document type attributes:", error);
//         setCurrentMetadata([]);
//         setJsonData({});
//       }
//     }
//   };

//   // Helper function to map API attribute types to input types
//   const mapAttributeTypeToInputType = (attributeType) => {
//     const typeMap = {
//       string: "text",
//       text: "text",
//       number: "number",
//       integer: "number",
//       date: "date",
//       datetime: "date",
//       boolean: "checkbox",
//       dropdown: "dropdown",
//       select: "dropdown",
//     };

//     return typeMap[attributeType?.toLowerCase()] || "text";
//   };

//   // Handle JSON field changes
//   const handleFieldChange = (key, value) => {
//     setJsonData((prev) => ({
//       ...prev,
//       [key]: value,
//     }));
//   };

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
//         documentTypeId: selectedDocumentTypeId,
//         documentType: selectedDocumentType,
//         metadata: jsonData,
//         aclRules: transformedAclRules,
//       };

//       console.log("=== JSON Data (Ready for Backend) ===");
//       console.log(JSON.stringify(completeJsonData, null, 2));
//     }
//   }, [jsonData, selectedDocumentType, selectedDocumentTypeId, permissionsData]);

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
//             placeholder={t("enterFieldPlaceholder", { field: field.label })}
//             required={field.required}
//             maxLength={field.attributeSize || undefined}
//           />
//         );

//       case "number":
//         return (
//           <input
//             type="number"
//             value={jsonData[field.key] || ""}
//             onChange={(e) => handleFieldChange(field.key, e.target.value)}
//             className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
//             placeholder={t("enterFieldPlaceholder", { field: field.label })}
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
//             <option value="">{t("selectOption")}</option>
//             {field.options &&
//               field.options.map((option, index) => (
//                 <option key={index} value={option}>
//                   {option}
//                 </option>
//               ))}
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
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="text-center">
//         <div className="inline-flex items-center gap-4 bg-white rounded-xl px-8 py-4 shadow-sm border border-gray-200">
//           <div className="p-3 bg-blue-100 rounded-lg">
//             <FileText className="w-6 h-6 text-blue-600" />
//           </div>
//           <div className="text-left">
//             <h1 className="text-xl font-bold text-gray-900">
//               {t("createNewDocument")}
//             </h1>
//             <p className="text-gray-600 text-sm mt-1">{t("description")}</p>
//           </div>
//         </div>
//       </div>

//       {/* Document Type Selection Card */}
//       <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//         <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
//           <div className="flex items-center gap-3">
//             <div className="p-2 bg-blue-100 rounded-lg">
//               <Database className="w-5 h-5 text-blue-600" />
//             </div>
//             <h2 className="text-xl font-semibold text-gray-900">
//               {t("documentType")}
//             </h2>
//           </div>
//         </div>

//         <div className="p-6 space-y-4">
//           {/* Document Type Dropdown */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               {t("selectDocumentType")}
//               <span className="text-red-500">*</span>
//             </label>
//             <div className="relative">
//               <select
//                 value={selectedDocumentTypeId || ""}
//                 onChange={handleDocumentTypeChange}
//                 className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white appearance-none"
//               >
//                 <option value="">{t("selectDocumentType")}...</option>
//                 {docTypes &&
//                   docTypes.map((type) => (
//                     <option key={type.id} value={type.id}>
//                       {type.name}
//                     </option>
//                   ))}
//               </select>
//               <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
//             </div>
//           </div>

//           {/* Info box when no document type selected */}
//           {!selectedDocumentType && (
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
//               <p className="text-sm text-blue-800">
//                 {t("pleaseSelectDocumentType")}
//               </p>
//             </div>
//           )}

//           {/* Display selected document type info */}
//           {selectedDocumentType && (
//             <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
//               <p className="text-sm font-semibold text-green-900 mb-1">
//                 {t("selected")}: {selectedDocumentType}
//               </p>
//               <p className="text-xs text-green-700">
//                 {currentMetadata.length} {t("metadataFieldsAvailable")}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Document Metadata Card */}
//       {selectedDocumentType && currentMetadata.length > 0 && (
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-green-100 rounded-lg">
//                 <FileText className="w-5 h-5 text-green-600" />
//               </div>
//               <h2 className="text-xl font-semibold text-gray-900">
//                 {t("documentMetadata")}
//               </h2>
//             </div>
//           </div>

//           <div className="p-6 space-y-4">
//             {currentMetadata.map((field, index) => (
//               <div key={index}>
//                 <label className="block text-sm font-semibold text-gray-700 mb-2">
//                   {field.label}
//                   {field.required && (
//                     <span className="text-red-500 ml-1">*</span>
//                   )}
//                 </label>
//                 {renderField(field)}
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Empty state when no document type selected */}
//       {!selectedDocumentType && (
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="p-12 text-center">
//             <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
//               <FileText className="w-8 h-8 text-gray-400" />
//             </div>
//             <h3 className="text-lg font-semibold text-gray-900 mb-2">
//               {t("noDocumentTypeSelected")}
//             </h3>
//             <p className="text-sm text-gray-600">
//               {t("selectDocumentTypeLeftPanel")}
//             </p>
//           </div>
//         </div>
//       )}

//       {/* Permissions Card */}
//       {selectedDocumentType && (
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
//             <div className="flex items-center gap-3">
//               <div className="p-2 bg-orange-100 rounded-lg">
//                 <Shield className="w-5 h-5 text-orange-600" />
//               </div>
//               <h2 className="text-xl font-semibold text-gray-900">
//                 {t("permissions")}
//               </h2>
//             </div>
//           </div>

//           <div className="p-6">
//             <p className="text-sm text-gray-600 mb-4">
//               {t("configurePermissions")}
//             </p>
//             <button
//               type="button"
//               onClick={handlePermissions}
//               className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium"
//             >
//               <Shield className="w-4 h-4" />
//               {t("configurePermissionsButton")}
//               {permissionsData.aclRules.length > 0 && (
//                 <span className="bg-orange-800 text-white px-2 py-1 rounded-full text-xs">
//                   {permissionsData.aclRules.length}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>
//       )}

//       {/* Permissions Popup */}
//       {openPermissions && (
//         <Popup
//           isOpen={openPermissions}
//           setIsOpen={setOpenPermissions}
//           component={
//             <UsersRolesPermissionsTable
//               entityType="document"
//               onDone={handlePermissionsDataChange}
//               savedData={permissionsData}
//             />
//           }
//         />
//       )}

//       {/* JSON Preview Card */}
//       {selectedDocumentType && Object.keys(jsonData).length > 0 && (
//         <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//           <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
//             <h3 className="text-lg font-semibold text-gray-900">
//               {t("jsonDataPreview")}
//             </h3>
//           </div>
//           <div className="p-6">
//             <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm">
//               <pre className="text-green-400 overflow-x-auto">
//                 {JSON.stringify(
//                   {
//                     documentTypeId: selectedDocumentTypeId,
//                     documentType: selectedDocumentType,
//                     metadata: jsonData,
//                     aclRules: permissionsData.aclRules.map((rule) => {
//                       let permissionsArray = [];
//                       if (Array.isArray(rule.permissions)) {
//                         permissionsArray = rule.permissions
//                           .filter((p) => p != null)
//                           .map((p) => {
//                             if (typeof p === "object" && p.code) {
//                               return p.code;
//                             } else if (
//                               typeof p === "string" &&
//                               p.trim() !== ""
//                             ) {
//                               return p.trim();
//                             }
//                             return null;
//                           })
//                           .filter((p) => p != null);
//                       } else if (
//                         typeof rule.permissions === "string" &&
//                         rule.permissions.trim() !== ""
//                       ) {
//                         permissionsArray = [rule.permissions.trim()];
//                       }

//                       return {
//                         principalId: String(rule.principalId || ""),
//                         principalType: rule.principalType || "user",
//                         permissions: permissionsArray,
//                         accessType: rule.accessType === 0 ? "deny" : "allow",
//                       };
//                     }),
//                   },
//                   null,
//                   2
//                 )}
//               </pre>
//             </div>
//             <p className="text-xs text-gray-500 mt-3">
//               * {t("jsonDataAutomaticallyLogged")}
//             </p>
//             <p className="text-xs text-gray-500 mt-1">
//               * {t("jsonFormatReady")}
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default DocumentForm;


/* eslint-disable react/prop-types */
// fill Data from backend or when user want to update the document data
import { useState, useEffect } from "react";
import { FileText, Database, ChevronDown, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Popup from "../../../globalComponents/Popup";
import UsersRolesPermissionsTable from "../../Permissions/UsersRolesPermissionsTable";
import { fetchPrinciples } from "../../Permissions/permissionsThunks";
import {
  fetchDocTypesByRepo,
  fetchtDocTypeByAttributes,
} from "../../DocumentType/DocTypeThunks";
import { setDocumentData } from "../documentViewerSlice";

function DocumentForm({ onDocumentTypeChange }) {
  const { t } = useTranslation();
  const { repoId } = useParams();
  const dispatch = useDispatch();
  const currentRepoId = repoId || 1;

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

      if (onDocumentTypeChange) {
        onDocumentTypeChange(null, []);
      }
      return;
    }

    const selectedType = docTypes.find(
      (type) => type.id === parseInt(documentTypeId)
    );

    if (selectedType) {
      setSelectedDocumentType(selectedType.name);
      setSelectedDocumentTypeId(selectedType.id);

      if (onDocumentTypeChange) {
        onDocumentTypeChange(selectedType.id, docTypes);
      }

      try {
        const response = await dispatch(
          fetchtDocTypeByAttributes(documentTypeId)
        );

        console.log("Document Type ID:", documentTypeId);
        console.log("Full response:", response);

        const attributeData = response?.payload || response;

        console.log("Attribute Data:", attributeData);
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

              if (field.type === "dropdown") {
                field.options = [];
              }

              return field;
            }
          );

          console.log("Transformed metadata:", transformedMetadata);
          setCurrentMetadata(transformedMetadata);

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
      dispatch(setDocumentData(completeJsonData));
      

      console.log("=== JSON Data (Ready for Backend) ===");
      console.log(JSON.stringify(completeJsonData, null, 2));
    }
  }, [jsonData, selectedDocumentType, selectedDocumentTypeId, permissionsData ,dispatch]);

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
            placeholder={t("enterFieldPlaceholder", { field: field.label })}
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
            placeholder={t("enterFieldPlaceholder", { field: field.label })}
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
            <option value="">{t("selectOption")}</option>
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
    <div className="space-y-6">
      {/* ✅ Header - Matching Repos Style */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {t("createNewDocument")}
        </h1>
        <p className="text-gray-600">{t("description")}</p>
      </div>

      {/* Document Type Selection Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">
              {t("documentType")}
            </h2>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Document Type Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("selectDocumentType")}
              <span className="text-red-500 ml-1">*</span>
            </label>
            <div className="relative">
              <select
                value={selectedDocumentTypeId || ""}
                onChange={handleDocumentTypeChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white appearance-none"
              >
                <option value="">{t("selectDocumentType")}...</option>
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
                {t("pleaseSelectDocumentType")}
              </p>
            </div>
          )}

        
        </div>
      </div>

      {/* Document Metadata Card */}
      {selectedDocumentType && currentMetadata.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {t("documentMetadata")}
              </h2>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {currentMetadata.map((field, index) => (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {t("noDocumentTypeSelected")}
            </h3>
            <p className="text-sm text-gray-600">
              {t("selectDocumentTypeLeftPanel")}
            </p>
          </div>
        </div>
      )}

      {/* Permissions Card */}
      {selectedDocumentType && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Shield className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">
                {t("permissions")}
              </h2>
            </div>
          </div>

          <div className="p-6">
            <p className="text-sm text-gray-600 mb-4">
              {t("configurePermissions")}
            </p>
            <button
              type="button"
              onClick={handlePermissions}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              <Shield className="w-4 h-4" />
              {t("configurePermissionsButton")}
              {permissionsData.aclRules.length > 0 && (
                <span className="bg-orange-800 text-white px-2 py-1 rounded-full text-xs">
                  {permissionsData.aclRules.length}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

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

      {/* JSON Preview Card */}
      {selectedDocumentType && Object.keys(jsonData).length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {t("jsonDataPreview")}
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
                        accessType: rule.accessType === 0 ? "deny" : "allow",
                      };
                    }),
                  },
                  null,
                  2
                )}
              </pre>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              * {t("jsonDataAutomaticallyLogged")}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              * {t("jsonFormatReady")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default DocumentForm;
