// // /* eslint-disable react/prop-types */
// // import { useCallback, useEffect, useMemo, useState } from "react";
// // import ReUsableTable from "../../resusableComponents/table/ReUsableTable";
// // import { useDispatch, useSelector } from "react-redux";
// // import Permissions from "./Permissions";
// // import { useTranslation } from "react-i18next";
// // import { useParams } from "react-router-dom";
// // import { fetchPrinciples } from "./permissionsThunks";

// // // Access Type Cell Component
// // const AccessTypeCell = ({
// //   row,
// //   type,
// //   dataChanges,
// //   handleAccessTypeChange,
// //   getRowId,
// //   getOriginalAccessType,
// //   t,
// // }) => {
// //   const tableType = type === "user" ? "users" : "roles";
// //   const rowId = getRowId(row);
// //   const currentData = dataChanges[tableType]?.[rowId];

// //   const isChecked =
// //     currentData?.accessType !== undefined
// //       ? currentData.accessType === 1
// //       : getOriginalAccessType(row.original) === 1;

// //   const handleToggle = (checked) => {
// //     if (rowId) {
// //       const accessTypeValue = checked ? 1 : 0;
// //       handleAccessTypeChange(rowId, accessTypeValue, type);
// //     }
// //   };

// //   if (!rowId) {
// //     return <div className="text-red-500 text-sm">{t("noIdFound")}</div>;
// //   }

// //   return (
// //     <div className="flex items-center justify-center">
// //       <label className="relative inline-flex items-center cursor-pointer">
// //         <input
// //           type="checkbox"
// //           checked={isChecked}
// //           onChange={(e) => handleToggle(e.target.checked)}
// //           className="sr-only peer"
// //         />
// //         <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
// //         <span className="ml-3 text-sm font-medium text-gray-700">
// //           {isChecked ? t("allow") : t("deny")}
// //         </span>
// //       </label>
// //     </div>
// //   );
// // };

// // // Security Level Cell Component
// // const SecurityLevelCell = ({
// //   row,
// //   type,
// //   dataChanges,
// //   handleSecurityLevelChange,
// //   getRowId,
// //   getOriginalClearanceLevel,
// //   t,
// // }) => {
// //   const tableType = type === "user" ? "users" : "roles";
// //   const rowId = getRowId(row);
// //   const currentData = dataChanges[tableType]?.[rowId];
// //   const initialValue = currentData
// //     ? currentData.clearanceLevel
// //     : getOriginalClearanceLevel(row.original);

// //   const [value, setValue] = useState(initialValue ?? "");
// //   const [error, setError] = useState("");

// //   useEffect(() => {
// //     if (rowId) {
// //       const newValue =
// //         dataChanges[tableType]?.[rowId]?.clearanceLevel ??
// //         getOriginalClearanceLevel(row.original);
// //       setValue(newValue ?? "");
// //     }
// //   }, [
// //     dataChanges[tableType]?.[rowId]?.clearanceLevel,
// //     rowId,
// //     tableType,
// //     row.original.clearanceLevel,
// //     dataChanges,
// //     getOriginalClearanceLevel,
// //   ]);

// //   const handleChange = useCallback(
// //     (e) => {
// //       const inputValue = e.target.value;
// //       setValue(inputValue);

// //       if (inputValue === "") {
// //         setError("");
// //         return;
// //       }

// //       const numValue = parseInt(inputValue, 10);
// //       if (isNaN(numValue)) {
// //         setError(t("numbersOnly"));
// //         return;
// //       }
// //       if (numValue < 0 || numValue > 99) {
// //         setError(t("range0to99"));
// //         return;
// //       }
// //       setError("");
// //     },
// //     [t]
// //   );

// //   const handleBlur = useCallback(() => {
// //     if (value === "") return;

// //     const numValue = parseInt(value, 10);
// //     if (isNaN(numValue) || numValue < 0 || numValue > 99) {
// //       const defaultValue = getOriginalClearanceLevel(row.original);
// //       setValue(defaultValue ?? "");
// //       setError("");
// //       return;
// //     }

// //     if (rowId) {
// //       handleSecurityLevelChange(rowId, numValue, type);
// //     }
// //     setError("");
// //   }, [
// //     value,
// //     rowId,
// //     type,
// //     handleSecurityLevelChange,
// //     getOriginalClearanceLevel,
// //     row.original,
// //   ]);

// //   if (!rowId) {
// //     return <div className="text-red-500 text-sm">{t("noIdFound")}</div>;
// //   }

// //   return (
// //     <div className="flex flex-col items-center">
// //       <input
// //         key={`security-level-${rowId}-${tableType}`}
// //         type="number"
// //         value={value}
// //         onChange={handleChange}
// //         onBlur={handleBlur}
// //         min="0"
// //         max="99"
// //         className={`w-20 px-2 py-1 text-center border rounded-md focus:outline-none focus:ring-2 transition-colors ${
// //           error
// //             ? "border-red-300 focus:ring-red-500 focus:border-red-500"
// //             : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
// //         }`}
// //         placeholder={t("range0to99")}
// //       />
// //       {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
// //     </div>
// //   );
// // };

// // function UsersRolesPermissionsTable({
// //   onDone,
// //   savedData,
// //   entityType,
// //   isRepository,
// //   fetchUsers,
// //   fetchRoles,
// // }) {
// //   const dispatch = useDispatch();
// //   const [activeTable, setActiveTable] = useState("users");
// //   const { t } = useTranslation();
// //   const { repoId } = useParams();

// //   const [dataChanges, setDataChanges] = useState(() => {
// //     if (
// //       savedData &&
// //       (savedData.clearanceRules?.length > 0 || savedData.aclRules?.length > 0)
// //     ) {
// //       const initialState = { users: {}, roles: {} };

// //       savedData.clearanceRules?.forEach((rule) => {
// //         const tableType = rule.principalType === "user" ? "users" : "roles";
// //         initialState[tableType][rule.principalId] = {
// //           ...initialState[tableType][rule.principalId],
// //           principalId: rule.principalId,
// //           principalType: rule.principalType,
// //           [rule.principalType === "user" ? "userName" : "roleName"]:
// //             rule.userName || rule.roleName || "",
// //           clearanceLevel: rule.clearanceLevel,
// //         };
// //       });

// //       savedData.aclRules?.forEach((rule) => {
// //         const tableType = rule.principalType === "user" ? "users" : "roles";
// //         initialState[tableType][rule.principalId] = {
// //           ...initialState[tableType][rule.principalId],
// //           principalId: rule.principalId,
// //           principalType: rule.principalType,
// //           [rule.principalType === "user" ? "userName" : "roleName"]:
// //             rule.userName || rule.roleName || "",
// //           permissions: rule.permissions || [],
// //           accessType:
// //             rule.accessType === "Deny" ||
// //             rule.accessType === "deny" ||
// //             rule.accessType === 0
// //               ? 0
// //               : 1,
// //         };
// //       });

// //       return initialState;
// //     }
// //     return { users: {}, roles: {} };
// //   });

// //   // Updated selector - make sure this matches your actual Redux state structure
// //   const principlesState = useSelector((state) => state.permissionsReducer);

// //   // Extract principles data - adjust this path based on your actual state structure
// //   const principles =
// //     principlesState?.principles ||
// //     principlesState?.data ||
// //     principlesState?.response ||
// //     [];
// //   const principlesStatus = principlesState?.status || "idle";

// //   const users = useMemo(() => {
// //     const filteredUsers = principles.filter((principle) => {
// //       const isUser = principle?.type === "User";

// //       return isUser;
// //     });

// //     return filteredUsers;
// //   }, [principles]);

// //   const roles = useMemo(() => {
// //     if (!Array.isArray(principles)) {
// //       console.log(
// //         "❌ Principles is not an array:",
// //         typeof principles,
// //         principles
// //       );
// //       return [];
// //     }

// //     const filteredRoles = principles.filter((principle) => {
// //       const isRole = principle?.type === "Role";

// //       return isRole;
// //     });

// //     return filteredRoles;
// //   }, [principles]);

// //   //! To be upated => we will dispatch the function which will be coming from the Parent Component like Repo - Folder - Docuent Type

// //   useEffect(() => {
// //     if (isRepository) {
// //       console.log("Is Repo");
// //       dispatch(fetchUsers());
// //       dispatch(fetchRoles());
// //     } else {
// //       console.log("Is Not Repo");

// //       dispatch(fetchPrinciples(repoId));
// //     }
// //   }, []);
// //   // useEffect(() => {
// //   //   if (principlesStatus === "idle" && repoId) {
// //   //     dispatch(fetchPrinciples(repoId));
// //   //   }
// //   // }, [dispatch, principlesStatus, repoId]);

// //   // Debug current data

// //   const getRowId = (row) => row.original.id || row.original._id;

// //   const getOriginalAccessType = (item) => {
// //     return item.accessType === false ||
// //       item.accessType === "disabled" ||
// //       item.accessType === "Deny" ||
// //       item.accessType === "deny" ||
// //       item.accessType === 0
// //       ? 0
// //       : 1;
// //   };

// //   const getOriginalClearanceLevel = (item) => {
// //     return typeof item.clearanceLevel === "number" ? item.clearanceLevel : null;
// //   };

// //   const handleRowDoubleClickRoles = useCallback((row) => {
// //     const roleId = getRowId(row);
// //     console.log(
// //       "Role selected! Role ID:",
// //       roleId,
// //       "Full row data:",
// //       row.original
// //     );
// //   }, []);

// //   const handleRowDoubleClickUsers = useCallback((row) => {
// //     const userId = getRowId(row);
// //     console.log(
// //       "User selected! User ID:",
// //       userId,
// //       "Full row data:",
// //       row.original
// //     );
// //   }, []);

// //   const handleUserPermissionsChange = useCallback(
// //     (userId, selectedPermissions) => {
// //       console.log(
// //         "User ID:",
// //         userId,
// //         "Selected Permissions:",
// //         selectedPermissions
// //       );

// //       if (!userId) {
// //         console.error(
// //           "Invalid user ID provided to handleUserPermissionsChange"
// //         );
// //         return;
// //       }

// //       const originalUser = users.find((user) => user.id === userId);

// //       setDataChanges((prev) => ({
// //         ...prev,
// //         users: {
// //           ...prev.users,
// //           [userId]: {
// //             ...prev.users[userId],
// //             principalId: userId,
// //             principalType: "user",
// //             userName: originalUser?.name || "",
// //             permissions: Array.isArray(selectedPermissions)
// //               ? [...selectedPermissions]
// //               : [],
// //           },
// //         },
// //       }));
// //     },
// //     [users]
// //   );

// //   const handleRolePermissionsChange = useCallback(
// //     (roleId, selectedPermissions) => {
// //       console.log(
// //         "Role ID:",
// //         roleId,
// //         "Selected Permissions:",
// //         selectedPermissions
// //       );

// //       if (!roleId) {
// //         console.error(
// //           "Invalid role ID provided to handleRolePermissionsChange"
// //         );
// //         return;
// //       }

// //       const originalRole = roles.find((role) => role.id === roleId);

// //       setDataChanges((prev) => ({
// //         ...prev,
// //         roles: {
// //           ...prev.roles,
// //           [roleId]: {
// //             ...prev.roles[roleId],
// //             principalId: roleId,
// //             principalType: "role",
// //             roleName: originalRole?.name || "",
// //             permissions: Array.isArray(selectedPermissions)
// //               ? [...selectedPermissions]
// //               : [],
// //           },
// //         },
// //       }));
// //     },
// //     [roles]
// //   );

// //   const handleAccessTypeChange = useCallback(
// //     (id, accessTypeValue, type) => {
// //       console.log(
// //         `${type} ID:`,
// //         id,
// //         "Access Type:",
// //         accessTypeValue === 1 ? "Allow" : "Deny",
// //         "Value:",
// //         accessTypeValue
// //       );

// //       if (!id) {
// //         console.error(
// //           `Invalid ${type} ID provided to handleAccessTypeChange:`,
// //           id
// //         );
// //         return;
// //       }

// //       const originalData =
// //         type === "user"
// //           ? users.find((user) => user.id === id)
// //           : roles.find((role) => role.id === id);

// //       const tableType = type === "user" ? "users" : "roles";
// //       const nameField = type === "user" ? "userName" : "roleName";

// //       setDataChanges((prev) => ({
// //         ...prev,
// //         [tableType]: {
// //           ...prev[tableType],
// //           [id]: {
// //             ...prev[tableType][id],
// //             principalId: id,
// //             principalType: type,
// //             [nameField]: originalData?.name || "",
// //             accessType: accessTypeValue,
// //           },
// //         },
// //       }));
// //     },
// //     [users, roles]
// //   );

// //   const handleSecurityLevelChange = useCallback(
// //     (id, value, type) => {
// //       const numValue = parseInt(value, 10);
// //       if (isNaN(numValue) || numValue < 0 || numValue > 99) {
// //         console.log("Invalid security level. Must be between 0-99");
// //         return;
// //       }
// //       console.log(`${type} ID:`, id, "Security Level:", numValue);

