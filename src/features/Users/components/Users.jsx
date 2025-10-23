import { useDispatch, useSelector } from "react-redux";
import ReUsableTable from "../../../resusableComponents/table/ReUsableTable";
import React, { useMemo, useState, useEffect, useCallback } from "react";
import UserForm from "./UserForm";
import Popup from "../../../globalComponents/Popup";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { fetchUsers } from "../usersThunks";
import { useTranslation } from "react-i18next";

function Users() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Get users data from Redux
  const { users, status, error } = useSelector((state) => state.usersReducer);

  // Fetch users only if status is idle (no data yet)
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchUsers());
    }
  }, [dispatch, status]);

  // Simplified refresh - just dispatch again
  const refreshUsersData = useCallback(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Handle Update User
  const handleUpdateUser = useCallback((userData) => {
    setSelectedUser(userData);
    setIsEditModalOpen(true);
  }, []);

  //Handle Delete User
  const handleDeleteUser = useCallback((userData) => {
    console.log("Delete user:", userData);
  }, []);

  // Handle User Created
  const handleUserCreated = useCallback(() => {
    setIsCreateModalOpen(false);
    refreshUsersData();
  }, [refreshUsersData]);

  // Handle Users Updated
  const handleUserUpdated = useCallback(() => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
    refreshUsersData();
  }, [refreshUsersData]);

  // Action Buttons
  const ActionButtons = useCallback(
    ({ user: userData }) => (
      <div className="flex items-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleUpdateUser(userData);
          }}
          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
          title={t("editUser")}
        >
          <Edit2 className="w-4 h-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteUser(userData);
          }}
          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
          title={t("deleteUser")}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ),
    [handleUpdateUser, handleDeleteUser]
  );

  const columns = useMemo(
    () => [
      {
        id: "userName",
        accessorKey: "userName",
        header: t("userName"),
        size: 150,
      },
      {
        id: "email",
        accessorKey: "email",
        header: t("email"),
        size: 200,
      },
      {
        id: "actions",
        accessorKey: "actions",
        header: t("actions"),
        size: 120,
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ row }) => <ActionButtons user={row.original} />,
      },
    ],
    [ActionButtons, t]
  );

  // Double Click
  const handleRowDoubleClick = useCallback((row) => {
    console.log("User selected! User ID:", row.original.id);
    console.log("Full user data:", row.original);
  }, []);

  // Handle  Create User
  const handleCreateClick = useCallback(() => {
    setIsCreateModalOpen(true);
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("users")}</h1>
          <p className="text-gray-600">{t("usersDescription")}</p>
        </div>
        <div>
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium  py-3 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
          >
            <Plus className="w-5 h-5" />
            {t("createNewUser")}
          </button>
        </div>
      </div>

      {/* Show error */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{t("error")}: {error}</p>
        </div>
      )}

      {/* Table */}
      <ReUsableTable
        columns={columns}
        data={users || []}
        title="Users"
        isLoading={status === "loading"}
        onRowDoubleClick={handleRowDoubleClick}
        showGlobalFilter={true}
        pageSizeOptions={[10, 15, 25, 50, 100]}
        defaultPageSize={10}
        className="users-table"
        enableSelection={false}
      />

      {/* Create User Form Popoup */}
      <Popup
        isOpen={isCreateModalOpen}
        setIsOpen={setIsCreateModalOpen}
        component={
          <UserForm
            onSuccess={handleUserCreated}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        }
      />
      {/* Update User Form Popup */}
      <Popup
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        component={
          <UserForm
            mode="edit"
            initialData={selectedUser}
            onSuccess={handleUserUpdated}
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedUser(null);
            }}
          />
        }
      />
    </div>
  );
}

export default React.memo(Users);
