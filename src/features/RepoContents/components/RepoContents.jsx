import { useDispatch, useSelector } from "react-redux";
import ReUsableTable from "../../../resusableComponents/table/ReUsableTable";
import React, { useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Folder, FileText } from "lucide-react";
import { getRepoContents } from "../repoContentThunks";
import { clearRepoContents } from "../repoContentSlice";
import { useTranslation } from "react-i18next";

import usePermission from "../../auth/usePermission";

function RepoContents() {
  const { t } = useTranslation();
  const { repoContents, status, error } = useSelector(
    (state) => state.repoContentReducer
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { repoId } = useParams();

  // Check for CreateFolder permission
  const canCreateFolder = usePermission("folder.create");
  const canCreateDocument = usePermission("document.create");
  console.log(canCreateDocument);

  useEffect(() => {
    if (repoId) {
      // Clear old data first to prevent showing stale data
      dispatch(clearRepoContents());
      dispatch(getRepoContents(repoId));
      console.log("dispatched in Repo Content with:", { repoId });
    }
  }, [dispatch, repoId]);

  // ✅ Store repoId in localStorage when it becomes available
  useEffect(() => {
    if (repoId) {
      localStorage.setItem("repoId", repoId);
    }
  }, [repoId]);

  // Combine folders and documents into one array

  // Fetch User Repos
  useEffect(() => {
    if (status === "idle") {
      dispatch(getRepoContents(repoId));
    }
  }, [dispatch, status, repoId]);

  // Define table columns
  const columns = useMemo(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: t("name"),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {row.original.type === "Folder" ? (
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
              row.original.type === "Folder"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {row.original.type === "Folder" ? t("folder") : t("document")}
          </span>
        ),
      },
    ],
    [t]
  );

  const handleRowDoubleClick = (row) => {
    console.log("Full row data:", row.original);

    if (row.original.type === "Folder") {
      navigate(`/repoContents/${repoId}/folderContent/${row.original.id}`);
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
            {t("repoContentsTitle")}
          </h1>
          <p className="text-gray-600">{t("repoContentsDescription")}</p>
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
              {t("Create Document")}
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto">
        <ReUsableTable
          columns={columns}
          data={repoContents}
          title={t("repoContentsTitle")}
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

export default React.memo(RepoContents);