// //       if (!id) {
// //         console.error(
// //           `Invalid ${type} ID provided to handleSecurityLevelChange:`,
// //           id
// //         );
// //         return;
// //       }

// //       const originalData =
// //         type === "user"
// //           ? users.find((user) => user.id === id)
// //           : roles.find((role) => role.id === id);

// //       const tableType = type === "user" ? "users" : "roles";
// //       const nameField = type === "user" ? "userName" : "roleName";

// //       setDataChanges((prev) => ({
// //         ...prev,
// //         [tableType]: {
// //           ...prev[tableType],
// //           [id]: {
// //             ...prev[tableType][id],
// //             principalId: id,
// //             principalType: type,
// //             [nameField]: originalData?.name || "",
// //             clearanceLevel: numValue,
// //           },
// //         },
// //       }));
// //     },
// //     [users, roles]
// //   );

// //   const handleDoneClick = useCallback(() => {
// //     const getChangedData = (dataType, originalArray) => {
// //       const changedEntries = {};

// //       Object.entries(dataChanges[dataType]).forEach(([id, changeData]) => {
// //         const originalItem = originalArray.find((item) => item.id === id);
// //         if (!originalItem) return;

// //         const hasChanges =
// //           (changeData.permissions &&
// //             JSON.stringify(changeData.permissions) !==
// //               JSON.stringify(originalItem.permissions || [])) ||
// //           (changeData.accessType !== undefined &&
// //             changeData.accessType !== getOriginalAccessType(originalItem)) ||
// //           (typeof changeData.clearanceLevel === "number" &&
// //             changeData.clearanceLevel !==
// //               getOriginalClearanceLevel(originalItem));

// //         if (hasChanges) {
// //           changedEntries[id] = changeData;
// //         }
// //       });

// //       return changedEntries;
// //     };

// //     const changedUsers = getChangedData("users", users || []);
// //     const changedRoles = getChangedData("roles", roles || []);
// //     const allChangedData = { ...changedUsers, ...changedRoles };

// //     const clearanceRules = Object.values(allChangedData)
// //       .filter((item) => typeof item.clearanceLevel === "number")
// //       .map((item) => ({
// //         principalId: item.principalId,
// //         principalType: item.principalType,
// //         [item.principalType === "user" ? "userName" : "roleName"]:
// //           item.userName || item.roleName,
// //         clearanceLevel: item.clearanceLevel,
// //       }));

// //     const aclRules = Object.values(allChangedData)
// //       .filter(
// //         (item) =>
// //           (item.permissions && item.permissions.length > 0) ||
// //           item.accessType !== undefined
// //       )
// //       .map((item) => ({
// //         principalId: item.principalId,
// //         principalType: item.principalType,
// //         [item.principalType === "user" ? "userName" : "roleName"]:
// //           item.userName || item.roleName,
// //         permissions: item.permissions || [],
// //         accessType: item.accessType !== undefined ? item.accessType : 1,
// //       }));

// //     const result = { clearanceRules, aclRules };

// //     console.log(
// //       "Final Result (Only Changed Data):",
// //       JSON.stringify(result, null, 2)
// //     );
// //     console.log("Changed Users:", changedUsers);
// //     console.log("Changed Roles:", changedRoles);

// //     if (onDone) {
// //       onDone(result);
// //     }

// //     return result;
// //   }, [dataChanges, users, roles, onDone]);

// //   const rolesColumns = useMemo(
// //     () => [
// //       {
// //         id: "name",
// //         accessorKey: "name",
// //         header: t("roleName"),
// //         size: 150,
// //         minSize: 120,
// //       },
// //       {
// //         id: "permissions",
// //         accessorKey: "permissions",
// //         header: t("permissions"),
// //         size: 300,
// //         minSize: 250,
// //         cell: ({ row }) => (
// //           <div className="py-2 min-h-[60px] flex items-center">
// //             <div className="w-full">
// //               <Permissions
// //                 key={`role-permissions-${getRowId(row)}`}
// //                 targetId={getRowId(row)}
// //                 targetType="role"
// //                 entityType={entityType}
// //                 onPermissionsChange={handleRolePermissionsChange}
// //                 initialSelectedPermissions={
// //                   dataChanges.roles?.[getRowId(row)]?.permissions ||
// //                   row.original.permissions ||
// //                   []
// //                 }
// //               />
// //             </div>
// //           </div>
// //         ),
// //       },
// //       {
// //         id: "accessType",
// //         accessorKey: "accessType",
// //         header: t("accessType"),
// //         size: 180,
// //         minSize: 150,
// //         cell: ({ row }) => (
// //           <AccessTypeCell
// //             row={row}
// //             type="role"
// //             dataChanges={dataChanges}
// //             handleAccessTypeChange={handleAccessTypeChange}
// //             getRowId={getRowId}
// //             getOriginalAccessType={getOriginalAccessType}
// //             t={t}
// //           />
// //         ),
// //       },
// //       {
// //         id: "clearanceLevel",
// //         accessorKey: "clearanceLevel",
// //         header: t("securityLevel"),
// //         size: 180,
// //         minSize: 150,
// //         cell: ({ row }) => (
// //           <SecurityLevelCell
// //             row={row}
// //             type="role"
// //             dataChanges={dataChanges}
// //             handleSecurityLevelChange={handleSecurityLevelChange}
// //             getRowId={getRowId}
// //             getOriginalClearanceLevel={getOriginalClearanceLevel}
// //             t={t}
// //           />
// //         ),
// //       },
// //     ],
// //     [
// //       handleRolePermissionsChange,
// //       handleAccessTypeChange,
// //       handleSecurityLevelChange,
// //       dataChanges,
// //       entityType,
// //       t,
// //     ]
// //   );

// //   const usersColumns = useMemo(
// //     () => [
// //       {
// //         id: "userName",
// //         accessorKey: "name",
// //         header: t("username"),
// //         size: 150,
// //         minSize: 120,
// //       },
// //       {
// //         id: "permissions",
// //         accessorKey: "permissions",
// //         header: t("permissions"),
// //         size: 300,
// //         minSize: 250,
// //         cell: ({ row }) => (
// //           <div className="py-2 min-h-[60px] flex items-center">
// //             <div className="w-full">
// //               <Permissions
// //                 key={`user-permissions-${getRowId(row)}`}
// //                 targetId={getRowId(row)}
// //                 targetType="user"
// //                 entityType={entityType}
// //                 onPermissionsChange={handleUserPermissionsChange}
// //                 initialSelectedPermissions={
// //                   dataChanges.users?.[getRowId(row)]?.permissions ||
// //                   row.original.permissions ||
// //                   []
// //                 }
// //               />
// //             </div>
// //           </div>
// //         ),
// //       },
// //       {
// //         id: "accessType",
// //         accessorKey: "accessType",
// //         header: t("accessType"),
// //         size: 180,
// //         minSize: 150,
// //         cell: ({ row }) => (
// //           <AccessTypeCell
// //             row={row}
// //             type="user"
// //             dataChanges={dataChanges}
// //             handleAccessTypeChange={handleAccessTypeChange}
// //             getRowId={getRowId}
// //             getOriginalAccessType={getOriginalAccessType}
// //             t={t}
// //           />
// //         ),
// //       },
// //       {
// //         id: "clearanceLevel",
// //         accessorKey: "clearanceLevel",
// //         header: t("securityLevel"),
// //         size: 180,
// //         minSize: 150,
// //         cell: ({ row }) => (
// //           <SecurityLevelCell
// //             row={row}
// //             type="user"
// //             dataChanges={dataChanges}
// //             handleSecurityLevelChange={handleSecurityLevelChange}
// //             getRowId={getRowId}
// //             getOriginalClearanceLevel={getOriginalClearanceLevel}
// //             t={t}
// //           />
// //         ),
// //       },
// //     ],
// //     [
// //       handleUserPermissionsChange,
// //       handleAccessTypeChange,
// //       handleSecurityLevelChange,
// //       dataChanges,
// //       entityType,
// //       t,
// //     ]
// //   );

// //   const currentData = activeTable === "users" ? users || [] : roles || [];
// //   const currentColumns = activeTable === "users" ? usersColumns : rolesColumns;
// //   const currentStatus = principlesStatus;
// //   const currentDoubleClick =
// //     activeTable === "users"
// //       ? handleRowDoubleClickUsers
// //       : handleRowDoubleClickRoles;

// //   return (
// //     <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-w-full overflow-hidden">
// //       {/* Debug Panel */}
// //       <div className="p-3 bg-blue-50 border-b border-blue-200 text-sm">
// //         <div className="grid grid-cols-2 gap-4">
// //           <div>
// //             <strong>{t("status")}:</strong> {principlesStatus} |{" "}
// //             <strong>{t("repoId")}:</strong> {repoId || t("missing")}
// //           </div>
// //           <div>
// //             <strong>{t("raw")}:</strong> {principles?.length || 0} |{" "}
// //             <strong>{t("users")}:</strong> {users?.length || 0} |{" "}
// //             <strong>{t("roles")}:</strong> {roles?.length || 0}
// //           </div>
// //         </div>
// //       </div>

// //       {/* Enhanced Header */}
// //       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
// //         <div className="flex items-center gap-3">
// //           <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
// //             <svg
// //               className="w-4 h-4 text-blue-600"
// //               fill="none"
// //               stroke="currentColor"
// //               viewBox="0 0 24 24"
// //             >
// //               <path
// //                 strokeLinecap="round"
// //                 strokeLinejoin="round"
// //                 strokeWidth={2}
// //                 d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
// //               />
// //             </svg>
// //           </div>
// //           <div>
// //             <h2 className="text-xl font-semibold text-gray-800">
// //               {activeTable === "users"
// //                 ? t("usersManagement")
// //                 : t("rolesManagement")}
// //             </h2>
// //             <p className="text-sm text-gray-600 mt-1">
// //               {activeTable === "users"
// //                 ? t("usersManagementDescription")
// //                 : t("rolesManagementDescription")}
// //             </p>
// //           </div>
// //         </div>

// //         {/* Toggle Button Group */}
// //         <div className="flex items-center gap-4">
// //           <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
// //             <button
// //               onClick={() => setActiveTable("users")}
// //               className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
// //                 activeTable === "users"
// //                   ? "bg-blue-600 text-white shadow-sm"
// //                   : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
// //               }`}
// //             >
// //               <svg
// //                 className="w-4 h-4"
// //                 fill="none"
// //                 stroke="currentColor"
// //                 viewBox="0 0 24 24"
// //               >
// //                 <path
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                   strokeWidth={2}
// //                   d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
// //                 />
// //               </svg>
// //               {t("users")} ({users?.length || 0})
// //             </button>
// //             <button
// //               onClick={() => setActiveTable("roles")}
// //               className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
// //                 activeTable === "roles"
// //                   ? "bg-blue-600 text-white shadow-sm"
// //                   : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
// //               }`}
// //             >
// //               <svg
// //                 className="w-4 h-4"
// //                 fill="none"
// //                 stroke="currentColor"
// //                 viewBox="0 0 24 24"
// //               >
// //                 <path
// //                   strokeLinecap="round"
// //                   strokeLinejoin="round"
// //                   strokeWidth={2}
// //                   d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
// //                 />
// //               </svg>
// //               {t("roles")} ({roles?.length || 0})
// //             </button>
// //           </div>

// //           {/* Done Button */}
// //           <button
// //             onClick={handleDoneClick}
// //             className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm"
// //           >
// //             <svg
// //               className="w-4 h-4"
// //               fill="none"
// //               stroke="currentColor"
// //               viewBox="0 0 24 24"
// //             >
// //               <path
// //                 strokeLinecap="round"
// //                 strokeLinejoin="round"
// //                 strokeWidth={2}
// //                 d="M5 13l4 4L19 7"
// //               />
// //             </svg>
// //             {t("done")}
// //           </button>
// //         </div>
// //       </div>

// //       {/* Table Container */}
// //       <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
// //         <ReUsableTable
// //           columns={currentColumns}
// //           data={currentData}
// //           title={`${activeTable === "users" ? t("users") : t("roles")} ${t(
// //             "list"
// //           )}`}
// //           isLoading={currentStatus === "loading"}
// //           onRowDoubleClick={currentDoubleClick}
// //           showGlobalFilter={true}
// //           pageSizeOptions={[5, 10, 15, 25, 50]}
// //           defaultPageSize={10}
// //           className={`${activeTable}-permissions-table`}
// //           enableSelection={false}
// //           tableClassName="min-w-full"
// //           rowClassName="hover:bg-gray-50 transition-colors duration-150"
// //           headerClassName="bg-gradient-to-r from-gray-50 to-gray-100 text-sm font-semibold text-gray-700 border-b border-gray-200"
// //           cellClassName="text-sm py-3 px-4"
// //         />
// //       </div>
// //     </div>
// //   );
// // }

// // export default UsersRolesPermissionsTable;

