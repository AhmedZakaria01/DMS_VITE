// /* eslint-disable react/prop-types */
// import { useEffect, useMemo, useState, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import PropTypes from "prop-types";
// import { useTranslation } from "react-i18next";
// import { fetchAvailablePermission } from "./permissionsThunks";

// function Permissions({
//   targetId,
//   targetType,
//   onPermissionsChange,
//   initialSelectedPermissions = [],
//   entityType,
// }) {
//   const { t } = useTranslation();
//   const dispatch = useDispatch();
//   const { permissions, loading, error } = useSelector(
//     (state) => state.permissionsReducer
//   );

//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedPermissions, setSelectedPermissions] = useState(
//     initialSelectedPermissions
//   );
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef(null);
//   const buttonRef = useRef(null);

//   useEffect(() => {
//     if (permissions.length === 0) {
//       dispatch(fetchAvailablePermission(entityType));
//     }
//   }, [dispatch]);

//   useEffect(() => {
//     setSelectedPermissions(initialSelectedPermissions);
//   }, [initialSelectedPermissions]);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target) &&
//         buttonRef.current &&
//         !buttonRef.current.contains(event.target)
//       ) {
//         setIsDropdownOpen(false);
//       }
//     };

//     if (isDropdownOpen) {
//       document.addEventListener("mousedown", handleClickOutside);
//       return () =>
//         document.removeEventListener("mousedown", handleClickOutside);
//     }
//   }, [isDropdownOpen]);

//   const permissionsArray = useMemo(() => {
//     if (!permissions) return [];
//     if (Array.isArray(permissions)) return permissions;
//     return [];
//   }, [permissions]);

//   const filteredPermissions = useMemo(() => {
//     return permissionsArray.filter((permission) => {
//       if (!permission) return false;
//       const displayName = permission.displayName || "";
//       return displayName.toLowerCase().includes(searchTerm.toLowerCase());
//     });
//   }, [permissionsArray, searchTerm]);

//   const handleCheckboxChange = (permission) => {
//     const newSelectedPermissions = selectedPermissions.some(
//       (p) => p.id === permission.id
//     )
//       ? selectedPermissions.filter((p) => p.id !== permission.id)
//       : [...selectedPermissions, permission];

//     setSelectedPermissions(newSelectedPermissions);
//     onPermissionsChange(targetId, newSelectedPermissions);
//   };

//   const isPermissionSelected = (permission) => {
//     return selectedPermissions.some((p) => p.id === permission.id);
//   };

//   const toggleAllPermissions = () => {
//     if (filteredPermissions.length === 0) return;

//     const allSelected = filteredPermissions.every((permission) =>
//       isPermissionSelected(permission)
//     );

//     let newSelectedPermissions;
//     if (allSelected) {
//       newSelectedPermissions = selectedPermissions.filter(
//         (p) => !filteredPermissions.some((fp) => fp.id === p.id)
//       );
//     } else {
//       const newPermissions = filteredPermissions.filter(
//         (permission) => !isPermissionSelected(permission)
//       );
//       newSelectedPermissions = [...selectedPermissions, ...newPermissions];
//     }

//     setSelectedPermissions(newSelectedPermissions);
//     onPermissionsChange(targetId, newSelectedPermissions);
//   };

//   const getDisplayText = () => {
//     if (selectedPermissions.length === 0) {
//       return `Select ${targetType} permissions`;
//     }
//     if (selectedPermissions.length === 1) {
//       return selectedPermissions[0].displayName;
//     }
//     return `${selectedPermissions.length} permissions selected`;
//   };

//   const handleDropdownToggle = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setIsDropdownOpen(!isDropdownOpen);
//     if (!isDropdownOpen) {
//       setSearchTerm(""); // Reset search when opening
//     }
//   };

//   return (
//     <div className="relative w-full">
//       {/* Dropdown Button */}
//       <button
//         ref={buttonRef}
//         type="button"
//         onClick={handleDropdownToggle}
//         className="w-full px-3 py-2 text-left border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-gray-50 transition-colors duration-150 min-h-[38px]"
//         disabled={loading}
//       >
//         <div className="flex justify-between items-center">
//           <span className="truncate text-gray-700 flex-1 mr-2">
//             {loading ? "Loading..." : getDisplayText()}
//           </span>
//           <svg
//             className={`h-4 w-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
//               isDropdownOpen ? "rotate-180" : ""
//             }`}
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M19 9l-7 7-7-7"
//             />
//           </svg>
//         </div>
//       </button>

//       {/* Dropdown Portal-style positioning */}
//       {isDropdownOpen && (
//         <>
//           {/* Fixed backdrop to capture outside clicks */}
//           <div className="fixed inset-0 z-[9998]" />

