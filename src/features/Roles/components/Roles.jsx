// import { useDispatch, useSelector } from "react-redux";
// import ReUsableTable from "../../../resusableComponents/table/ReUsableTable";
// import React, { useMemo, useState, useEffect, useCallback } from "react";
// import { useTranslation } from "react-i18next";
// import Popup from "../../../globalComponents/Popup";
// import { Plus, Edit2, Trash2 } from "lucide-react";
// import RoleForm from "./RoleForm";
// import { fetchRoles } from "../RolesThunks";

// function Roles() {
//   const dispatch = useDispatch();
//   const { t } = useTranslation();

//   // Modal states
//   const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [selectedRole, setselectedRole] = useState(null);

//   // Get users data from Redux
//   const { roles, status, error } = useSelector((state) => state.rolesReducer);

//   // Fetch users only if status is idle (no data yet)
//   useEffect(() => {
//     if (status === "idle") {
//       dispatch(fetchRoles());
//     }
//   }, [dispatch, status]);

//   // Simplified refresh - just dispatch again
//   const refreshRoleData = useCallback(() => {
//     dispatch(fetchRoles());
//   }, [dispatch]);

//   // Handle Update Role
//   const handleUpdateRole = useCallback((userData) => {
//     setselectedRole(userData);
//     setIsEditModalOpen(true);
//   }, []);

//   //Handle Delete Role
//   const handleDeleteRole = useCallback((userData) => {
//     console.log("Delete role:", userData);
//   }, []);

//   // Handle Role Created
//   const handleRoleCreated = useCallback(() => {
//     setIsCreateModalOpen(false);
//     refreshRoleData();
//   }, [refreshRoleData]);

//   // Handle Roles Updated
//   const handleRoleUpdated = useCallback(() => {
//     setIsEditModalOpen(false);
//     setselectedRole(null);
//     refreshRoleData();
//   }, [refreshRoleData]);

//   // Action Buttons
//   const ActionButtons = useCallback(
//     ({ role: userData }) => (
//       <div className="flex items-center gap-2">
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             handleUpdateRole(userData);
//           }}
//           className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
//           title={t("editRole")}
//         >
//           <Edit2 className="w-4 h-4" />
//         </button>

//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             handleDeleteRole(userData);
//           }}
//           className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
//           title={t("deleteRole")}
//         >
//           <Trash2 className="w-4 h-4" />
//         </button>
//       </div>
//     ),
//     [handleUpdateRole, handleDeleteRole]
//   );

//   const columns = useMemo(
//     () => [
//       {
//         id: "name",
//         accessorKey: "roleName",
//         header: t("name"),
//         size: 150,
//       },
//       {
//         id: "actions",
//         accessorKey: "actions",
//         header: t("actions"),
//         size: 120,
//         enableSorting: false,
//         enableColumnFilter: false,
//         cell: ({ row }) => <ActionButtons role={row.original} />,
//       },
//     ],
//     [ActionButtons]
//   );

//   // Double Click
//   const handleRowDoubleClick = useCallback((row) => {
//     console.log("Role selected! Role ID:", row.original.id);
//     console.log("Full role data:", row.original);
//   }, []);

//   // Handle  Create Role
//   const handleCreateClick = useCallback(() => {
//     setIsCreateModalOpen(true);
//   }, []);

//   return (
//     <section className="p-6">
//       <div className="flex justify-between items-">
//         <div className="mb-6">
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("rolesTitle")}</h1>
//           <p className="text-gray-600">{t("rolesDescription")}</p>
//         </div>

//         <div>
//           <button
//             onClick={handleCreateClick}
//             className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium  py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
//           >
//             <Plus className="w-5 h-5" />
//             {t("createNewRole")}
//           </button>
//         </div>
//       </div>

//       {/* Show error */}
//       {error && (
//         <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
//           <p className="text-red-600">{t("error")}: {error}</p>
//         </div>
//       )}

//       {/* Table */}
//       <div>
//         <ReUsableTable
//           columns={columns}
//           data={roles || []}
//           title={t("roles")}
//           isLoading={status === "loading"}
//           onRowDoubleClick={handleRowDoubleClick}
//           showGlobalFilter={true}
//           pageSizeOptions={[10, 15, 25, 50, 100]}
//           defaultPageSize={10}
//           className="users-table"
//           enableSelection={false}
//         />
//       </div>

//       {/* Create Role Form Popoup */}
//       <Popup
//         isOpen={isCreateModalOpen}
//         setIsOpen={setIsCreateModalOpen}
//         component={
//           <RoleForm
//             onSuccess={handleRoleCreated}
//             onCancel={() => setIsCreateModalOpen(false)}
//           />
//         }
//       />
//       {/* Update Role Form Popup */}
//       <Popup
//         isOpen={isEditModalOpen}
//         setIsOpen={setIsEditModalOpen}
//         component={
//           <RoleForm
//             mode="edit"
//             initialData={selectedRole}
//             onSuccess={handleRoleUpdated}
//             onCancel={() => {
//               setIsEditModalOpen(false);
//               setselectedRole(null);
//             }}
//           />
//         }
//       />
//     </section>
//   );
// }