// /* eslint-disable react/prop-types */
// import { useCallback, useEffect, useMemo, useState } from "react";
// import ReUsableTable from "../../resusableComponents/table/ReUsableTable";
// import { useDispatch, useSelector } from "react-redux";
// import Permissions from "./Permissions";
// import { useTranslation } from "react-i18next";
// import { useParams } from "react-router-dom";
// import { fetchPrinciples } from "./permissionsThunks";

// // Access Type Cell Component
// const AccessTypeCell = ({
//   row,
//   type,
//   dataChanges,
//   handleAccessTypeChange,
//   getRowId,
//   getOriginalAccessType,
//   t,
// }) => {
//   const tableType = type === "user" ? "users" : "roles";
//   const rowId = getRowId(row);
//   const currentData = dataChanges[tableType]?.[rowId];

//   const isChecked =
//     currentData?.accessType !== undefined
//       ? currentData.accessType === 1
//       : getOriginalAccessType(row.original) === 1;

//   const handleToggle = (checked) => {
//     if (rowId) {
//       const accessTypeValue = checked ? 1 : 0;
//       handleAccessTypeChange(rowId, accessTypeValue, type);
//     }
//   };

//   if (!rowId) {
//     return <div className="text-red-500 text-sm">{t("noIdFound")}</div>;
//   }

//   return (
//     <div className="flex items-center justify-center">
//       <label className="relative inline-flex items-center cursor-pointer">
//         <input
//           type="checkbox"
//           checked={isChecked}
//           onChange={(e) => handleToggle(e.target.checked)}
//           className="sr-only peer"
//         />
//         <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//         <span className="ml-3 text-sm font-medium text-gray-700">
//           {isChecked ? t("allow") : t("deny")}
//         </span>
//       </label>
//     </div>
//   );
// };

// // Security Level Cell Component
// const SecurityLevelCell = ({
//   row,
//   type,
//   dataChanges,
//   handleSecurityLevelChange,
//   getRowId,
//   getOriginalClearanceLevel,
//   t,
// }) => {
//   const tableType = type === "user" ? "users" : "roles";
//   const rowId = getRowId(row);
//   const currentData = dataChanges[tableType]?.[rowId];
//   const initialValue = currentData
//     ? currentData.clearanceLevel
//     : getOriginalClearanceLevel(row.original);

//   const [value, setValue] = useState(initialValue ?? "");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (rowId) {
//       const newValue =
//         dataChanges[tableType]?.[rowId]?.clearanceLevel ??
//         getOriginalClearanceLevel(row.original);
//       setValue(newValue ?? "");
//     }
//   }, [
//     dataChanges[tableType]?.[rowId]?.clearanceLevel,
//     rowId,
//     tableType,
//     row.original.clearanceLevel,
//     dataChanges,
//     getOriginalClearanceLevel,
//   ]);

//   const handleChange = useCallback(
//     (e) => {
//       const inputValue = e.target.value;
//       setValue(inputValue);

//       if (inputValue === "") {
//         setError("");
//         return;
//       }

//       const numValue = parseInt(inputValue, 10);
//       if (isNaN(numValue)) {
//         setError(t("numbersOnly"));
//         return;
//       }
//       if (numValue < 0 || numValue > 99) {
//         setError(t("range0to99"));
//         return;
//       }
//       setError("");
//     },
//     [t]
//   );

//   const handleBlur = useCallback(() => {
//     if (value === "") return;

//     const numValue = parseInt(value, 10);
//     if (isNaN(numValue) || numValue < 0 || numValue > 99) {
//       const defaultValue = getOriginalClearanceLevel(row.original);
//       setValue(defaultValue ?? "");
//       setError("");
//       return;
//     }

//     if (rowId) {
//       handleSecurityLevelChange(rowId, numValue, type);
//     }
//     setError("");
//   }, [
//     value,
//     rowId,
//     type,
//     handleSecurityLevelChange,
//     getOriginalClearanceLevel,
//     row.original,
//   ]);

//   if (!rowId) {
//     return <div className="text-red-500 text-sm">{t("noIdFound")}</div>;
//   }

//   return (
//     <div className="flex flex-col items-center">
//       <input
//         key={`security-level-${rowId}-${tableType}`}
//         type="number"
//         value={value}
//         onChange={handleChange}
//         onBlur={handleBlur}
//         min="0"
//         max="99"
//         className={`w-20 px-2 py-1 text-center border rounded-md focus:outline-none focus:ring-2 transition-colors ${
//           error
//             ? "border-red-300 focus:ring-red-500 focus:border-red-500"
//             : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
//         }`}
//         placeholder={t("range0to99")}
//       />
//       {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
//     </div>
//   );
// };

// function UsersRolesPermissionsTable({
//   onDone,
//   savedData,
//   entityType,
//   isRepository,
//   fetchUsers,
//   fetchRoles,
// }) {
//   const dispatch = useDispatch();
//   const [activeTable, setActiveTable] = useState("users");
//   const { t } = useTranslation();
//   const { repoId } = useParams();

//   const [dataChanges, setDataChanges] = useState(() => {
//     if (
//       savedData &&
//       (savedData.clearanceRules?.length > 0 || savedData.aclRules?.length > 0)
//     ) {
//       const initialState = { users: {}, roles: {} };

//       savedData.clearanceRules?.forEach((rule) => {
//         const tableType = rule.principalType === "user" ? "users" : "roles";
//         initialState[tableType][rule.principalId] = {
//           ...initialState[tableType][rule.principalId],
//           principalId: rule.principalId,
//           principalType: rule.principalType,
//           [rule.principalType === "user" ? "userName" : "roleName"]:
//             rule.userName || rule.roleName || "",
//           clearanceLevel: rule.clearanceLevel,
//         };
//       });

//       savedData.aclRules?.forEach((rule) => {
//         const tableType = rule.principalType === "user" ? "users" : "roles";
//         initialState[tableType][rule.principalId] = {
//           ...initialState[tableType][rule.principalId],
//           principalId: rule.principalId,
//           principalType: rule.principalType,
//           [rule.principalType === "user" ? "userName" : "roleName"]:
//             rule.userName || rule.roleName || "",
//           permissions: rule.permissions || [],
//           accessType:
//             rule.accessType === "Deny" ||
//             rule.accessType === "deny" ||
//             rule.accessType === 0
//               ? 0
//               : 1,
//         };
//       });

//       return initialState;
//     }
//     return { users: {}, roles: {} };
//   });

//   // Redux selectors
//   const principlesState = useSelector((state) => state.permissionsReducer);

//   // Add selectors for users and roles data - adjust these paths based on your Redux store structure
//   const usersState = useSelector((state) => state.usersReducer || state.users);
//   const rolesState = useSelector((state) => state.rolesReducer || state.roles);

//   // Extract data from different sources
//   const principles =
//     principlesState?.principles ||
//     principlesState?.data ||
//     principlesState?.response ||
//     [];
//   const principlesStatus = principlesState?.status || "idle";

//   // Extract users and roles data from their respective states
//   const usersData = usersState?.users || usersState?.data || usersState?.response || [];
//   const rolesData = rolesState?.roles || rolesState?.data || rolesState?.response || [];

//   const users = useMemo(() => {
//     if (isRepository) {
//       // Use the users data from fetchUsers() when it's a repository
//       return Array.isArray(usersData) ? usersData : [];
//     } else {
//       // Use filtered principles data for other cases
//       const filteredUsers = principles.filter((principle) => {
//         const isUser = principle?.type === "User";
//         return isUser;
//       });
//       return filteredUsers;
//     }
//   }, [isRepository, usersData, principles]);

//   const roles = useMemo(() => {
//     if (isRepository) {
//       // Use the roles data from fetchRoles() when it's a repository
//       return Array.isArray(rolesData) ? rolesData : [];
//     } else {
//       // Use filtered principles data for other cases
//       if (!Array.isArray(principles)) {
//         console.log(
//           "❌ Principles is not an array:",
//           typeof principles,
//           principles
//         );
//         return [];
//       }
//       const filteredRoles = principles.filter((principle) => {
//         const isRole = principle?.type === "Role";
//         return isRole;
//       });
//       return filteredRoles;
//     }
//   }, [isRepository, rolesData, principles]);

//   useEffect(() => {
//     if (isRepository) {
//       console.log("Is Repo - Fetching users and roles");
//       dispatch(fetchUsers());
//       dispatch(fetchRoles());
//     } else {
//       console.log("Is Not Repo - Fetching principles");
//       dispatch(fetchPrinciples(repoId));
//     }
//   }, [isRepository, fetchUsers, fetchRoles, repoId, dispatch]);

//   // Debug current data
//   useEffect(() => {
//     console.log("Data Debug:", {
//       isRepository,
//       usersData,
//       rolesData,
//       principles,
//       finalUsers: users,
//       finalRoles: roles
//     });
//   }, [isRepository, usersData, rolesData, principles, users, roles]);

//   const getRowId = (row) => row.original.id || row.original._id;

//   const getOriginalAccessType = (item) => {
//     return item.accessType === false ||
//       item.accessType === "disabled" ||
//       item.accessType === "Deny" ||
//       item.accessType === "deny" ||
//       item.accessType === 0
//       ? 0
//       : 1;
//   };

//   const getOriginalClearanceLevel = (item) => {
//     return typeof item.clearanceLevel === "number" ? item.clearanceLevel : null;
//   };

//   const handleRowDoubleClickRoles = useCallback((row) => {
//     const roleId = getRowId(row);
//     console.log(
//       "Role selected! Role ID:",
//       roleId,
//       "Full row data:",
//       row.original
//     );
//   }, []);

//   const handleRowDoubleClickUsers = useCallback((row) => {
//     const userId = getRowId(row);
//     console.log(
//       "User selected! User ID:",
//       userId,
//       "Full row data:",
//       row.original
//     );
//   }, []);

//   const handleUserPermissionsChange = useCallback(
//     (userId, selectedPermissions) => {
//       console.log(
//         "User ID:",
//         userId,
//         "Selected Permissions:",
//         selectedPermissions
//       );

//       if (!userId) {
//         console.error(
//           "Invalid user ID provided to handleUserPermissionsChange"
//         );
//         return;
//       }

//       const originalUser = users.find((user) => user.id === userId);

//       setDataChanges((prev) => ({
//         ...prev,
//         users: {
//           ...prev.users,
//           [userId]: {
//             ...prev.users[userId],
//             principalId: userId,
//             principalType: "user",
//             userName: originalUser?.name || "",
//             permissions: Array.isArray(selectedPermissions)
//               ? [...selectedPermissions]
//               : [],
//           },
//         },
//       }));
//     },
//     [users]
//   );

//   const handleRolePermissionsChange = useCallback(
//     (roleId, selectedPermissions) => {
//       console.log(
//         "Role ID:",
//         roleId,
//         "Selected Permissions:",
//         selectedPermissions
//       );

//       if (!roleId) {
//         console.error(
//           "Invalid role ID provided to handleRolePermissionsChange"
//         );
//         return;
//       }

//       const originalRole = roles.find((role) => role.id === roleId);

//       setDataChanges((prev) => ({
//         ...prev,
//         roles: {
//           ...prev.roles,
//           [roleId]: {
//             ...prev.roles[roleId],
//             principalId: roleId,
//             principalType: "role",
//             roleName: originalRole?.name || "",
//             permissions: Array.isArray(selectedPermissions)
//               ? [...selectedPermissions]
//               : [],
//           },
//         },
//       }));
//     },
//     [roles]
//   );

//   const handleAccessTypeChange = useCallback(
//     (id, accessTypeValue, type) => {
//       console.log(
//         `${type} ID:`,
//         id,
//         "Access Type:",
//         accessTypeValue === 1 ? "Allow" : "Deny",
//         "Value:",
//         accessTypeValue
//       );

//       if (!id) {
//         console.error(
//           `Invalid ${type} ID provided to handleAccessTypeChange:`,
//           id
//         );
//         return;
//       }

//       const originalData =
//         type === "user"
//           ? users.find((user) => user.id === id)
//           : roles.find((role) => role.id === id);

//       const tableType = type === "user" ? "users" : "roles";
//       const nameField = type === "user" ? "userName" : "roleName";

//       setDataChanges((prev) => ({
//         ...prev,
//         [tableType]: {
//           ...prev[tableType],
//           [id]: {
//             ...prev[tableType][id],
//             principalId: id,
//             principalType: type,
//             [nameField]: originalData?.name || "",
//             accessType: accessTypeValue,
//           },
//         },
//       }));
//     },
//     [users, roles]
//   );

//   const handleSecurityLevelChange = useCallback(
//     (id, value, type) => {
//       const numValue = parseInt(value, 10);
//       if (isNaN(numValue) || numValue < 0 || numValue > 99) {
//         console.log("Invalid security level. Must be between 0-99");
//         return;
//       }
//       console.log(`${type} ID:`, id, "Security Level:", numValue);

//       if (!id) {
//         console.error(
//           `Invalid ${type} ID provided to handleSecurityLevelChange:`,
//           id
//         );
//         return;
//       }

//       const originalData =
//         type === "user"
//           ? users.find((user) => user.id === id)
//           : roles.find((role) => role.id === id);