//           {/* Dropdown List with improved positioning */}
//           <div
//             ref={dropdownRef}
//             className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-md shadow-xl max-h-72 overflow-hidden flex flex-col"
//             style={{
//               minWidth: buttonRef.current?.offsetWidth || 200,
//               left: 0,
//               top: "100%",
//             }}
//           >
//             {/* Search Input */}
//             <div className="sticky top-0 bg-white p-3 border-b border-gray-200">
//               <input
//                 type="text"
//                 placeholder="Search permissions..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 autoFocus
//                 onClick={(e) => e.stopPropagation()}
//               />
//             </div>

//             {/* Select All */}
//             {filteredPermissions.length > 0 && (
//               <div className="border-b border-gray-200 bg-gray-50">
//                 <label
//                   className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
//                   onClick={(e) => e.stopPropagation()}
//                 >
//                   <input
//                     type="checkbox"
//                     checked={
//                       filteredPermissions.length > 0 &&
//                       filteredPermissions.every((permission) =>
//                         isPermissionSelected(permission)
//                       )
//                     }
//                     onChange={toggleAllPermissions}
//                     className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                     onClick={(e) => e.stopPropagation()}
//                   />
//                   <span className="ml-3 text-sm font-medium text-gray-700">
//                     Select All ({filteredPermissions.length})
//                   </span>
//                 </label>
//               </div>
//             )}

//             {/* Permissions List */}
//             <div
//               className="flex-1 overflow-auto"
//               style={{ maxHeight: "180px" }}
//             >
//               {filteredPermissions.length === 0 ? (
//                 <div className="px-3 py-4 text-sm text-gray-500 text-center">
//                   {searchTerm
//                     ? `No permissions found for "${searchTerm}"`
//                     : "No permissions available"}
//                 </div>
//               ) : (
//                 filteredPermissions.map((permission) => (
//                   <label
//                     key={permission.id}
//                     className="flex items-center px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     <input
//                       type="checkbox"
//                       checked={isPermissionSelected(permission)}
//                       onChange={() => handleCheckboxChange(permission)}
//                       className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                       onClick={(e) => e.stopPropagation()}
//                     />
//                     <span className="ml-3 text-sm text-gray-700 truncate flex-1">
//                       {permission.displayName}
//                     </span>
//                   </label>
//                 ))
//               )}
//             </div>

//             {/* Selection Summary */}
//             {filteredPermissions.length > 0 && (
//               <div className="sticky bottom-0 bg-gray-50 px-3 py-2 border-t border-gray-200">
//                 <div className="flex justify-between items-center text-sm text-gray-600">
//                   <span className="font-medium">
//                     Total: {selectedPermissions.length}
//                   </span>
//                   <span className="text-gray-500">
//                     {
//                       filteredPermissions.filter((permission) =>
//                         isPermissionSelected(permission)
//                       ).length
//                     }
//                     /{filteredPermissions.length} in view
//                   </span>
//                 </div>
//               </div>
//             )}
//           </div>
//         </>
//       )}

//       {/* Error State */}
//       {error && (
//         <div className="text-sm text-red-600 mt-1">
//           Error loading permissions
//         </div>
//       )}
//     </div>
//   );
// }

// export default Permissions;