// export default React.memo(Roles);

import { useDispatch, useSelector } from "react-redux";
import ReUsableTable from "../../../resusableComponents/table/ReUsableTable";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Popup from "../../../globalComponents/Popup";
import { Plus, Edit2, Trash2 } from "lucide-react";
import RoleForm from "./RoleForm";
import { fetchRoles } from "../RolesThunks";
import usePermission from "../../auth/usePermission";

function Roles() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Check for Create Role permission
  const canCreateRole = usePermission("screens.roles.create");
  const canEditRole = usePermission("screens.roles.edit");
  const canDeleteRole = usePermission("screens.roles.delete");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedRole, setselectedRole] = useState(null);

  // Get users data from Redux
  const { roles, status, error } = useSelector((state) => state.rolesReducer);

  // Fetch users only if status is idle (no data yet)
  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  // Simplified refresh - just dispatch again
  const refreshRoleData = useCallback(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  // Handle Update Role
  const handleUpdateRole = useCallback((userData) => {
    setselectedRole(userData);
    setIsEditModalOpen(true);
  }, []);

  //Handle Delete Role
  const handleDeleteRole = useCallback((userData) => {
    console.log("Delete role:", userData);
  }, []);

  // Handle Role Created
  const handleRoleCreated = useCallback(() => {
    setIsCreateModalOpen(false);
    refreshRoleData();
  }, [refreshRoleData]);

  // Handle Roles Updated
  const handleRoleUpdated = useCallback(() => {
    setIsEditModalOpen(false);
    setselectedRole(null);
    refreshRoleData();
  }, [refreshRoleData]);

  // Action Buttons
  const ActionButtons = useCallback(
    ({ role: userData }) => {
      // Check if user has any actions permissions
      const hasAnyActionPermission = canEditRole || canDeleteRole;
      if (!hasAnyActionPermission) {
        return null;
      }

      return (
        <div className="flex items-center gap-2">
          {canEditRole && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateRole(userData);
              }}
              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
              title={t("editRole")}
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {canDeleteRole && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteRole(userData);
              }}
              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
              title={t("deleteRole")}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      );
    },
    [canEditRole, canDeleteRole, handleUpdateRole, handleDeleteRole, t]
  );

  // Conditionally show actions column only if user has any actions permissions
  const columns = useMemo(() => {
    const baseColumns = [
      {
        id: "name",
        accessorKey: "roleName",
        header: t("name"),
        size: 150,
      },
    ];

    // Only add actions column if user has edit OR delete permissions
    if (canEditRole || canDeleteRole) {
      baseColumns.push({
        id: "actions",
        accessorKey: "actions",
        header: t("actions"),
        size: 120,
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ row }) => <ActionButtons role={row.original} />,
      });
    }

    return baseColumns;
  }, [ActionButtons, t, canEditRole, canDeleteRole]);

  // Double Click - You might want to conditionally handle this based on permissions too
  const handleRowDoubleClick = useCallback(
    (row) => {
      // Only allow double click action if user has edit permission
      if (canEditRole) {
        console.log("Role selected! Role ID:", row.original.id);
        console.log("Full role data:", row.original);
        // You could also automatically open edit modal on double click
        // handleUpdateRole(row.original);
      }
    },
    [canEditRole]
  );

  // Handle Create Role
  const handleCreateClick = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  return (
    <section className="p-6">
      <div className="flex justify-between items-">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("rolesTitle")}
          </h1>
          <p className="text-gray-600">{t("rolesDescription")}</p>
        </div>

        <div>
          {canCreateRole && (
            <button
              onClick={handleCreateClick}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium  py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
            >
              <Plus className="w-5 h-5" />
              {t("createNewRole")}
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div>
        <ReUsableTable
          columns={columns}
          data={roles || []}
          title={t("roles")}
          isLoading={status === "loading"}
          onRowDoubleClick={handleRowDoubleClick}
          showGlobalFilter={true}
          pageSizeOptions={[10, 15, 25, 50, 100]}
          defaultPageSize={10}
          className="users-table"
          enableSelection={false}
        />
      </div>

      {/* Create Role Form Popoup */}
      <Popup
        isOpen={isCreateModalOpen}
        setIsOpen={setIsCreateModalOpen}
        component={
          <RoleForm
            onSuccess={handleRoleCreated}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        }
      />
      {/* Update Role Form Popup */}
      <Popup
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        component={
          <RoleForm
            mode="edit"
            initialData={selectedRole}
            onSuccess={handleRoleUpdated}
            onCancel={() => {
              setIsEditModalOpen(false);
              setselectedRole(null);
            }}
          />
        }
      />
    </section>
  );
}

export default React.memo(Roles);