//       const tableType = type === "user" ? "users" : "roles";
//       const nameField = type === "user" ? "userName" : "roleName";

//       setDataChanges((prev) => ({
//         ...prev,
//         [tableType]: {
//           ...prev[tableType],
//           [id]: {
//             ...prev[tableType][id],
//             principalId: id,
//             principalType: type,
//             [nameField]: originalData?.name || "",
//             clearanceLevel: numValue,
//           },
//         },
//       }));
//     },
//     [users, roles]
//   );

//   const handleDoneClick = useCallback(() => {
//     const getChangedData = (dataType, originalArray) => {
//       const changedEntries = {};

//       Object.entries(dataChanges[dataType]).forEach(([id, changeData]) => {
//         const originalItem = originalArray.find((item) => item.id === id);
//         if (!originalItem) return;

//         const hasChanges =
//           (changeData.permissions &&
//             JSON.stringify(changeData.permissions) !==
//               JSON.stringify(originalItem.permissions || [])) ||
//           (changeData.accessType !== undefined &&
//             changeData.accessType !== getOriginalAccessType(originalItem)) ||
//           (typeof changeData.clearanceLevel === "number" &&
//             changeData.clearanceLevel !==
//               getOriginalClearanceLevel(originalItem));

//         if (hasChanges) {
//           changedEntries[id] = changeData;
//         }
//       });

//       return changedEntries;
//     };

//     const changedUsers = getChangedData("users", users || []);
//     const changedRoles = getChangedData("roles", roles || []);
//     const allChangedData = { ...changedUsers, ...changedRoles };

//     const clearanceRules = Object.values(allChangedData)
//       .filter((item) => typeof item.clearanceLevel === "number")
//       .map((item) => ({
//         principalId: item.principalId,
//         principalType: item.principalType,
//         [item.principalType === "user" ? "userName" : "roleName"]:
//           item.userName || item.roleName,
//         clearanceLevel: item.clearanceLevel,
//       }));

//     const aclRules = Object.values(allChangedData)
//       .filter(
//         (item) =>
//           (item.permissions && item.permissions.length > 0) ||
//           item.accessType !== undefined
//       )
//       .map((item) => ({
//         principalId: item.principalId,
//         principalType: item.principalType,
//         [item.principalType === "user" ? "userName" : "roleName"]:
//           item.userName || item.roleName,
//         permissions: item.permissions || [],
//         accessType: item.accessType !== undefined ? item.accessType : 1,
//       }));

//     const result = { clearanceRules, aclRules };

//     console.log(
//       "Final Result (Only Changed Data):",
//       JSON.stringify(result, null, 2)
//     );
//     console.log("Changed Users:", changedUsers);
//     console.log("Changed Roles:", changedRoles);

//     if (onDone) {
//       onDone(result);
//     }

//     return result;
//   }, [dataChanges, users, roles, onDone]);

//   const rolesColumns = useMemo(
//     () => [
//       {
//         id: "name",
//         accessorKey: "name",
//         header: t("roleName"),
//         size: 150,
//         minSize: 120,
//       },
//       {
//         id: "permissions",
//         accessorKey: "permissions",
//         header: t("permissions"),
//         size: 300,
//         minSize: 250,
//         cell: ({ row }) => (
//           <div className="py-2 min-h-[60px] flex items-center">
//             <div className="w-full">
//               <Permissions
//                 key={`role-permissions-${getRowId(row)}`}
//                 targetId={getRowId(row)}
//                 targetType="role"
//                 entityType={entityType}
//                 onPermissionsChange={handleRolePermissionsChange}
//                 initialSelectedPermissions={
//                   dataChanges.roles?.[getRowId(row)]?.permissions ||
//                   row.original.permissions ||
//                   []
//                 }
//               />
//             </div>
//           </div>
//         ),
//       },
//       {
//         id: "accessType",
//         accessorKey: "accessType",
//         header: t("accessType"),
//         size: 180,
//         minSize: 150,
//         cell: ({ row }) => (
//           <AccessTypeCell
//             row={row}
//             type="role"
//             dataChanges={dataChanges}
//             handleAccessTypeChange={handleAccessTypeChange}
//             getRowId={getRowId}
//             getOriginalAccessType={getOriginalAccessType}
//             t={t}
//           />
//         ),
//       },
//       {
//         id: "clearanceLevel",
//         accessorKey: "clearanceLevel",
//         header: t("securityLevel"),
//         size: 180,
//         minSize: 150,
//         cell: ({ row }) => (
//           <SecurityLevelCell
//             row={row}
//             type="role"
//             dataChanges={dataChanges}
//             handleSecurityLevelChange={handleSecurityLevelChange}
//             getRowId={getRowId}
//             getOriginalClearanceLevel={getOriginalClearanceLevel}
//             t={t}
//           />
//         ),
//       },
//     ],
//     [
//       handleRolePermissionsChange,
//       handleAccessTypeChange,
//       handleSecurityLevelChange,
//       dataChanges,
//       entityType,
//       t,
//     ]
//   );

//   const usersColumns = useMemo(
//     () => [
//       {
//         id: "userName",
//         accessorKey: "name",
//         header: t("username"),
//         size: 150,
//         minSize: 120,
//       },
//       {
//         id: "permissions",
//         accessorKey: "permissions",
//         header: t("permissions"),
//         size: 300,
//         minSize: 250,
//         cell: ({ row }) => (
//           <div className="py-2 min-h-[60px] flex items-center">
//             <div className="w-full">
//               <Permissions
//                 key={`user-permissions-${getRowId(row)}`}
//                 targetId={getRowId(row)}
//                 targetType="user"
//                 entityType={entityType}
//                 onPermissionsChange={handleUserPermissionsChange}
//                 initialSelectedPermissions={
//                   dataChanges.users?.[getRowId(row)]?.permissions ||
//                   row.original.permissions ||
//                   []
//                 }
//               />
//             </div>
//           </div>
//         ),
//       },
//       {
//         id: "accessType",
//         accessorKey: "accessType",
//         header: t("accessType"),
//         size: 180,
//         minSize: 150,
//         cell: ({ row }) => (
//           <AccessTypeCell
//             row={row}
//             type="user"
//             dataChanges={dataChanges}
//             handleAccessTypeChange={handleAccessTypeChange}
//             getRowId={getRowId}
//             getOriginalAccessType={getOriginalAccessType}
//             t={t}
//           />
//         ),
//       },
//       {
//         id: "clearanceLevel",
//         accessorKey: "clearanceLevel",
//         header: t("securityLevel"),
//         size: 180,
//         minSize: 150,
//         cell: ({ row }) => (
//           <SecurityLevelCell
//             row={row}
//             type="user"
//             dataChanges={dataChanges}
//             handleSecurityLevelChange={handleSecurityLevelChange}
//             getRowId={getRowId}
//             getOriginalClearanceLevel={getOriginalClearanceLevel}
//             t={t}
//           />
//         ),
//       },
//     ],
//     [
//       handleUserPermissionsChange,
//       handleAccessTypeChange,
//       handleSecurityLevelChange,
//       dataChanges,
//       entityType,
//       t,
//     ]
//   );

//   const currentData = activeTable === "users" ? users || [] : roles || [];
//   const currentColumns = activeTable === "users" ? usersColumns : rolesColumns;
//   const currentStatus = principlesStatus;
//   const currentDoubleClick =
//     activeTable === "users"
//       ? handleRowDoubleClickUsers
//       : handleRowDoubleClickRoles;

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-w-full overflow-hidden">
//       {/* Debug Panel */}
//       <div className="p-3 bg-blue-50 border-b border-blue-200 text-sm">
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <strong>{t("status")}:</strong> {principlesStatus} |{" "}
//             <strong>{t("repoId")}:</strong> {repoId || t("missing")} |{" "}
//             <strong>IsRepo:</strong> {isRepository ? "Yes" : "No"}
//           </div>
//           <div>
//             <strong>{t("raw")}:</strong> {principles?.length || 0} |{" "}
//             <strong>{t("users")}:</strong> {users?.length || 0} |{" "}
//             <strong>{t("roles")}:</strong> {roles?.length || 0}
//           </div>
//         </div>
//       </div>

//       {/* Enhanced Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
//         <div className="flex items-center gap-3">
//           <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//             <svg
//               className="w-4 h-4 text-blue-600"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
//               />
//             </svg>
//           </div>
//           <div>
//             <h2 className="text-xl font-semibold text-gray-800">
//               {activeTable === "users"
//                 ? t("usersManagement")
//                 : t("rolesManagement")}
//             </h2>
//             <p className="text-sm text-gray-600 mt-1">
//               {activeTable === "users"
//                 ? t("usersManagementDescription")
//                 : t("rolesManagementDescription")}
//             </p>
//           </div>
//         </div>

//         {/* Toggle Button Group */}
//         <div className="flex items-center gap-4">
//           <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
//             <button
//               onClick={() => setActiveTable("users")}
//               className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
//                 activeTable === "users"
//                   ? "bg-blue-600 text-white shadow-sm"
//                   : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
//               }`}
//             >
//               <svg
//                 className="w-4 h-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                 />
//               </svg>
//               {t("users")} ({users?.length || 0})
//             </button>
//             <button
//               onClick={() => setActiveTable("roles")}
//               className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
//                 activeTable === "roles"
//                   ? "bg-blue-600 text-white shadow-sm"
//                   : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
//               }`}
//             >
//               <svg
//                 className="w-4 h-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
//                 />
//               </svg>
//               {t("roles")} ({roles?.length || 0})
//             </button>
//           </div>

//           {/* Done Button */}
//           <button
//             onClick={handleDoneClick}
//             className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm"
//           >
//             <svg
//               className="w-4 h-4"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M5 13l4 4L19 7"
//               />
//             </svg>
//             {t("done")}
//           </button>
//         </div>
//       </div>

//       {/* Table Container */}
//       <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
//         <ReUsableTable
//           columns={currentColumns}
//           data={currentData}
//           title={`${activeTable === "users" ? t("users") : t("roles")} ${t(
//             "list"
//           )}`}
//           isLoading={currentStatus === "loading"}
//           onRowDoubleClick={currentDoubleClick}
//           showGlobalFilter={true}
//           pageSizeOptions={[5, 10, 15, 25, 50]}
//           defaultPageSize={10}
//           className={`${activeTable}-permissions-table`}
//           enableSelection={false}
//           tableClassName="min-w-full"
//           rowClassName="hover:bg-gray-50 transition-colors duration-150"
//           headerClassName="bg-gradient-to-r from-gray-50 to-gray-100 text-sm font-semibold text-gray-700 border-b border-gray-200"
//           cellClassName="text-sm py-3 px-4"
//         />
//       </div>
//     </div>
//   );
// }

// export default UsersRolesPermissionsTable;

// /* eslint-disable react/prop-types */
// import { useCallback, useEffect, useMemo, useState } from "react";
// import ReUsableTable from "../../resusableComponents/table/ReUsableTable";
// import { useDispatch, useSelector } from "react-redux";
// import Permissions from "./Permissions";
// import { useTranslation } from "react-i18next";
// import { useParams } from "react-router-dom";
// import { fetchPrinciples } from "./permissionsThunks";

// /**
//  * AccessTypeCell Component - Renders toggle switch for Allow/Deny permissions
//  * Handles both repository and principles data structures
//  */
// const AccessTypeCell = ({
//   row,
//   type,
//   dataChanges,
//   handleAccessTypeChange,
//   getRowId,
//   getOriginalAccessType,
//   t,
// }) => {
//   const tableType = type === "user" ? "users" : "roles";
//   const rowId = getRowId(row);
//   const currentData = dataChanges[tableType]?.[rowId];

//   const isChecked =
//     currentData?.accessType !== undefined
//       ? currentData.accessType === 1
//       : getOriginalAccessType(row.original) === 1;

//   const handleToggle = (checked) => {
//     if (rowId) {
//       const accessTypeValue = checked ? 1 : 0;
//       handleAccessTypeChange(rowId, accessTypeValue, type);
//     }
//   };

//   // Show a more user-friendly error message
//   if (!rowId) {
//     return (
//       <div className="text-red-500 text-sm">
//         {t("invalidData") || "Invalid data"}
//       </div>
//     );
//   }

//   return (
//     <div className="flex items-center justify-center">
//       <label className="relative inline-flex items-center cursor-pointer">
//         <input
//           type="checkbox"
//           checked={isChecked}
//           onChange={(e) => handleToggle(e.target.checked)}
//           className="sr-only peer"
//         />
//         <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//         <span className="ml-3 text-sm font-medium text-gray-700">
//           {isChecked ? t("allow") : t("deny")}
//         </span>
//       </label>
//     </div>
//   );
// };

// /**
//  * SecurityLevelCell Component - Renders numeric input for security clearance levels (0-99)
//  * Includes validation and error handling for different data structures
//  */
// const SecurityLevelCell = ({
//   row,
//   type,
//   dataChanges,
//   handleSecurityLevelChange,
//   getRowId,
//   getOriginalClearanceLevel,
//   t,
// }) => {
//   const tableType = type === "user" ? "users" : "roles";
//   const rowId = getRowId(row);
//   const currentData = dataChanges[tableType]?.[rowId];
//   const initialValue = currentData
//     ? currentData.clearanceLevel
//     : getOriginalClearanceLevel(row.original);

