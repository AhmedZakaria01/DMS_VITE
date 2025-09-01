import { useDispatch, useSelector } from "react-redux";
import ReUsableTable from "../../../resusableComponents/table/ReUsableTable";
import { useMemo, useState, useEffect } from "react";
import { fetchUserRepos } from "../repoThunks";

function Repos() {
  const [data, setData] = useState([]);
  const { user } = useSelector((state) => state.authReducer);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const repoData = await dispatch(fetchUserRepos(user.id));
        setData(repoData ? repoData.payload?.response : []);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch repos:", error);
        setLoading(false);
        setData([]);
      }
    };

    if (user.id) {
      fetchData();
    }
  }, [dispatch, user.id]);

  // Define table columns using TanStack Table format
  const columns = useMemo(
    () => [
      //   {
      //     id: "id",
      //     accessorKey: "id",
      //     header: "ID",
      //     size: 80,
      //   },
      {
        id: "name",
        accessorKey: "name",
        header: "Repository Name",
      },
    ],
    []
  );

  // Handle single click

  // Handle double click - this will log the row ID
  const handleRowDoubleClick = (row) => {
    console.log("Row double-clicked! Row ID:", row.original.id);
    console.log("Full row data:", row.original);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Repositories</h1>
        <p className="text-gray-600">Manage and explore your repositories</p>
      </div>
      {/* Log Data */}
      {console.log(data ? data : "")}
      <ReUsableTable
        columns={columns}
        data={data}
        title="Repository Management" // Table Name [Displayed]
        isLoading={loading}
        onRowDoubleClick={handleRowDoubleClick}
        showGlobalFilter={true}
        pageSizeOptions={[5, 10, 20, 50]}
        defaultPageSize={10}
        className="repos-table"
        enableSelection={false}
      />
    </div>
  );
}

export default Repos;
