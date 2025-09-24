import { useCallback, useEffect, useMemo, useState } from "react";
import ReUsableTable from "../../resusableComponents/table/ReUsableTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoles } from "../Roles/RolesThunks";
import { fetchUsers } from "../Users/usersThunks";
import Permissions from "./Permissions"; 

function UsersRolesPermissionsTable() {
  const dispatch = useDispatch();
  const [activeTable, setActiveTable] = useState("users");

  const { roles, status: rolesStatus } = useSelector((state) => state.rolesReducer);
  const { users, status: usersStatus } = useSelector((state) => state.usersReducer);

  useEffect(() => {
    if (rolesStatus === "idle") dispatch(fetchRoles());
    if (usersStatus === "idle") dispatch(fetchUsers());
  }, [dispatch, rolesStatus, usersStatus]);

  const handleRowDoubleClickRoles = useCallback((row) => {
    console.log("Role selected! Role ID:", row.original.id);
  }, []);

  const handleRowDoubleClickUsers = useCallback((row) => {
    console.log("User selected! User ID:", row.original.id);
  }, []);

  const handleUserPermissionsChange = useCallback((userId, selectedPermissions) => {
    console.log("User ID:", userId, "Selected Permissions:", selectedPermissions);
  }, []);

  const handleRolePermissionsChange = useCallback((roleId, selectedPermissions) => {
    console.log("Role ID:", roleId, "Selected Permissions:", selectedPermissions);
  }, []);

  // Enhanced columns definition with better sizing
  const rolesColumns = useMemo(() => [
    { 
      id: "name", 
      accessorKey: "roleName", 
      header: "Role Name", 
      size: 150,
      minSize: 120
    },
    { 
      id: "permissions", 
      accessorKey: "permissions", 
      header: "Permissions", 
      size: 300,
      minSize: 250,
      cell: ({ row }) => (
        <div className="py-2 min-h-[60px] flex items-center">
          <div className="w-full">
            <Permissions
              targetId={row.original.id}
              targetType="role"
              onPermissionsChange={handleRolePermissionsChange}
              initialSelectedPermissions={row.original.permissions || []}
            />
          </div>
        </div>
      )
    },
  ], [handleRolePermissionsChange]);

  const usersColumns = useMemo(() => [
    { 
      id: "userName", 
      accessorKey: "userName", 
      header: "Username", 
      size: 150,
      minSize: 120
    },
    { 
      id: "email", 
      accessorKey: "email", 
      header: "Email", 
      size: 180,
      minSize: 150
    },
    { 
      id: "permissions", 
      accessorKey: "permissions", 
      header: "Permissions", 
      size: 300,
      minSize: 250,
      cell: ({ row }) => (
        <div className="py-2 min-h-[60px] flex items-center">
          <div className="w-full">
            <Permissions
              targetId={row.original.id}
              targetType="user"
              onPermissionsChange={handleUserPermissionsChange}
              initialSelectedPermissions={row.original.permissions || []}
            />
          </div>
        </div>
      )
    },
  ], [handleUserPermissionsChange]);

  const currentData = activeTable === "users" ? users || [] : roles || [];
  const currentColumns = activeTable === "users" ? usersColumns : rolesColumns;
  const currentStatus = activeTable === "users" ? usersStatus : rolesStatus;
  const currentDoubleClick = activeTable === "users" ? handleRowDoubleClickUsers : handleRowDoubleClickRoles;

  return ( 
    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 max-w-full overflow-hidden">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {activeTable === "users" ? "Users Management" : "Roles Management"}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {activeTable === "users" 
                ? "Manage user permissions and access rights" 
                : "Configure role-based permissions and access levels"
              }
            </p>
          </div>
        </div>
        
        {/* Enhanced Toggle Button Group */}
        <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
          <button
            onClick={() => setActiveTable("users")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTable === "users" 
                ? "bg-blue-600 text-white shadow-sm" 
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Users
          </button>
          <button
            onClick={() => setActiveTable("roles")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              activeTable === "roles" 
                ? "bg-blue-600 text-white shadow-sm" 
                : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Roles
          </button>
        </div>
      </div>
      {/* Statistics Cards */}
      {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 font-medium">Total {activeTable === "users" ? "Users" : "Roles"}</p>
              <p className="text-2xl font-bold text-blue-800">
                {currentData.length}
              </p>
            </div>
            <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 font-medium">Active</p>
              <p className="text-2xl font-bold text-green-800">
                {currentData.filter(item => item.status !== 'inactive').length}
              </p>
            </div>
            <div className="w-10 h-10 bg-green-200 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 font-medium">With Permissions</p>
              <p className="text-2xl font-bold text-purple-800">
                {currentData.filter(item => item.permissions && item.permissions.length > 0).length}
              </p>
            </div>
            <div className="w-10 h-10 bg-purple-200 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        </div>
      </div> */}

      {/* Table Container with Enhanced Styling */}
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
        <ReUsableTable
          columns={currentColumns}
          data={currentData}
          title={`${activeTable === "users" ? "Users" : "Roles"} List`}
          isLoading={currentStatus === "loading"}
          onRowDoubleClick={currentDoubleClick}
          showGlobalFilter={true}
          pageSizeOptions={[5, 10, 15, 25, 50]}
          defaultPageSize={10}
          className={`${activeTable}-permissions-table`}
          enableSelection={false}
          tableClassName="min-w-full"
          // Enhanced table styling
          rowClassName="hover:bg-gray-50 transition-colors duration-150"
          headerClassName="bg-gradient-to-r from-gray-50 to-gray-100 text-sm font-semibold text-gray-700 border-b border-gray-200"
          cellClassName="text-sm py-3 px-4"
        />
      </div>
    </div> 
  );
}

export default UsersRolesPermissionsTable;