//   const [value, setValue] = useState(initialValue ?? "");
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (rowId) {
//       const newValue =
//         dataChanges[tableType]?.[rowId]?.clearanceLevel ??
//         getOriginalClearanceLevel(row.original);
//       setValue(newValue ?? "");
//     }
//   }, [
//     dataChanges[tableType]?.[rowId]?.clearanceLevel,
//     rowId,
//     tableType,
//     row.original.clearanceLevel,
//     dataChanges,
//     getOriginalClearanceLevel,
//   ]);

//   /**
//    * Handle input value changes with real-time validation
//    */
//   const handleChange = useCallback(
//     (e) => {
//       const inputValue = e.target.value;
//       setValue(inputValue);

//       if (inputValue === "") {
//         setError("");
//         return;
//       }

//       const numValue = parseInt(inputValue, 10);
//       if (isNaN(numValue)) {
//         setError(t("numbersOnly"));
//         return;
//       }
//       if (numValue < 0 || numValue > 99) {
//         setError(t("range0to99"));
//         return;
//       }
//       setError("");
//     },
//     [t]
//   );

//   /**
//    * Handle input blur event - validates and saves the final value
//    */
//   const handleBlur = useCallback(() => {
//     if (value === "") return;

//     const numValue = parseInt(value, 10);
//     if (isNaN(numValue) || numValue < 0 || numValue > 99) {
//       const defaultValue = getOriginalClearanceLevel(row.original);
//       setValue(defaultValue ?? "");
//       setError("");
//       return;
//     }

//     if (rowId) {
//       handleSecurityLevelChange(rowId, numValue, type);
//     }
//     setError("");
//   }, [
//     value,
//     rowId,
//     type,
//     handleSecurityLevelChange,
//     getOriginalClearanceLevel,
//     row.original,
//   ]);

//   // Show a more user-friendly error message
//   if (!rowId) {
//     return (
//       <div className="text-red-500 text-sm">
//         {t("invalidData") || "Invalid data"}
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col items-center">
//       <input
//         key={`security-level-${rowId}-${tableType}`}
//         type="number"
//         value={value}
//         onChange={handleChange}
//         onBlur={handleBlur}
//         min="0"
//         max="99"
//         className={`w-20 px-2 py-1 text-center border rounded-md focus:outline-none focus:ring-2 transition-colors ${
//           error
//             ? "border-red-300 focus:ring-red-500 focus:border-red-500"
//             : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
//         }`}
//         placeholder={t("range0to99")}
//       />
//       {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
//     </div>
//   );
// };

// function UsersRolesPermissionsTable({
//   onDone,
//   savedData,
//   entityType,
//   isRepository,
//   fetchUsers,
//   fetchRoles,
// }) {
//   const dispatch = useDispatch();
//   const [activeTable, setActiveTable] = useState("users");
//   const { t } = useTranslation();
//   const { repoId } = useParams();

//   const [dataChanges, setDataChanges] = useState(() => {
//     // Initialize with empty state
//     const initialState = { users: {}, roles: {} };

//     // If we have savedData, populate the initial state
//     if (
//       savedData &&
//       (savedData.clearanceRules?.length > 0 || savedData.aclRules?.length > 0)
//     ) {
//       // Process clearance rules
//       savedData.clearanceRules?.forEach((rule) => {
//         const tableType = rule.principalType === "user" ? "users" : "roles";
//         initialState[tableType][rule.principalId] = {
//           ...initialState[tableType][rule.principalId],
//           principalId: rule.principalId,
//           principalType: rule.principalType,
//           [rule.principalType === "user" ? "userName" : "roleName"]:
//             rule.userName || rule.roleName || "",
//           clearanceLevel: rule.clearanceLevel,
//         };
//       });

//       // Process ACL rules
//       savedData.aclRules?.forEach((rule) => {
//         const tableType = rule.principalType === "user" ? "users" : "roles";
//         initialState[tableType][rule.principalId] = {
//           ...initialState[tableType][rule.principalId],
//           principalId: rule.principalId,
//           principalType: rule.principalType,
//           [rule.principalType === "user" ? "userName" : "roleName"]:
//             rule.userName || rule.roleName || "",
//           permissions: rule.permissions || [],
//           accessType:
//             rule.accessType === "Deny" ||
//             rule.accessType === "deny" ||
//             rule.accessType === 0
//               ? 0
//               : 1,
//         };
//       });
//     }

//     return initialState;
//   });

//   // Redux selectors
//   const principlesState = useSelector((state) => state.permissionsReducer);

//   // Add selectors for users and roles data - adjust these paths based on your Redux store structure
//   const usersState = useSelector((state) => state.usersReducer || state.users);
//   const rolesState = useSelector((state) => state.rolesReducer || state.roles);

//   // Extract data from different sources
//   const principles =
//     principlesState?.principles ||
//     principlesState?.data ||
//     principlesState?.response ||
//     [];
//   const principlesStatus = principlesState?.status || "idle";

//   // Extract users and roles data from their respective states
//   const usersData =
//     usersState?.users || usersState?.data || usersState?.response || [];
//   const rolesData =
//     rolesState?.roles || rolesState?.data || rolesState?.response || [];

//   const users = useMemo(() => {
//     if (isRepository) {
//       // Use the users data from fetchUsers() when it's a repository
//       return Array.isArray(usersData) ? usersData : [];
//     } else {
//       // Use filtered principles data for other cases
//       const filteredUsers = principles.filter((principle) => {
//         const isUser = principle?.type === "User";
//         return isUser;
//       });
//       return filteredUsers;
//     }
//   }, [isRepository, usersData, principles]);

//   const roles = useMemo(() => {
//     if (isRepository) {
//       // Use the roles data from fetchRoles() when it's a repository
//       return Array.isArray(rolesData) ? rolesData : [];
//     } else {
//       // Use filtered principles data for other cases
//       if (!Array.isArray(principles)) {
//         console.log(
//           "❌ Principles is not an array:",
//           typeof principles,
//           principles
//         );
//         return [];
//       }
//       const filteredRoles = principles.filter((principle) => {
//         const isRole = principle?.type === "Role";
//         return isRole;
//       });
//       return filteredRoles;
//     }
//   }, [isRepository, rolesData, principles]);

//   useEffect(() => {
//     if (isRepository) {
//       console.log("Is Repo - Fetching users and roles");
//       dispatch(fetchUsers());
//       dispatch(fetchRoles());
//     } else {
//       console.log("Is Not Repo - Fetching principles");
//       dispatch(fetchPrinciples(repoId));
//     }
//   }, [isRepository, fetchUsers, fetchRoles, repoId, dispatch]);

//   // Debug current data - logs the data sources and final processed data
//   useEffect(() => {
//     console.log("=== DATA DEBUG ===");
//     console.log("isRepository:", isRepository);
//     console.log("savedData:", savedData);
//     console.log("usersData from Redux:", usersData);
//     console.log("rolesData from Redux:", rolesData);
//     console.log("principles from Redux:", principles);
//     console.log("Final processed users:", users);
//     console.log("Final processed roles:", roles);
//     console.log("Current dataChanges:", dataChanges);
//     console.log("=== END DEBUG ===");
//   }, [
//     isRepository,
//     savedData,
//     usersData,
//     rolesData,
//     principles,
//     users,
//     roles,
//     dataChanges,
//   ]);

//   /**
//    * Get the unique identifier from a table row
//    * Handles different data structures for repository vs principles data
//    */
//   const getRowId = (row) => {
//     // For repository data: userId/roleId, for principles data: id/_id
//     return (
//       row.original.userId ||
//       row.original.roleId ||
//       row.original.id ||
//       row.original._id
//     );
//   };

//   /**
//    * Get the original access type from item data
//    * Handles different field names and formats across data sources
//    */
//   const getOriginalAccessType = (item) => {
//     return item.accessType === false ||
//       item.accessType === "disabled" ||
//       item.accessType === "Deny" ||
//       item.accessType === "deny" ||
//       item.accessType === 0
//       ? 0
//       : 1;
//   };

//   /**
//    * Get the original clearance level from item data
//    * Returns the clearance level if it's a valid number (checks both clearanceLevel and securityLevel fields)
//    */
//   const getOriginalClearanceLevel = (item) => {
//     return typeof item.clearanceLevel === "number"
//       ? item.clearanceLevel
//       : typeof item.securityLevel === "number"
//       ? item.securityLevel
//       : null;
//   };

//   const handleRowDoubleClickRoles = useCallback((row) => {
//     const roleId = getRowId(row);
//     console.log(
//       "Role selected! Role ID:",
//       roleId,
//       "Full row data:",
//       row.original
//     );
//   }, []);

//   const handleRowDoubleClickUsers = useCallback((row) => {
//     const userId = getRowId(row);
//     console.log(
//       "User selected! User ID:",
//       userId,
//       "Full row data:",
//       row.original
//     );
//   }, []);

//   /**
//    * Handle changes to user permissions
//    * Updates the dataChanges state with new permission selections
//    */
//   const handleUserPermissionsChange = useCallback(
//     (userId, selectedPermissions) => {
//       console.log(
//         "User ID:",
//         userId,
//         "Selected Permissions:",
//         selectedPermissions
//       );

//       if (!userId) {
//         console.error(
//           "Invalid user ID provided to handleUserPermissionsChange"
//         );
//         return;
//       }

//       const originalUser = users.find(
//         (user) => user.userId === userId || user.id === userId
//       );

//       setDataChanges((prev) => ({
//         ...prev,
//         users: {
//           ...prev.users,
//           [userId]: {
//             ...prev.users[userId],
//             principalId: userId,
//             principalType: "user",
//             userName:
//               originalUser?.name ||
//               originalUser?.firstName + " " + (originalUser?.lastName || "") ||
//               originalUser?.username ||
//               "Unknown User",
//             permissions: Array.isArray(selectedPermissions)
//               ? [...selectedPermissions]
//               : [],
//           },
//         },
//       }));
//     },
//     [users]
//   );

//   /**
//    * Handle changes to role permissions
//    * Updates the dataChanges state with new permission selections
//    */
//   const handleRolePermissionsChange = useCallback(
//     (roleId, selectedPermissions) => {
//       console.log(
//         "Role ID:",
//         roleId,
//         "Selected Permissions:",
//         selectedPermissions
//       );

//       if (!roleId) {
//         console.error(
//           "Invalid role ID provided to handleRolePermissionsChange"
//         );
//         return;
//       }

//       const originalRole = roles.find(
//         (role) => role.roleId === roleId || role.id === roleId
//       );

//       setDataChanges((prev) => ({
//         ...prev,
//         roles: {
//           ...prev.roles,
//           [roleId]: {
//             ...prev.roles[roleId],
//             principalId: roleId,
//             principalType: "role",
//             roleName:
//               originalRole?.name || originalRole?.roleName || "Unknown Role",
//             permissions: Array.isArray(selectedPermissions)
//               ? [...selectedPermissions]
//               : [],
//           },
//         },
//       }));
//     },
//     [roles]
//   );

//   /**
//    * Handle changes to access type (Allow/Deny)
//    * Updates the dataChanges state with new access type selections
//    */
//   const handleAccessTypeChange = useCallback(
//     (id, accessTypeValue, type) => {
//       console.log(
//         `${type} ID:`,
//         id,
//         "Access Type:",
//         accessTypeValue === 1 ? "Allow" : "Deny",
//         "Value:",
//         accessTypeValue
//       );

//       if (!id) {
//         console.error(
//           `Invalid ${type} ID provided to handleAccessTypeChange:`,
//           id
//         );
//         return;
//       }

//       const originalData =
//         type === "user"
//           ? users.find((user) => user.userId === id || user.id === id)
//           : roles.find((role) => role.roleId === id || role.id === id);

//       const tableType = type === "user" ? "users" : "roles";
//       const nameField = type === "user" ? "userName" : "roleName";
//       const displayName =
//         type === "user"
//           ? originalData?.name ||
//             originalData?.firstName + " " + (originalData?.lastName || "") ||
//             originalData?.username ||
//             "Unknown User"
//           : originalData?.name || originalData?.roleName || "Unknown Role";

//       setDataChanges((prev) => ({
//         ...prev,
//         [tableType]: {
//           ...prev[tableType],
//           [id]: {
//             ...prev[tableType][id],
//             principalId: id,
//             principalType: type,
//             [nameField]: displayName,
//             accessType: accessTypeValue,
//           },
//         },
//       }));
//     },
//     [users, roles]
//   );

//   /**
//    * Handle changes to security/clearance levels (0-99)
//    * Updates the dataChanges state with new clearance level values
//    */
//   const handleSecurityLevelChange = useCallback(
//     (id, value, type) => {
//       const numValue = parseInt(value, 10);
//       if (isNaN(numValue) || numValue < 0 || numValue > 99) {
//         console.log("Invalid security level. Must be between 0-99");
//         return;
//       }
//       console.log(`${type} ID:`, id, "Security Level:", numValue);

//       if (!id) {
//         console.error(
//           `Invalid ${type} ID provided to handleSecurityLevelChange:`,
//           id
//         );
//         return;
//       }

//       const originalData =
//         type === "user"
//           ? users.find((user) => user.userId === id || user.id === id)
//           : roles.find((role) => role.roleId === id || role.id === id);

//       const tableType = type === "user" ? "users" : "roles";
//       const nameField = type === "user" ? "userName" : "roleName";
//       const displayName =
//         type === "user"
//           ? originalData?.name ||
//             originalData?.firstName + " " + (originalData?.lastName || "") ||
//             originalData?.username ||
//             "Unknown User"
//           : originalData?.name || originalData?.roleName || "Unknown Role";

//       setDataChanges((prev) => ({
//         ...prev,
//         [tableType]: {
//           ...prev[tableType],
//           [id]: {
//             ...prev[tableType][id],
//             principalId: id,
//             principalType: type,
//             [nameField]: displayName,
//             clearanceLevel: numValue,
//           },
//         },
//       }));
//     },
//     [users, roles]
//   );

//   /**
//    * Handle the Done button click - processes all changes and returns the final result
//    * Sends both changed data and current non-empty values to backend
//    */
//   const handleDoneClick = useCallback(() => {
//     const getAllData = (dataType, originalArray) => {
//       const allEntries = {};

//       // First, add all items that have changes in dataChanges
//       Object.entries(dataChanges[dataType]).forEach(([id, changeData]) => {
//         allEntries[id] = changeData;
//       });

//       // Then, add any items from original data that have permissions, accessType, or clearanceLevel
//       originalArray.forEach((item) => {
//         const itemId = item.userId || item.roleId || item.id || item._id;
//         if (!itemId) return;

//         const existingChange = allEntries[itemId];
//         const hasPermissions = item.permissions && item.permissions.length > 0;
//         const hasAccessType = item.accessType !== undefined;
//         const hasClearanceLevel = typeof item.clearanceLevel === "number";
//         const hasSecurityLevel = typeof item.securityLevel === "number"; // Check for securityLevel too

//         // If item has meaningful data and not already in changes, add it
//         if (
//           (hasPermissions ||
//             hasAccessType ||
//             hasClearanceLevel ||
//             hasSecurityLevel) &&
//           !existingChange
//         ) {
//           const displayName =
//             dataType === "users"
//               ? item.name ||
//                 item.firstName + " " + (item.lastName || "") ||
//                 item.username ||
//                 "Unknown User"
//               : item.name || item.roleName || "Unknown Role";

//           allEntries[itemId] = {
//             principalId: itemId,
//             principalType: dataType === "users" ? "user" : "role",
//             [dataType === "users" ? "userName" : "roleName"]: displayName,
//             permissions: item.permissions || [],
//             accessType: hasAccessType
//               ? item.accessType === false ||
//                 item.accessType === 0 ||
//                 item.accessType === "deny"
//                 ? 0
//                 : 1
//               : 1,
//             clearanceLevel: hasClearanceLevel
//               ? item.clearanceLevel
//               : hasSecurityLevel
//               ? item.securityLevel
//               : undefined,
//           };
//         }
//         // If item exists in changes but doesn't have clearanceLevel, check original for securityLevel
//         else if (
//           existingChange &&
//           !existingChange.clearanceLevel &&
//           hasSecurityLevel
//         ) {
//           allEntries[itemId].clearanceLevel = item.securityLevel;
//         }
//       });

//       return allEntries;
//     };

//     const allUsers = getAllData("users", users || []);
//     const allRoles = getAllData("roles", roles || []);
//     const allData = { ...allUsers, ...allRoles };

//     // Create clearanceRules from items that have clearanceLevel
//     const clearanceRules = Object.values(allData)
//       .filter((item) => typeof item.clearanceLevel === "number")
//       .map((item) => ({
//         principalId: item.principalId,
//         principalType: item.principalType,
//         [item.principalType === "user" ? "userName" : "roleName"]:
//           item.userName || item.roleName,
//         clearanceLevel: item.clearanceLevel,
//       }));

//     // Create aclRules from items that have permissions or accessType
//     const aclRules = Object.values(allData)
//       .filter(
//         (item) =>
//           (item.permissions && item.permissions.length > 0) ||
//           item.accessType !== undefined
//       )
//       .map((item) => ({
//         principalId: item.principalId,
//         principalType: item.principalType,
//         [item.principalType === "user" ? "userName" : "roleName"]:
//           item.userName || item.roleName,
//         permissions: item.permissions || [],
//         accessType: item.accessType !== undefined ? item.accessType : 1,
//       }));

//     const result = { clearanceRules, aclRules };

//     console.log("=== CLEARANCE DEBUG ===");
//     console.log(
//       "DataChanges users with clearanceLevel:",
//       Object.entries(dataChanges.users || {}).filter(
//         ([id, data]) => data.clearanceLevel !== undefined
//       )
//     );
//     console.log(
//       "DataChanges roles with clearanceLevel:",
//       Object.entries(dataChanges.roles || {}).filter(
//         ([id, data]) => data.clearanceLevel !== undefined
//       )
//     );
//     console.log(
//       "Original users with clearanceLevel or securityLevel:",
//       (users || []).filter(
//         (user) =>
//           user.clearanceLevel !== undefined || user.securityLevel !== undefined
//       )
//     );
//     console.log(
//       "Original roles with clearanceLevel or securityLevel:",
//       (roles || []).filter(
//         (role) =>
//           role.clearanceLevel !== undefined || role.securityLevel !== undefined
//       )
//     );
//     console.log(
//       "Final allData entries with clearanceLevel:",
//       Object.entries(allData).filter(
//         ([id, data]) => data.clearanceLevel !== undefined
//       )
//     );
//     console.log("=== END CLEARANCE DEBUG ===");

//     console.log("Final Result (All Data):", JSON.stringify(result, null, 2));
//     console.log("All Users Data:", allUsers);
//     console.log("All Roles Data:", allRoles);
//     console.log("Original Users:", users);
//     console.log("Original Roles:", roles);

//     if (onDone) {
//       onDone(result);
//     }

//     return result;
//   }, [dataChanges, users, roles, onDone]);

//   const rolesColumns = useMemo(
//     () => [
//       {
//         id: "name",
//         accessorKey: "name",
//         header: t("roleName"),
//         size: 150,
//         minSize: 120,
//         // Custom cell renderer to handle different name field structures
//         cell: ({ row }) => (
//           <div className="text-sm py-3 px-4">
//             {row.original.name || row.original.roleName || "Unknown Role"}
//           </div>
//         ),
//       },
//       {
//         id: "permissions",
//         accessorKey: "permissions",
//         header: t("permissions"),
//         size: 300,
//         minSize: 250,
//         cell: ({ row }) => (
//           <div className="py-2 min-h-[60px] flex items-center">
//             <div className="w-full">
//               <Permissions
//                 key={`role-permissions-${getRowId(row)}`}
//                 targetId={getRowId(row)}
//                 targetType="role"
//                 entityType={entityType}
//                 onPermissionsChange={handleRolePermissionsChange}
//                 initialSelectedPermissions={
//                   dataChanges.roles?.[getRowId(row)]?.permissions ||
//                   row.original.permissions ||
//                   []
//                 }
//               />
//             </div>
//           </div>
//         ),
//       },
//       {
//         id: "accessType",
//         accessorKey: "accessType",
//         header: t("accessType"),
//         size: 180,
//         minSize: 150,
//         cell: ({ row }) => (
//           <AccessTypeCell
//             row={row}
//             type="role"
//             dataChanges={dataChanges}
//             handleAccessTypeChange={handleAccessTypeChange}
//             getRowId={getRowId}
//             getOriginalAccessType={getOriginalAccessType}
//             t={t}
//           />
//         ),
//       },
//       ...(isRepository
//         ? [
//             {
//               id: "clearanceLevel",
//               accessorKey: "clearanceLevel",
//               header: t("securityLevel"),
//               size: 180,
//               minSize: 150,
//               cell: ({ row }) => (
//                 <SecurityLevelCell
//                   row={row}
//                   type="role"
//                   dataChanges={dataChanges}
//                   handleSecurityLevelChange={handleSecurityLevelChange}
//                   getRowId={getRowId}
//                   getOriginalClearanceLevel={getOriginalClearanceLevel}
//                   t={t}
//                 />
//               ),
//             },
//           ]
//         : []),
//     ],
//     [
//       handleRolePermissionsChange,
//       handleAccessTypeChange,
//       handleSecurityLevelChange,
//       dataChanges,
//       entityType,
//       t,
//       isRepository,
//     ]
//   );

//   const usersColumns = useMemo(
//     () => [
//       {
//         id: "userName",
//         accessorKey: "name",
//         header: t("username"),
//         size: 150,
//         minSize: 120,
//         // Custom cell renderer to handle different name field structures
//         cell: ({ row }) => (
//           <div className="text-sm py-3 px-4">
//             {row.original.name ||
//               row.original.firstName + " " + (row.original.lastName || "") ||
//               row.original.username ||
//               "Unknown User"}
//           </div>
//         ),
//       },
//       {
//         id: "permissions",
//         accessorKey: "permissions",
//         header: t("permissions"),
//         size: 300,
//         minSize: 250,
//         cell: ({ row }) => (
//           <div className="py-2 min-h-[60px] flex items-center">
//             <div className="w-full">
//               <Permissions
//                 key={`user-permissions-${getRowId(row)}`}
//                 targetId={getRowId(row)}
//                 targetType="user"
//                 entityType={entityType}
//                 onPermissionsChange={handleUserPermissionsChange}
//                 initialSelectedPermissions={
//                   dataChanges.users?.[getRowId(row)]?.permissions ||
//                   row.original.permissions ||
//                   []
//                 }
//               />
//             </div>
//           </div>
//         ),
//       },
//       {
//         id: "accessType",
//         accessorKey: "accessType",
//         header: t("accessType"),
//         size: 180,
//         minSize: 150,
//         cell: ({ row }) => (
//           <AccessTypeCell
//             row={row}
//             type="user"
//             dataChanges={dataChanges}
//             handleAccessTypeChange={handleAccessTypeChange}
//             getRowId={getRowId}
//             getOriginalAccessType={getOriginalAccessType}
//             t={t}
//           />
//         ),
//       },
//       ...(isRepository
//         ? [
//             {
//               id: "clearanceLevel",
//               accessorKey: "clearanceLevel",
//               header: t("securityLevel"),
//               size: 180,
//               minSize: 150,
//               cell: ({ row }) => (
//                 <SecurityLevelCell
//                   row={row}
//                   type="user"
//                   dataChanges={dataChanges}
//                   handleSecurityLevelChange={handleSecurityLevelChange}
//                   getRowId={getRowId}
//                   getOriginalClearanceLevel={getOriginalClearanceLevel}
//                   t={t}
//                 />
//               ),
//             },
//           ]
//         : []),
//     ],
//     [
//       handleUserPermissionsChange,
//       handleAccessTypeChange,
//       handleSecurityLevelChange,
//       dataChanges,
//       entityType,
//       t,
//       isRepository,
//     ]
//   );
//   const currentData = activeTable === "users" ? users || [] : roles || [];
//   const currentColumns = activeTable === "users" ? usersColumns : rolesColumns;
//   const currentStatus = principlesStatus;
//   const currentDoubleClick =
//     activeTable === "users"
//       ? handleRowDoubleClickUsers
//       : handleRowDoubleClickRoles;

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-w-full overflow-hidden">
//       {/* Debug Panel */}
//       <div className="p-3 bg-blue-50 border-b border-blue-200 text-sm">
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <strong>{t("status")}:</strong> {principlesStatus} |{" "}
//             <strong>{t("repoId")}:</strong> {repoId || t("missing")} |{" "}
//             <strong>IsRepo:</strong> {isRepository ? "Yes" : "No"}
//           </div>
//           <div>
//             <strong>{t("raw")}:</strong> {principles?.length || 0} |{" "}
//             <strong>{t("users")}:</strong> {users?.length || 0} |{" "}
//             <strong>{t("roles")}:</strong> {roles?.length || 0}
//           </div>
//         </div>
//       </div>

//       {/* Enhanced Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
//         <div className="flex items-center gap-3">
//           <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
//             <svg
//               className="w-4 h-4 text-blue-600"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
//               />
//             </svg>
//           </div>
//           <div>
//             <h2 className="text-xl font-semibold text-gray-800">
//               {activeTable === "users"
//                 ? t("usersManagement")
//                 : t("rolesManagement")}
//             </h2>
//             <p className="text-sm text-gray-600 mt-1">
//               {activeTable === "users"
//                 ? t("usersManagementDescription")
//                 : t("rolesManagementDescription")}
//             </p>
//           </div>
//         </div>

//         {/* Toggle Button Group */}
//         <div className="flex items-center gap-4">
//           <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
//             <button
//               onClick={() => setActiveTable("users")}
//               className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
//                 activeTable === "users"
//                   ? "bg-blue-600 text-white shadow-sm"
//                   : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
//               }`}
//             >
//               <svg
//                 className="w-4 h-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
//                 />
//               </svg>
//               {t("users")} ({users?.length || 0})
//             </button>
//             <button
//               onClick={() => setActiveTable("roles")}
//               className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
//                 activeTable === "roles"
//                   ? "bg-blue-600 text-white shadow-sm"
//                   : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
//               }`}
//             >
//               <svg
//                 className="w-4 h-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
//                 />
//               </svg>
//               {t("roles")} ({roles?.length || 0})
//             </button>
//           </div>

//           {/* Done Button */}
//           <button
//             onClick={handleDoneClick}
//             className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm"
//           >
//             <svg
//               className="w-4 h-4"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M5 13l4 4L19 7"
//               />
//             </svg>
//             {t("done")}
//           </button>
//         </div>
//       </div>

//       {/* Table Container */}
//       <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
//         <ReUsableTable
//           columns={currentColumns}
//           data={currentData}
//           title={`${activeTable === "users" ? t("users") : t("roles")} ${t(
//             "list"
//           )}`}
//           isLoading={currentStatus === "loading"}
//           onRowDoubleClick={currentDoubleClick}
//           showGlobalFilter={true}
//           pageSizeOptions={[5, 10, 15, 25, 50]}
//           defaultPageSize={10}
//           className={`${activeTable}-permissions-table`}
//           enableSelection={false}
//           tableClassName="min-w-full"
//           rowClassName="hover:bg-gray-50 transition-colors duration-150"
//           headerClassName="bg-gradient-to-r from-gray-50 to-gray-100 text-sm font-semibold text-gray-700 border-b border-gray-200"
//           cellClassName="text-sm py-3 px-4"
//         />
//       </div>
//     </div>
//   );
// }

// export default UsersRolesPermissionsTable;

/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useState } from "react";
import ReUsableTable from "../../resusableComponents/table/ReUsableTable";
import { useDispatch, useSelector } from "react-redux";
import Permissions from "./Permissions";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { fetchPrinciples, fetchAvailablePermission } from "./permissionsThunks";

