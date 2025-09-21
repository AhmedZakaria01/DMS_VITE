import { useDispatch, useSelector } from "react-redux";
import ReUsableTable from "../../../resusableComponents/table/ReUsableTable";
import React, { useMemo, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Plus, Folder, FileText } from "lucide-react";
import { fetchFolderContents } from "../folderContentsThunks";

function FolderContents() {
  const { folderContents, status, error } = useSelector(
    (state) => state.folderContentsReducer
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { repoId } = useParams();
  const location = useLocation();

  // Extract the folder path from the wildcard route
  const folderPath = location.pathname.split(
    `/repoContents/${repoId}/folderContent/`
  )[1];

  // Get current folder ID (the last segment of the path)
  const currentFolderId = folderPath ? folderPath.split("/").pop() : null;

  // Get folder navigation history and repository name from location state
  const folderHistory = location.state?.folderHistory || [];
  const repoName =
    location.state?.repoName || sessionStorage.getItem("currentRepoName");

  // Debug log to see what we're working with
  console.log("FolderContents - repoName:", repoName);
  console.log("FolderContents - location.state:", location.state);

  // Combine folders and documents into one array
  const folders_documents = useMemo(() => {
    const folders = (folderContents.folders || []).map((item) => ({
      ...item,
      type: "folder",
    }));

    const documents = (folderContents.documents || []).map((item) => ({
      ...item,
      type: "document",
    }));

    const combined = [...folders, ...documents];
    return combined;
  }, [folderContents]);

  // Fetch folder contents whenever currentFolderId changes
  useEffect(() => {
    if (repoId && currentFolderId) {
      dispatch(fetchFolderContents({ repoId, folderId: currentFolderId }));
    }
  }, [dispatch, repoId, currentFolderId]);

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

  const handleRowDoubleClick = (row) => {
    console.log("Full row data:", row.original);

    if (row.original.type === "folder") {
      console.log("Opening subfolder:", row.original.name);

      // Build nested path by appending the new folder ID
      const newPath = `/repoContents/${repoId}/folderContent/${folderPath}/${row.original.id}`;

      // Create updated folder history with the new folder
      const updatedFolderHistory = [
        ...folderHistory,
        {
          id: row.original.id,
          name: row.original.name,
          path: newPath,
        },
      ];

      console.log("Navigating to nested path:", newPath);
      console.log("Updated folder history:", updatedFolderHistory);

      // Navigate with folder history in state
      navigate(newPath, {
        state: {
          folderHistory: updatedFolderHistory,
          repoName: repoName, // Pass repository name along
        },
      });
    } else {
      console.log("Opening document:", row.original.name);
      navigate("/documentViewer");
    }
  };

  return (
    <section className="p-6">
      <div className="flex justify-between ">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Folder Contents
          </h1>
          <p className="text-gray-600">Browse folders and documents</p>
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
          data={folders_documents}
          title="Folder Contents"
          isLoading={status === "loading"}
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

export default React.memo(FolderContents);
