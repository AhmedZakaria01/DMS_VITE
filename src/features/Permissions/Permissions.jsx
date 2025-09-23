import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux"
import { fetchPermissions } from "./permissionsThunks";
import ReUsableTable from "../../resusableComponents/table/ReUsableTable";
import { FileText, Folder } from "lucide-react";

function Permissions() {
    const dispatch=useDispatch();
    const {permissions}=useSelector((state)=> state.permissionsReducer )
    useEffect(() => {
        dispatch(fetchPermissions());
    }, [dispatch]);

    useEffect(() => {
        console.log("Permissions data:", permissions);
    }, [permissions]);
 // Define table columns
  const columns = useMemo(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {row.original.type === "folder" ? (
              <Folder className="w-5 h-5 text-blue-500" />
            ) : (
              <FileText className="w-5 h-5 text-gray-500" />
            )}
            <span className="font-medium">{row.original.name}</span>
          </div>
        ),
      },
      {
        id: "type",
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              row.original.type === "folder"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {row.original.type === "folder" ? "Folder" : "Document"}
          </span>
        ),
      },
    ],
    []
  );
    return (
    <div>
      Permissions
       <div className="mx-auto">
        {/* <ReUsableTable
          columns={columns}
          data={folders_documents}
          title="Repository Contents"
          isLoading={status === "loading"}
          onRowDoubleClick={handleRowDoubleClick}
          showGlobalFilter={true}
          pageSizeOptions={[5, 10, 20, 50]}
          defaultPageSize={10}
          className="repos-table"
          enableSelection={false}
        /> */}
      </div>
    </div>
  )
}

export default Permissions