/* eslint-disable react/prop-types */
import { useEffect, useMemo, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { fetchAvailablePermission } from "./permissionsThunks";

function Permissions({
  targetId,
  targetType,
  onPermissionsChange,
  initialSelectedPermissions = [],
  entityType,
}) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { permissions, loading, error, currentEntityType } = useSelector(
    (state) => state.permissionsReducer
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState(
    initialSelectedPermissions
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // ✅ UPDATED: Fetch when entityType changes or permissions don't match
  useEffect(() => {
    // Fetch if:
    // 1. No entityType provided - skip
    // 2. Already loading - skip
    // 3. EntityType changed - fetch
    // 4. No permissions and not loading - fetch
    if (!entityType) return;
    
    const needsFetch = 
      currentEntityType !== entityType || 
      (permissions.length === 0 && !loading);

    if (needsFetch && !loading) {
      console.log("🟢 Permissions component fetching for:", entityType, "Current:", currentEntityType);
      dispatch(fetchAvailablePermission(entityType));
    }
  }, [entityType, currentEntityType, dispatch]); // Added currentEntityType to dependencies

  useEffect(() => {
    setSelectedPermissions(initialSelectedPermissions);
  }, [initialSelectedPermissions]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isDropdownOpen]);

  const permissionsArray = useMemo(() => {
    if (!permissions) return [];
    if (Array.isArray(permissions)) return permissions;
    return [];
  }, [permissions]);

  const filteredPermissions = useMemo(() => {
    return permissionsArray.filter((permission) => {
      if (!permission) return false;
      const displayName = permission.displayName || "";
      return displayName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [permissionsArray, searchTerm]);

  const handleCheckboxChange = (permission) => {
    const newSelectedPermissions = selectedPermissions.some(
      (p) => p.id === permission.id
    )
      ? selectedPermissions.filter((p) => p.id !== permission.id)
      : [...selectedPermissions, permission];

    setSelectedPermissions(newSelectedPermissions);
    onPermissionsChange(targetId, newSelectedPermissions);
  };

  const isPermissionSelected = (permission) => {
    return selectedPermissions.some((p) => p.id === permission.id);
  };

  const toggleAllPermissions = () => {
    if (filteredPermissions.length === 0) return;

    const allSelected = filteredPermissions.every((permission) =>
      isPermissionSelected(permission)
    );

    let newSelectedPermissions;
    if (allSelected) {
      newSelectedPermissions = selectedPermissions.filter(
        (p) => !filteredPermissions.some((fp) => fp.id === p.id)
      );
    } else {
      const newPermissions = filteredPermissions.filter(
        (permission) => !isPermissionSelected(permission)
      );
      newSelectedPermissions = [...selectedPermissions, ...newPermissions];
    }

    setSelectedPermissions(newSelectedPermissions);
    onPermissionsChange(targetId, newSelectedPermissions);
  };

  const getDisplayText = () => {
    if (selectedPermissions.length === 0) {
      return `Select ${targetType} permissions`;
    }
    if (selectedPermissions.length === 1) {
      return selectedPermissions[0].displayName;
    }
    return `${selectedPermissions.length} permissions selected`;
  };

  const handleDropdownToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen(!isDropdownOpen);
    if (!isDropdownOpen) {
      setSearchTerm(""); // Reset search when opening
    }
  };

  return (
    <div className="relative w-full">
      {/* Dropdown Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleDropdownToggle}
        className="w-full px-3 py-2 text-left border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-gray-50 transition-colors duration-150 min-h-[38px]"
        disabled={loading}
      >
        <div className="flex justify-between items-center">
          <span className="truncate text-gray-700 flex-1 mr-2">
            {loading ? "Loading..." : getDisplayText()}
          </span>
          <svg
            className={`h-4 w-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
              isDropdownOpen ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Dropdown Portal-style positioning */}
      {isDropdownOpen && (
        <>
          {/* Fixed backdrop to capture outside clicks */}
          <div className="fixed inset-0 z-[9998]" />

          {/* Dropdown List with improved positioning */}
          <div
            ref={dropdownRef}
            className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-md shadow-xl max-h-72 overflow-hidden flex flex-col"
            style={{
              minWidth: buttonRef.current?.offsetWidth || 200,
              left: 0,
              top: "100%",
            }}
          >
            {/* Search Input */}
            <div className="sticky top-0 bg-white p-3 border-b border-gray-200">
              <input
                type="text"
                placeholder="Search permissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Select All */}
            {filteredPermissions.length > 0 && (
              <div className="border-b border-gray-200 bg-gray-50">
                <label
                  className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={
                      filteredPermissions.length > 0 &&
                      filteredPermissions.every((permission) =>
                        isPermissionSelected(permission)
                      )
                    }
                    onChange={toggleAllPermissions}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    Select All ({filteredPermissions.length})
                  </span>
                </label>
              </div>
            )}

            {/* Permissions List */}
            <div
              className="flex-1 overflow-auto"
              style={{ maxHeight: "180px" }}
            >
              {filteredPermissions.length === 0 ? (
                <div className="px-3 py-4 text-sm text-gray-500 text-center">
                  {searchTerm
                    ? `No permissions found for "${searchTerm}"`
                    : "No permissions available"}
                </div>
              ) : (
                filteredPermissions.map((permission) => (
                  <label
                    key={permission.id}
                    className="flex items-center px-3 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isPermissionSelected(permission)}
                      onChange={() => handleCheckboxChange(permission)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="ml-3 text-sm text-gray-700 truncate flex-1">
                      {permission.displayName}
                    </span>
                  </label>
                ))
              )}
            </div>

            {/* Selection Summary */}
            {filteredPermissions.length > 0 && (
              <div className="sticky bottom-0 bg-gray-50 px-3 py-2 border-t border-gray-200">
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span className="font-medium">
                    Total: {selectedPermissions.length}
                  </span>
                  <span className="text-gray-500">
                    {
                      filteredPermissions.filter((permission) =>
                        isPermissionSelected(permission)
                      ).length
                    }
                    /{filteredPermissions.length} in view
                  </span>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Error State */}
      {error && (
        <div className="text-sm text-red-600 mt-1">
          Error loading permissions
        </div>
      )}
    </div>
  );
}

export default Permissions;