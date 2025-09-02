// import { useDispatch, useSelector } from "react-redux";
// import ReUsableTable from "../../../resusableComponents/table/ReUsableTable";
// import React, { useMemo, useState, useEffect } from "react";
// import { fetchUsers } from "../usersThunks";
// import UserForm from "./UserForm";
// import Popup from "../../../globalComponents/Popup";
// import { Plus } from "lucide-react";

// function Users() {
//   const [data, setData] = useState([]);
//   const { user } = useSelector((state) => state.authReducer);
//   const dispatch = useDispatch();
//   const [loading, setLoading] = useState(true);

//   // Modal state
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   // Fetching Users Data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const usersData = await dispatch(fetchUsers());
//         setData(usersData ? usersData.payload : []);
//         setLoading(false);
//       } catch (error) {
//         console.error("Failed to fetch users:", error);
//         setLoading(false);
//         setData([]);
//       }
//     };

//     if (user.id) {
//       fetchData();
//     }
//   }, [dispatch, user.id]);

//   // Refresh users data after successful creation
//   const refreshUsersData = async () => {
//     try {
//       setLoading(true);
//       const usersData = await dispatch(fetchUsers());
//       setData(usersData ? usersData.payload : []);
//     } catch (error) {
//       console.error("Failed to refresh users:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle successful user creation
//   const handleUserCreated = () => {
//     setIsModalOpen(false);
//     refreshUsersData();
//     // You can add a success notification here if you have a toast system
//     // toast.success("User created successfully!");
//   };

//   // Table columns for users
//   const columns = useMemo(
//     () => [
//       {
//         id: "userName",
//         accessorKey: "userName",
//         header: "User Name",
//         size: 150,
//       },
//       {
//         id: "email",
//         accessorKey: "email",
//         header: "email",
//         size: 120,
//       },
//       {
//         id: "actions",
//         accessorKey: "actions",
//         header: "Actions",
//       },
//     ],
//     []
//   );

//   // Handle double click - view user details
//   const handleRowDoubleClick = (row) => {
//     console.log("User selected! User ID:", row.original.id);
//     console.log("Full user data:", row.original);
//     // You can add navigation or modal logic here to view full user details
//   };

//   // Handle create button click
//   const handleCreateClick = () => {
//     setIsModalOpen(true);
//   };

//   return (
//     <div className="p-6">
//       {/* Header Section */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900 mb-2">Users</h1>
//           <p className="text-gray-600">Manage and monitor system users</p>
//         </div>

//         {/* Create New User Button */}
//         <button
//           onClick={handleCreateClick}
//           className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
//         >
//           <Plus className="w-5 h-5" />
//           Create New User
//         </button>
//       </div>

//       {/* Table */}
//       <ReUsableTable
//         columns={columns}
//         data={data}
//         title="Users"
//         isLoading={loading}
//         onRowDoubleClick={handleRowDoubleClick}
//         showGlobalFilter={true}
//         pageSizeOptions={[10, 15, 25, 50, 100]}
//         defaultPageSize={15}
//         className="users-table"
//         enableSelection={false}
//       />

//       {/* Create User Modal */}
//       <Popup
//         isOpen={isModalOpen}
//         setIsOpen={setIsModalOpen}
//         component={
//           <UserForm
//             onSuccess={handleUserCreated}
//             onCancel={() => setIsModalOpen(false)}
//           />
//         }
//       />
//     </div>
//   );
// }

// export default React.memo(Users);

import { useDispatch, useSelector } from "react-redux";
import ReUsableTable from "../../../resusableComponents/table/ReUsableTable";
import React, { useMemo, useState, useEffect } from "react";
import { fetchUsers } from "../usersThunks";
import UserForm from "./UserForm";
import Popup from "../../../globalComponents/Popup";
import { Plus, Edit2, Trash2 } from "lucide-react";

function Users() {
  const [data, setData] = useState([]);
  const { user } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetching Users Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersData = await dispatch(fetchUsers());
        setData(usersData ? usersData.payload : []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch users:", error);
        setLoading(false);
        setData([]);
      }
    };

    if (user.id) {
      fetchData();
    }
  }, [dispatch, user.id]);

  // Refresh users data
  const refreshUsersData = async () => {
    try {
      setLoading(true);
      const usersData = await dispatch(fetchUsers());
      setData(usersData ? usersData.payload : []);
    } catch (error) {
      console.error("Failed to refresh users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle successful user creation/update
  const handleUserCreated = () => {
    setIsCreateModalOpen(false);
    refreshUsersData();
  };

  const handleUserUpdated = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
    refreshUsersData();
  };

  // Action handlers
  const handleUpdateUser = async (userData) => {
    try {
      console.log("Opening edit modal for user:", userData);
      setSelectedUser(userData);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Failed to open edit modal:", error);
    }
  };

  const handleDeleteUser = async (userData) => {
    console.log(userData);
  };

  // Action buttons component
  const ActionButtons = (userData) => (
    <div className="flex items-center gap-2">
      {/* Update Button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent row click
          handleUpdateUser(userData);
        }}
        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
        title="Edit user"
      >
        <Edit2 className="w-4 h-4" />
      </button>

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent row click
          handleDeleteUser(userData);
        }}
        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
        title="Delete user"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  // Table columns for users
  const columns = useMemo(
    () => [
      {
        id: "userName",
        accessorKey: "userName",
        header: "User Name",
        size: 150,
      },
      {
        id: "email",
        accessorKey: "email",
        header: "Email",
        size: 200,
      },
      {
        id: "actions",
        accessorKey: "actions",
        header: "Actions",
        size: 120,
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ row }) => <ActionButtons user={row.original} />,
      },
    ],
    [handleUpdateUser, handleDeleteUser]
  );

  // Handle double click - view user details
  const handleRowDoubleClick = (row) => {
    console.log("User selected! User ID:", row.original.id);
    console.log("Full user data:", row.original);
    // You can add navigation or modal logic here to view full user details
  };

  // Handle create button click
  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Users</h1>
          <p className="text-gray-600">Manage and monitor system users</p>
        </div>

        {/* Create New User Button */}
        <button
          onClick={handleCreateClick}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Create New User
        </button>
      </div>

      {/* Table */}
      <ReUsableTable
        columns={columns}
        data={data}
        title="Users"
        isLoading={loading}
        onRowDoubleClick={handleRowDoubleClick}
        showGlobalFilter={true}
        pageSizeOptions={[10, 15, 25, 50, 100]}
        defaultPageSize={10}
        className="users-table"
        enableSelection={false}
      />

      {/* Create User Modal */}
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

      {/* Edit User Modal */}
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
