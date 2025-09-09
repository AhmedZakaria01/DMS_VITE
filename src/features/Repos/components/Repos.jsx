import { useDispatch, useSelector } from "react-redux";
import ReUsableTable from "../../../resusableComponents/table/ReUsableTable";
import React, { useMemo, useEffect } from "react";
import { fetchUserRepos } from "../repoThunks";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

function Repos() {
  const { user } = useSelector((state) => state.authReducer);
  const { repos, status, error } = useSelector((state) => state.repoReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Fixed typo

  // Fetch User Repos
  useEffect(() => {
    // Only fetch if we haven't fetched yet or failed
    if (user.id && status === "idle") {
      dispatch(fetchUserRepos(user.id));
    }
  }, [dispatch, user.id, status]);
  // Define table columns using TanStack Table format
  const columns = useMemo(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "Repository Name",
      },
      // {
      //   id: "actions",
      //   accessorKey: "actions",
      //   header: "Actions",
      //   size: 120,
      //   enableSorting: false,
      //   enableColumnFilter: false,
      //   cell: ({ row }) => <ActionButtons role={row.original} />,
      // },
    ],
    []
  );

  const handleRowDoubleClick = (row) => {
    console.log("Row double-clicked! Row ID:", row.original.id);
    console.log("Full row data:", row.original);
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
          data={repos || []} // Use Redux state
          title="Repository Management"
          isLoading={status === "loading"} // Use Redux loading state
          onRowDoubleClick={handleRowDoubleClick}
          showGlobalFilter={true}
          pageSizeOptions={[5, 10, 20, 50]}
          defaultPageSize={10}
          className="repos-table"
          enableSelection={false}
        />
      </div>
    </section>
  );
}

export default React.memo(Repos);
