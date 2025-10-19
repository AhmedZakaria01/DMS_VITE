/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import ReUsableTable from "../../../resusableComponents/table/ReUsableTable";
import React, { useMemo, useEffect, useState } from "react";
import { fetchAllRepos, fetchUserRepos } from "../repoThunks";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Shield, Trash2 } from "lucide-react";
import Popup from "../../../globalComponents/Popup";
import UserForm from "../../Users/components/UserForm";
import RepoForm from "./RepoForm";
import UpdateRepo from "./UpdateRepo";
import { id } from "zod/v4/locales";

function Repos() {
  const [isUpdateDetails, setIsUpdateDetails] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const { user } = useSelector((state) => state.authReducer);
  const { repos, status, error } = useSelector((state) => state.repoReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch All Repos
  useEffect(() => {
// Only fetch if we haven't fetched yet or failed
if (status === "idle") {
  dispatch(fetchAllRepos());
}
}, [dispatch, status]);






//////////////////////marwa////////////////////////////
// useEffect(() => {
// //marwa////////////////////////////////
// console.log(dispatch(fetchUserRepos()));
// ////////////////////////////////
// }, [dispatch])
// console.log('====================================');
// console.log("Repos dataaaa:", repos);
// console.log('====================================');

///////////////////////////////////////////////////////
  // Action button handlers
  const handleUpdateDetails = (repo) => {
    console.log("Update details for:", repo.name);
    setSelectedRepo(repo.id);
    // Navigate to update details page or open modal
    navigate(`/repos/${repo.id}/update-details`);

    setIsUpdateDetails(true);
  };

  const handleUpdatePermissions = (repo) => {
    console.log("Update permissions for:", repo.name);
    // Navigate to permissions page or open modal
    navigate(`/repos/${repo.id}/permissions`);
  };

  const handleDelete = (repo) => {
    console.log("Delete repo:", repo.name);
    // Show confirmation dialog and handle delete
    if (window.confirm(`Are you sure you want to delete "${repo.name}"?`)) {
      // Dispatch delete action here
      // dispatch(deleteRepo(repo.id));
    }
  };

  // Action Buttons Component
  const ActionButtons = ({ repo }) => (
    <div className="flex gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleUpdateDetails(repo);
        }}
        className="p-2 flex justify-center items-center gap-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
        title="Update Details"
      >
        <p> Update Details </p>
        <Edit className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleUpdatePermissions(repo);
        }}
        className="p-2 flex justify-center items-center gap-3 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors duration-200"
        title="Update Permissions"
      >
        <p> Update Permissions </p>
        <Shield className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(repo);
        }}
        className="p-2 flex justify-center items-center gap-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
        title="Delete Repository"
      >
        <p> Delete </p>
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  // Define table columns using TanStack Table format
  const columns = useMemo(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "Repository Name",
      },
      {
        id: "actions",
        accessorKey: "actions",
        header: "Actions",
        size: 140,
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ row }) => <ActionButtons repo={row.original} />,
      },
    ],
    []
  );

  const handleRowDoubleClick = (row) => {
    console.log("Full row data:", row.original);

    // Store repository name in sessionStorage
    sessionStorage.setItem("currentRepoName", row.original.name);

    // Navigate to repository contents and pass the repository name
    navigate(`/repoContents/${row.original.id}`, {
      state: { repoName: row.original.name }, // Keep this for immediate access
    });
  };
  

  return (
    <section className="p-6">
      <div className="flex justify-between ">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Repositories
          </h1>
          <p className="text-gray-600">Manage and explore your repositories</p>
        </div>
        <div>
          <button
            onClick={() => navigate("/createRepo")}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
          >
            <Plus className="w-5 h-5" />
            Create Repository
          </button>
        </div>
      </div>

      <div className="mx-auto">
        <ReUsableTable
          columns={columns}
          data={repos || []}
          title="Repository Management"
          isLoading={status === "loading"}
          onRowDoubleClick={handleRowDoubleClick}
          showGlobalFilter={true}
          pageSizeOptions={[5, 10, 20, 50]}
          defaultPageSize={10}
          className="repos-table"
          enableSelection={false}
        />
        {console.log("Repos data:", repos)}
      </div>
    </section>
  );
}

export default React.memo(Repos);