/**
 * AccessTypeCell Component - Renders toggle switch for Allow/Deny permissions
 */
const AccessTypeCell = ({
  row,
  type,
  dataChanges,
  handleAccessTypeChange,
  getRowId,
  getOriginalAccessType,
  t,
}) => {
  const tableType = type === "user" ? "users" : "roles";
  const rowId = getRowId(row);
  const currentData = dataChanges[tableType]?.[rowId];

  const isChecked =
    currentData?.accessType !== undefined
      ? currentData.accessType === 1
      : getOriginalAccessType(row.original) === 1;

  const handleToggle = (checked) => {
    if (rowId) {
      const accessTypeValue = checked ? 1 : 0;
      handleAccessTypeChange(rowId, accessTypeValue, type);
    }
  };

  if (!rowId) {
    return (
      <div className="text-red-500 text-sm">
        {t("invalidData") || "Invalid data"}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => handleToggle(e.target.checked)}
          className="sr-only peer"
        />
        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        <span className="ml-3 text-sm font-medium text-gray-700">
          {isChecked ? t("allow") : t("deny")}
        </span>
      </label>
    </div>
  );
};

/**
 * SecurityLevelCell Component - Renders numeric input for security clearance levels (0-99)
 */
const SecurityLevelCell = ({
  row,
  type,
  dataChanges,
  handleSecurityLevelChange,
  getRowId,
  getOriginalClearanceLevel,
  t,
}) => {
  const tableType = type === "user" ? "users" : "roles";
  const rowId = getRowId(row);
  const currentData = dataChanges[tableType]?.[rowId];
  const initialValue = currentData
    ? currentData.clearanceLevel
    : getOriginalClearanceLevel(row.original);

  const [value, setValue] = useState(initialValue ?? "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (rowId) {
      const newValue =
        dataChanges[tableType]?.[rowId]?.clearanceLevel ??
        getOriginalClearanceLevel(row.original);
      setValue(newValue ?? "");
    }
  }, [
    dataChanges[tableType]?.[rowId]?.clearanceLevel,
    rowId,
    tableType,
    row.original.clearanceLevel,
    dataChanges,
    getOriginalClearanceLevel,
  ]);

  const handleChange = useCallback(
    (e) => {
      const inputValue = e.target.value;
      setValue(inputValue);

      if (inputValue === "") {
        setError("");
        return;
      }

      const numValue = parseInt(inputValue, 10);
      if (isNaN(numValue)) {
        setError(t("numbersOnly"));
        return;
      }
      if (numValue < 0 || numValue > 99) {
        setError(t("range0to99"));
        return;
      }
      setError("");
    },
    [t]
  );

  const handleBlur = useCallback(() => {
    if (value === "") return;

    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 0 || numValue > 99) {
      const defaultValue = getOriginalClearanceLevel(row.original);
      setValue(defaultValue ?? "");
      setError("");
      return;
    }

    if (rowId) {
      handleSecurityLevelChange(rowId, numValue, type);
    }
    setError("");
  }, [
    value,
    rowId,
    type,
    handleSecurityLevelChange,
    getOriginalClearanceLevel,
    row.original,
  ]);

  if (!rowId) {
    return (
      <div className="text-red-500 text-sm">
        {t("invalidData") || "Invalid data"}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <input
        key={`security-level-${rowId}-${tableType}`}
        type="number"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        min="0"
        max="99"
        className={`w-20 px-2 py-1 text-center border rounded-md focus:outline-none focus:ring-2 transition-colors ${
          error
            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        }`}
        placeholder={t("range0to99")}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

function UsersRolesPermissionsTable({
  onDone,
  savedData,
  entityType,
  isRepository,
  fetchUsers,
  fetchRoles,
}) {
  const dispatch = useDispatch();
  const [activeTable, setActiveTable] = useState("users");
  const { t } = useTranslation();
  const { repoId } = useParams();

  // ✅ UPDATED: Get currentEntityType from Redux
  const {
    permissions,
    loading: permissionsLoading,
    currentEntityType,
  } = useSelector((state) => state.permissionsReducer);

  // ✅ UPDATED: Fetch permissions when entityType changes
  useEffect(() => {
    if (!entityType) return;

    const needsFetch =
      currentEntityType !== entityType ||
      (permissions.length === 0 && !permissionsLoading);

    if (needsFetch && !permissionsLoading) {
      console.log(
        "🔵 Fetching permissions at parent level for:",
        entityType,
        "Current:",
        currentEntityType
      );
      dispatch(fetchAvailablePermission(entityType));
    }
  }, [
    entityType,
    currentEntityType,
    dispatch,
    permissions.length,
    permissionsLoading,
  ]);

  const [dataChanges, setDataChanges] = useState(() => {
    const initialState = { users: {}, roles: {} };

    if (
      savedData &&
      (savedData.clearanceRules?.length > 0 || savedData.aclRules?.length > 0)
    ) {
      savedData.clearanceRules?.forEach((rule) => {
        const tableType = rule.principalType === "user" ? "users" : "roles";
        initialState[tableType][rule.principalId] = {
          ...initialState[tableType][rule.principalId],
          principalId: rule.principalId,
          principalType: rule.principalType,
          [rule.principalType === "user" ? "userName" : "roleName"]:
            rule.userName || rule.roleName || "",
          clearanceLevel: rule.clearanceLevel,
        };
      });

      savedData.aclRules?.forEach((rule) => {
        const tableType = rule.principalType === "user" ? "users" : "roles";
        initialState[tableType][rule.principalId] = {
          ...initialState[tableType][rule.principalId],
          principalId: rule.principalId,
          principalType: rule.principalType,
          [rule.principalType === "user" ? "userName" : "roleName"]:
            rule.userName || rule.roleName || "",
          permissions: rule.permissions || [],
          accessType:
            rule.accessType === "Deny" ||
            rule.accessType === "deny" ||
            rule.accessType === 0
              ? 0
              : 1,
        };
      });
    }

    return initialState;
  });

  // Redux selectors
  const principlesState = useSelector((state) => state.permissionsReducer);
  const usersState = useSelector((state) => state.usersReducer || state.users);
  const rolesState = useSelector((state) => state.rolesReducer || state.roles);

  // ✅ FIXED: More robust principles extraction with useMemo
  const principles = useMemo(() => {
    const principlesData =
      principlesState?.principles ||
      principlesState?.data ||
      principlesState?.response ||
      [];

    // Ensure it's always an array
    if (!Array.isArray(principlesData)) {
      console.log("⚠️ Principles data is not an array:", principlesData);
      return [];
    }

    return principlesData;
  }, [principlesState]);

  const principlesStatus =
    principlesState?.principlesStatus || principlesState?.status || "idle";

  const usersData =
    usersState?.users || usersState?.data || usersState?.response || [];
  const rolesData =
    rolesState?.roles || rolesState?.data || rolesState?.response || [];

  const users = useMemo(() => {
    if (isRepository) {
      return Array.isArray(usersData) ? usersData : [];
    } else {
      // This should now always be safe since principles is guaranteed to be an array
      const filteredUsers = principles.filter((principle) => {
        const isUser = principle?.type === "User";
        return isUser;
      });
      return filteredUsers;
    }
  }, [isRepository, usersData, principles]);

  const roles = useMemo(() => {
    if (isRepository) {
      return Array.isArray(rolesData) ? rolesData : [];
    } else {
      // This should now always be safe since principles is guaranteed to be an array
      const filteredRoles = principles.filter((principle) => {
        const isRole = principle?.type === "Role";
        return isRole;
      });
      return filteredRoles;
    }
  }, [isRepository, rolesData, principles]);

  useEffect(() => {
    if (isRepository) {
      console.log("Is Repo - Fetching users and roles");
      dispatch(fetchUsers());
      dispatch(fetchRoles());
    } else {
      console.log("Is Not Repo - Fetching principles");
      dispatch(fetchPrinciples(repoId));
    }
  }, [isRepository, fetchUsers, fetchRoles, repoId, dispatch]);

  useEffect(() => {
    console.log("=== DATA DEBUG ===");
    console.log("isRepository:", isRepository);
    console.log("savedData:", savedData);
    console.log("usersData from Redux:", usersData);
    console.log("rolesData from Redux:", rolesData);
    console.log("principlesState:", principlesState);
    console.log("principles (processed):", principles);
    console.log("Final processed users:", users);
    console.log("Final processed roles:", roles);
    console.log("Current dataChanges:", dataChanges);
    console.log("Current Entity Type:", currentEntityType);
    console.log("Requested Entity Type:", entityType);
    console.log("=== END DEBUG ===");
  }, [
    isRepository,
    savedData,
    usersData,
    rolesData,
    principlesState,
    principles,
    users,
    roles,
    dataChanges,
    currentEntityType,
    entityType,
  ]);

  const getRowId = (row) => {
    return (
      row.original.userId ||
      row.original.roleId ||
      row.original.id ||
      row.original._id
    );
  };

  const getOriginalAccessType = (item) => {
    return item.accessType === false ||
      item.accessType === "disabled" ||
      item.accessType === "Deny" ||
      item.accessType === "deny" ||
      item.accessType === 0
      ? 0
      : 1;
  };

  const getOriginalClearanceLevel = (item) => {
    return typeof item.clearanceLevel === "number"
      ? item.clearanceLevel
      : typeof item.securityLevel === "number"
      ? item.securityLevel
      : null;
  };

  const handleRowDoubleClickRoles = useCallback((row) => {
    const roleId = getRowId(row);
    console.log(
      "Role selected! Role ID:",
      roleId,
      "Full row data:",
      row.original
    );
  }, []);

  const handleRowDoubleClickUsers = useCallback((row) => {
    const userId = getRowId(row);
    console.log(
      "User selected! User ID:",
      userId,
      "Full row data:",
      row.original
    );
  }, []);

  const handleUserPermissionsChange = useCallback(
    (userId, selectedPermissions) => {
      console.log(
        "User ID:",
        userId,
        "Selected Permissions:",
        selectedPermissions
      );

      if (!userId) {
        console.error(
          "Invalid user ID provided to handleUserPermissionsChange"
        );
        return;
      }

      const originalUser = users.find(
        (user) => user.userId === userId || user.id === userId
      );

      setDataChanges((prev) => ({
        ...prev,
        users: {
          ...prev.users,
          [userId]: {
            ...prev.users[userId],
            principalId: userId,
            principalType: "user",
            userName:
              originalUser?.name ||
              originalUser?.firstName + " " + (originalUser?.lastName || "") ||
              originalUser?.username ||
              "Unknown User",
            permissions: Array.isArray(selectedPermissions)
              ? [...selectedPermissions]
              : [],
          },
        },
      }));
    },
    [users]
  );

  const handleRolePermissionsChange = useCallback(
    (roleId, selectedPermissions) => {
      console.log(
        "Role ID:",
        roleId,
        "Selected Permissions:",
        selectedPermissions
      );

      if (!roleId) {
        console.error(
          "Invalid role ID provided to handleRolePermissionsChange"
        );
        return;
      }

      const originalRole = roles.find(
        (role) => role.roleId === roleId || role.id === roleId
      );

      setDataChanges((prev) => ({
        ...prev,
        roles: {
          ...prev.roles,
          [roleId]: {
            ...prev.roles[roleId],
            principalId: roleId,
            principalType: "role",
            roleName:
              originalRole?.name || originalRole?.roleName || "Unknown Role",
            permissions: Array.isArray(selectedPermissions)
              ? [...selectedPermissions]
              : [],
          },
        },
      }));
    },
    [roles]
  );

  const handleAccessTypeChange = useCallback(
    (id, accessTypeValue, type) => {
      console.log(
        `${type} ID:`,
        id,
        "Access Type:",
        accessTypeValue === 1 ? "Allow" : "Deny",
        "Value:",
        accessTypeValue
      );

      if (!id) {
        console.error(
          `Invalid ${type} ID provided to handleAccessTypeChange:`,
          id
        );
        return;
      }

      const originalData =
        type === "user"
          ? users.find((user) => user.userId === id || user.id === id)
          : roles.find((role) => role.roleId === id || role.id === id);

      const tableType = type === "user" ? "users" : "roles";
      const nameField = type === "user" ? "userName" : "roleName";
      const displayName =
        type === "user"
          ? originalData?.name ||
            originalData?.firstName + " " + (originalData?.lastName || "") ||
            originalData?.username ||
            "Unknown User"
          : originalData?.name || originalData?.roleName || "Unknown Role";

      setDataChanges((prev) => ({
        ...prev,
        [tableType]: {
          ...prev[tableType],
          [id]: {
            ...prev[tableType][id],
            principalId: id,
            principalType: type,
            [nameField]: displayName,
            accessType: accessTypeValue,
          },
        },
      }));
    },
    [users, roles]
  );

  const handleSecurityLevelChange = useCallback(
    (id, value, type) => {
      const numValue = parseInt(value, 10);
      if (isNaN(numValue) || numValue < 0 || numValue > 99) {
        console.log("Invalid security level. Must be between 0-99");
        return;
      }
      console.log(`${type} ID:`, id, "Security Level:", numValue);

      if (!id) {
        console.error(
          `Invalid ${type} ID provided to handleSecurityLevelChange:`,
          id
        );
        return;
      }

      const originalData =
        type === "user"
          ? users.find((user) => user.userId === id || user.id === id)
          : roles.find((role) => role.roleId === id || role.id === id);

      const tableType = type === "user" ? "users" : "roles";
      const nameField = type === "user" ? "userName" : "roleName";
      const displayName =
        type === "user"
          ? originalData?.name ||
            originalData?.firstName + " " + (originalData?.lastName || "") ||
            originalData?.username ||
            "Unknown User"
          : originalData?.name || originalData?.roleName || "Unknown Role";

      setDataChanges((prev) => ({
        ...prev,
        [tableType]: {
          ...prev[tableType],
          [id]: {
            ...prev[tableType][id],
            principalId: id,
            principalType: type,
            [nameField]: displayName,
            clearanceLevel: numValue,
          },
        },
      }));
    },
    [users, roles]
  );

  const handleDoneClick = useCallback(() => {
    const getAllData = (dataType, originalArray) => {
      const allEntries = {};

      Object.entries(dataChanges[dataType]).forEach(([id, changeData]) => {
        allEntries[id] = changeData;
      });

      originalArray.forEach((item) => {
        const itemId = item.userId || item.roleId || item.id || item._id;
        if (!itemId) return;

        const existingChange = allEntries[itemId];
        const hasPermissions = item.permissions && item.permissions.length > 0;
        const hasAccessType = item.accessType !== undefined;
        const hasClearanceLevel = typeof item.clearanceLevel === "number";
        const hasSecurityLevel = typeof item.securityLevel === "number";

        if (
          (hasPermissions ||
            hasAccessType ||
            hasClearanceLevel ||
            hasSecurityLevel) &&
          !existingChange
        ) {
          const displayName =
            dataType === "users"
              ? item.name ||
                item.firstName + " " + (item.lastName || "") ||
                item.username ||
                "Unknown User"
              : item.name || item.roleName || "Unknown Role";

          allEntries[itemId] = {
            principalId: itemId,
            principalType: dataType === "users" ? "user" : "role",
            [dataType === "users" ? "userName" : "roleName"]: displayName,
            permissions: item.permissions || [],
            accessType: hasAccessType
              ? item.accessType === false ||
                item.accessType === 0 ||
                item.accessType === "deny"
                ? 0
                : 1
              : 1,
            clearanceLevel: hasClearanceLevel
              ? item.clearanceLevel
              : hasSecurityLevel
              ? item.securityLevel
              : undefined,
          };
        } else if (
          existingChange &&
          !existingChange.clearanceLevel &&
          hasSecurityLevel
        ) {
          allEntries[itemId].clearanceLevel = item.securityLevel;
        }
      });

      return allEntries;
    };

    const allUsers = getAllData("users", users || []);
    const allRoles = getAllData("roles", roles || []);
    const allData = { ...allUsers, ...allRoles };

    const clearanceRules = Object.values(allData)
      .filter((item) => typeof item.clearanceLevel === "number")
      .map((item) => ({
        principalId: item.principalId,
        principalType: item.principalType,
        [item.principalType === "user" ? "userName" : "roleName"]:
          item.userName || item.roleName,
        clearanceLevel: item.clearanceLevel,
      }));

    const aclRules = Object.values(allData)
      .filter(
        (item) =>
          (item.permissions && item.permissions.length > 0) ||
          item.accessType !== undefined
      )
      .map((item) => ({
        principalId: item.principalId,
        principalType: item.principalType,
        [item.principalType === "user" ? "userName" : "roleName"]:
          item.userName || item.roleName,
        permissions: item.permissions || [],
        accessType: item.accessType !== undefined ? item.accessType : 1,
      }));

    const result = { clearanceRules, aclRules };

    console.log("Final Result (All Data):", JSON.stringify(result, null, 2));

    if (onDone) {
      onDone(result);
    }

    return result;
  }, [dataChanges, users, roles, onDone]);

  const rolesColumns = useMemo(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: t("roleName"),
        size: 150,
        minSize: 120,
        cell: ({ row }) => (
          <div className="text-sm py-3 px-4">
            {row.original.name || row.original.roleName || "Unknown Role"}
          </div>
        ),
      },
      {
        id: "permissions",
        accessorKey: "permissions",
        header: t("permissions"),
        size: 300,
        minSize: 250,
        cell: ({ row }) => (
          <div className="py-2 min-h-[60px] flex items-center">
            <div className="w-full">
              <Permissions
                key={`role-permissions-${getRowId(row)}`}
                targetId={getRowId(row)}
                targetType="role"
                entityType={entityType}
                onPermissionsChange={handleRolePermissionsChange}
                initialSelectedPermissions={
                  dataChanges.roles?.[getRowId(row)]?.permissions ||
                  row.original.permissions ||
                  []
                }
              />
            </div>
          </div>
        ),
      },
      {
        id: "accessType",
        accessorKey: "accessType",
        header: t("accessType"),
        size: 180,
        minSize: 150,
        cell: ({ row }) => (
          <AccessTypeCell
            row={row}
            type="role"
            dataChanges={dataChanges}
            handleAccessTypeChange={handleAccessTypeChange}
            getRowId={getRowId}
            getOriginalAccessType={getOriginalAccessType}
            t={t}
          />
        ),
      },
      ...(isRepository
        ? [
            {
              id: "clearanceLevel",
              accessorKey: "clearanceLevel",
              header: t("securityLevel"),
              size: 180,
              minSize: 150,
              cell: ({ row }) => (
                <SecurityLevelCell
                  row={row}
                  type="role"
                  dataChanges={dataChanges}
                  handleSecurityLevelChange={handleSecurityLevelChange}
                  getRowId={getRowId}
                  getOriginalClearanceLevel={getOriginalClearanceLevel}
                  t={t}
                />
              ),
            },
          ]
        : []),
    ],
    [
      handleRolePermissionsChange,
      handleAccessTypeChange,
      handleSecurityLevelChange,
      dataChanges,
      entityType,
      t,
      isRepository,
    ]
  );

  const usersColumns = useMemo(
    () => [
      {
        id: "userName",
        accessorKey: "name",
        header: t("username"),
        size: 150,
        minSize: 120,
        cell: ({ row }) => (
          <div className="text-sm py-3 px-4">
            {row.original.name ||
              row.original.firstName + " " + (row.original.lastName || "") ||
              row.original.username ||
              "Unknown User"}
          </div>
        ),
      },
      {
        id: "permissions",
        accessorKey: "permissions",
        header: t("permissions"),
        size: 300,
        minSize: 250,
        cell: ({ row }) => (
          <div className="py-2 min-h-[60px] flex items-center">
            <div className="w-full">
              <Permissions
                key={`user-permissions-${getRowId(row)}`}
                targetId={getRowId(row)}
                targetType="user"
                entityType={entityType}
                onPermissionsChange={handleUserPermissionsChange}
                initialSelectedPermissions={
                  dataChanges.users?.[getRowId(row)]?.permissions ||
                  row.original.permissions ||
                  []
                }
              />
            </div>
          </div>
        ),
      },
      {
        id: "accessType",
        accessorKey: "accessType",
        header: t("accessType"),
        size: 180,
        minSize: 150,
        cell: ({ row }) => (
          <AccessTypeCell
            row={row}
            type="user"
            dataChanges={dataChanges}
            handleAccessTypeChange={handleAccessTypeChange}
            getRowId={getRowId}
            getOriginalAccessType={getOriginalAccessType}
            t={t}
          />
        ),
      },
      ...(isRepository
        ? [
            {
              id: "clearanceLevel",
              accessorKey: "clearanceLevel",
              header: t("securityLevel"),
              size: 180,
              minSize: 150,
              cell: ({ row }) => (
                <SecurityLevelCell
                  row={row}
                  type="user"
                  dataChanges={dataChanges}
                  handleSecurityLevelChange={handleSecurityLevelChange}
                  getRowId={getRowId}
                  getOriginalClearanceLevel={getOriginalClearanceLevel}
                  t={t}
                />
              ),
            },
          ]
        : []),
    ],
    [
      handleUserPermissionsChange,
      handleAccessTypeChange,
      handleSecurityLevelChange,
      dataChanges,
      entityType,
      t,
      isRepository,
    ]
  );

  const currentData = activeTable === "users" ? users || [] : roles || [];
  const currentColumns = activeTable === "users" ? usersColumns : rolesColumns;
  const currentStatus = principlesStatus;
  const currentDoubleClick =
    activeTable === "users"
      ? handleRowDoubleClickUsers
      : handleRowDoubleClickRoles;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-w-full overflow-hidden">
      {/* Debug Panel */}
      <div className="p-3 bg-blue-50 border-b border-blue-200 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>{t("status")}:</strong> {principlesStatus} |{" "}
            <strong>{t("repoId")}:</strong> {repoId || t("missing")} |{" "}
            <strong>IsRepo:</strong> {isRepository ? "Yes" : "No"}
          </div>
          <div>
            <strong>{t("raw")}:</strong> {principles?.length || 0} |{" "}
            <strong>{t("users")}:</strong> {users?.length || 0} |{" "}
            <strong>{t("roles")}:</strong> {roles?.length || 0} |{" "}
            <strong>Entity:</strong> {currentEntityType || "None"}
          </div>
        </div>
      </div>

      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {activeTable === "users"
                ? t("usersManagement")
                : t("rolesManagement")}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {activeTable === "users"
                ? t("usersManagementDescription")
                : t("rolesManagementDescription")}
            </p>
          </div>
        </div>

        {/* Toggle Button Group */}
        <div className="flex items-center gap-4">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTable("users")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTable === "users"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {t("users")} ({users?.length || 0})
            </button>
            <button
              onClick={() => setActiveTable("roles")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTable === "roles"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              {t("roles")} ({roles?.length || 0})
            </button>
          </div>

          {/* Done Button */}
          <button
            onClick={handleDoneClick}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {t("done")}
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
        <ReUsableTable
          columns={currentColumns}
          data={currentData}
          title={`${activeTable === "users" ? t("users") : t("roles")} ${t(
            "list"
          )}`}
          isLoading={currentStatus === "loading"}
          onRowDoubleClick={currentDoubleClick}
          showGlobalFilter={true}
          pageSizeOptions={[5, 10, 15, 25, 50]}
          defaultPageSize={10}
          className={`${activeTable}-permissions-table`}
          enableSelection={false}
          tableClassName="min-w-full"
          rowClassName="hover:bg-gray-50 transition-colors duration-150"
          headerClassName="bg-gradient-to-r from-gray-50 to-gray-100 text-sm font-semibold text-gray-700 border-b border-gray-200"
          cellClassName="text-sm py-3 px-4"
        />
      </div>
    </div>
  );
}

export default UsersRolesPermissionsTable;
