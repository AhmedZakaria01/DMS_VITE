import { useDispatch, useSelector } from "react-redux";
import ReUsableTable from "../../../resusableComponents/table/ReUsableTable";
import React, { useMemo, useEffect, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Plus, Folder, FileText, Edit, Trash2, Shield } from "lucide-react";
import { fetchFolderContents } from "../folderContentsThunks";
import { clearFolderContents } from "../folderContentsSlice";
import { useTranslation } from "react-i18next";
import usePermission from "../../auth/usePermission";

function FolderContents() {
  const { t } = useTranslation();
  const { folderContents, status, error } = useSelector(
    (state) => state.folderContentsReducer
  );

  // Check for permissions
  const canCreateFolder = usePermission("folder.create");
  const canCreateDocument = usePermission("document.create");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { repoId, folderId } = useParams();
  const location = useLocation();

  // Extract the folder path from the wildcard route
  const folderPath = location.pathname.split(
    `/repoContents/${repoId}/folderContent/`
  )[1];

  // Get current folder ID (the last segment of the path)
  // Use folderId from params as fallback if folderPath extraction fails
  const currentFolderId = folderPath ? folderPath.split("/").pop() : folderId;

  // Get folder navigation history and repository name from location state
  const folderHistory = location.state?.folderHistory || [];
  const repoName =
    location.state?.repoName || sessionStorage.getItem("currentRepoName");

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

  console.log(currentFolderId);

  // Fetch folder contents whenever currentFolderId changes
  useEffect(() => {
    if (repoId && currentFolderId) {
      // Clear old data first to prevent showing stale data
      dispatch(clearFolderContents());
      dispatch(fetchFolderContents({ currentFolderId }));
    }
  }, [dispatch, repoId, currentFolderId]);

  // Action handlers
  const handleEdit = useCallback(
    (item) => {
      console.log("Edit item:", item);
      // Navigate to edit page based on type
      if (item.type === "folder") {
        // Navigate to edit folder
        navigate(`/repoContents/${repoId}/editFolder/${item.id}`);
      } else {
        // Navigate to edit document
        navigate(`/editDocument/${item.id}`);
      }
    },
    [navigate, repoId]
  );

  const handleDelete = useCallback(
    (item) => {
      console.log("Delete item:", item);
      const itemType = item.type === "folder" ? t("folder") : t("document");
      if (
        window.confirm(
          t("system.confirmDelete", { name: item.name }) ||
            `Are you sure you want to delete this ${itemType}?`
        )
      ) {
        // Dispatch delete action here
        // dispatch(deleteItem(item.id, item.type));
      }
    },
    [t]
  );

  const handleManagePermissions = useCallback(
    (item) => {
      console.log("Manage permissions for:", item);
      // Navigate to permissions page based on type
      if (item.type === "folder") {
        navigate(`/folders/${item.id}/permissions`);
      } else {
        navigate(`/documents/${item.id}/permissions`);
      }
    },
    [navigate]
  );

  // Action Buttons Component
  const ActionButtons = useCallback(
    ({ item }) => {
      // console.log(item);

      return (
        <div className="flex gap-2">
          {item.canEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleEdit(item);
              }}
              className="p-2 flex justify-center items-center gap-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title={t("edit")}
            >
              <p>{t("edit")}</p>
              <Edit className="w-4 h-4" />
            </button>
          )}

          {item.canManagePermissions && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleManagePermissions(item);
              }}
              className="p-2 flex justify-center items-center gap-3 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors duration-200"
              title={t("managePermissions")}
            >
              <p>{t("managePermissions")}</p>
              <Shield className="w-4 h-4" />
            </button>
          )}

          {item.canDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(item);
              }}
              className="p-2 flex justify-center items-center gap-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
              title={t("delete")}
            >
              <p>{t("delete")}</p>
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      );
    },
    [handleEdit, handleDelete, handleManagePermissions, t]
  );

  // Define table columns
  const columns = useMemo(() => {
    const baseColumns = [
      {
        id: "name",
        accessorKey: "name",
        header: t("name"),
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
        header: t("type"),
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              row.original.type === "folder"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {row.original.type === "folder" ? t("folder") : t("document")}
          </span>
        ),
      },
    ];

    baseColumns.push({
      id: "actions",
      accessorKey: "actions",
      header: t("actions"),
      size: 120,
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ row }) => <ActionButtons item={row.original} />,
    });

    return baseColumns;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            {t("folderContentsTitle")}
          </h1>
          <p className="text-gray-600">{t("folderContentsDescription")}</p>
        </div>
        <div className="flex items-center gap-3">
          {!canCreateFolder && (
            <button
              onClick={() => navigate(`/repoContents/${repoId}/createFolder`)}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2 whitespace-nowrap"
              aria-label={t("createFolder")}
              title={t("createFolder")}
            >
              <Plus className="w-5 h-5" />
              {t("createFolder")}
            </button>
          )}

          {!canCreateDocument && (
            <button
              onClick={() => navigate(`/createDocument`)}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2 whitespace-nowrap"
              aria-label={t("createDocument")}
              title={t("createDocument")}
            >
              <Plus className="w-5 h-5" />
              {t("Create Document ")}
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto">
        <ReUsableTable
          columns={columns}
          data={folders_documents}
          title={t("folderContentsTitle")}
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
