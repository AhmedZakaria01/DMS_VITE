import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPermissions } from "./permissionsThunks";
import ReUsableTable from "../../resusableComponents/table/ReUsableTable";
import { FileText, Folder } from "lucide-react";
function Permissions() {
  const dispatch = useDispatch();
  const { permissions, loading, error } = useSelector(
    (state) => state.permissionsReducer
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchPermissions());
  }, [dispatch]);

  // Debug: Check what data we're getting
  useEffect(() => {
    console.log("Permissions data:", permissions);
  }, [permissions]);

  // Safely handle permissions data
  const getPermissionsArray = () => {
    if (!permissions) return [];
    if (Array.isArray(permissions)) return permissions;
    return [];
  };

  const permissionsArray = getPermissionsArray();

  // Filter permissions based on search term
  const filteredPermissions = permissionsArray.filter((permission) => {
    if (!permission) return false;
    const displayName = permission.displayName || "";
    return displayName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Handle checkbox change
  const handleCheckboxChange = (permission) => {
    setSelectedPermissions((prev) => {
      const isSelected = prev.some((p) => p.id === permission.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== permission.id);
      } else {
        return [...prev, permission];
      }
    });
  };

  // Check if a permission is selected
  const isPermissionSelected = (permission) => {
    return selectedPermissions.some((p) => p.id === permission.id);
  };

  // Toggle all permissions in current view
  const toggleAllPermissions = () => {
    if (filteredPermissions.length === 0) return;

    const allSelected = filteredPermissions.every((permission) =>
      isPermissionSelected(permission)
    );

    if (allSelected) {
      // Remove all filtered permissions from selected
      setSelectedPermissions((prev) =>
        prev.filter((p) => !filteredPermissions.some((fp) => fp.id === p.id))
      );
    } else {
      // Add all filtered permissions that aren't already selected
      const newPermissions = filteredPermissions.filter(
        (permission) => !isPermissionSelected(permission)
      );
      setSelectedPermissions((prev) => [...prev, ...newPermissions]);
    }
  };

  // Remove selected permission
  const removeSelectedPermission = (permissionId) => {
    setSelectedPermissions((prev) => prev.filter((p) => p.id !== permissionId));
  };

  // Clear all selections
  const clearAllSelections = () => {
    setSelectedPermissions([]);
  };
  // Define table columns
  // const columns = useMemo(
  //   () => [
  //     {
  //       id: "name",
  //       accessorKey: "displayName",
  //       header: "Name",
  //       cell: ({ row }) => (
  //         <div className="flex items-center gap-3">
  //           {row.original.type === "folder" ? (
  //             <Folder className="w-5 h-5 text-blue-500" />
  //           ) : (
  //             <FileText className="w-5 h-5 text-gray-500" />
  //           )}
  //           <span className="font-medium">{row.original.displayName}</span>
  //         </div>
  //       ),
  //     },
  //     {
  //       id: "type",
  //       accessorKey: "type",
  //       header: "Type",
  //       cell: ({ row }) => (
  //         <span
  //           className={`px-2 py-1 text-xs font-medium rounded-full ${
  //             row.original.type === "folder"
  //               ? "bg-blue-100 text-blue-800"
  //               : "bg-gray-100 text-gray-800"
  //           }`}
  //         >
  //           {row.original.type === "folder" ? "Folder" : "Document"}
  //         </span>
  //       ),
  //     },
  //   ],
  //   []
  // );
  return (
    <>
      <div className="max-w-2xl mx-auto p-4">
        <div className="mb-6">
          {/* <h1 className="text-2xl font-bold text-gray-800 mb-4">Permissions Manager</h1> */}

          {/* Debug info - you can remove this later */}
          {/* <div className="mb-4 p-3 bg-blue-50 rounded-md">
                    <p className="text-sm">Total permissions: {permissionsArray.length}</p>
                    <p className="text-sm">Filtered permissions: {filteredPermissions.length}</p>
                    <p className="text-sm">Selected permissions: {selectedPermissions.length}</p>
                </div> */}

          {/* Selected Permissions Display */}
          {/* <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Selected Permissions ({selectedPermissions.length})
                        </label>
                        {selectedPermissions.length > 0 && (
                            <button
                                onClick={clearAllSelections}
                                className="text-xs text-red-600 hover:text-red-800"
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2 p-3 border border-gray-300 rounded-md min-h-[50px]">
                        {selectedPermissions.length === 0 ? (
                            <span className="text-gray-500 text-sm">No permissions selected</span>
                        ) : (
                            selectedPermissions.map(permission => (
                                <span
                                    key={permission.id}
                                    className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                >
                                    {permission.displayName}
                                    <button
                                        onClick={() => removeSelectedPermission(permission.id)}
                                        className="ml-2 text-blue-600 hover:text-blue-800 text-lg"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))
                        )}
                    </div>
                </div> */}

          {/* Searchable Dropdown */}
          <div className="relative">
            {/* <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search and Select Permissions
                    </label> */}

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search permissions..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg
                  className="h-5 w-5 text-gray-400"
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
            </div>

            {/* Dropdown List */}
            {isDropdownOpen && permissionsArray.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                {/* Select All option */}
                {filteredPermissions.length > 0 && (
                  <div className="border-b border-gray-200">
                    <label className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
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
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        Select All ({filteredPermissions.length})
                      </span>
                    </label>
                  </div>
                )}

                {/* Permissions List */}
                {filteredPermissions.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-gray-500">
                    {searchTerm
                      ? 'No permissions found for "' + searchTerm + '"'
                      : "No permissions available"}
                  </div>
                ) : (
                  <>
                    {/* Selection count header */}
                    <div className="sticky top-0 bg-gray-50 px-4 py-2 border-b border-gray-200">
                      <div className="flex justify-between items-center text-xs text-gray-600">
                        <span>
                          Showing {filteredPermissions.length} of{" "}
                          {permissionsArray.length} permissions
                        </span>
                        <span className="font-medium">
                          Selected:{" "}
                          {
                            filteredPermissions.filter((permission) =>
                              isPermissionSelected(permission)
                            ).length
                          }{" "}
                          of {filteredPermissions.length}
                        </span>
                      </div>
                    </div>

                    {filteredPermissions.map((permission) => (
                      <label
                        key={permission.id}
                        className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                      >
                        <input
                          type="checkbox"
                          checked={isPermissionSelected(permission)}
                          onChange={() => {
                            handleCheckboxChange(permission);
                            // Log the action immediately
                            const newSelected = isPermissionSelected(permission)
                              ? selectedPermissions.filter(
                                  (p) => p.id !== permission.id
                                )
                              : [...selectedPermissions, permission];

                            // console.log(` Permission Selection Update:`);
                            // console.log(` ${permission.displayName} - ${isPermissionSelected(permission) ? 'DESELECTED' : 'SELECTED'}`);
                            // console.log(` Total selected: ${newSelected.length}`);
                            console.log(
                              " Selected permissions:",
                              newSelected.map((p) => ({
                                id: p.id,
                                displayName: p.displayName,
                                code: p.code,
                              }))
                            );
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-3 text-sm text-gray-700">
                          {permission.displayName}
                        </span>
                      </label>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Close dropdown when clicking outside */}
          {isDropdownOpen && (
            <div
              className="fixed inset-0 z-0"
              onClick={() => setIsDropdownOpen(false)}
            />
          )}

          {/* Loading State */}
          {loading && (
            <div className="mt-4 p-4 bg-gray-100 rounded-md">
              <p className="text-gray-600">Loading permissions...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mt-4 p-4 bg-red-100 rounded-md">
              <p className="text-red-600">Error loading permissions: {error}</p>
            </div>
          )}
        </div>
      </div>

      {/* <div className="mx-auto">
        <ReUsableTable
          columns={columns}
          data={permissions}
          title="Permissions Contents"
          isLoading={status === "loading"}
          // onRowDoubleClick={handleRowDoubleClick}
          showGlobalFilter={true}
          pageSizeOptions={[5, 10, 20, 50]}
          defaultPageSize={10}
          className="Permissions-table"
          enableSelection={false}
        />
      </div> */}
    </>
  )
}

export default Permissions
