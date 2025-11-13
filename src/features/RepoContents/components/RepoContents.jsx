import { useDispatch, useSelector } from "react-redux";
import ReUsableTable from "../../../resusableComponents/table/ReUsableTable";
import React, { useMemo, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Folder, FileText } from "lucide-react";
import { fetchRepoContents } from "../repoContentThunks";
import { useTranslation } from "react-i18next";

function RepoContents() {
  const { t } = useTranslation();
  const { repoContents, status, error } = useSelector(
    (state) => state.repoContentReducer
  );
  console.log(repoContents);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { repoId } = useParams();

  useEffect(() => {
    if (repoId) {
      dispatch(fetchRepoContents(repoId));
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
  const folders_documents = useMemo(() => {
    if (!repoContents) return [];

    const folders = (repoContents.folder || []).map((item) => ({
      ...item,
      type: "folder",
    }));

    const documents = (repoContents.document || []).map((item) => ({
      ...item,
      type: "document",
    }));

    // Combine arrays - folders first, then documents
    return [...folders, ...documents];
  }, [repoContents]);

  // Fetch User Repos
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchRepoContents(repoId));
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
    ],
    [t]
  );

  const handleRowDoubleClick = (row) => {
    console.log("Full row data:", row.original);

    if (row.original.type === "folder") {
      console.log("Opening folder:", row.original.name);

      const folderPath = `/repoContents/${repoId}/folderContent/${row.original.id}`;

      // Start folder history with the first folder
      const folderHistory = [
        {
          id: row.original.id,
          name: row.original.name,
          path: folderPath,
        },
      ];

      // Navigate with folder history
      navigate(folderPath, {
        state: { folderHistory },
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
            {t("repoContentsTitle")}
          </h1>
          <p className="text-gray-600">{t("repoContentsDescription")}</p>
        </div>
        <div>
          <button
            onClick={() => navigate(`/repoContents/${repoId}/createFolder`)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
            aria-label={t("createFolder")}
            title={t("createFolder")}
          >
            <Plus className="w-5 h-5" />
            {t("createFolder")}
          </button>
        </div>
      </div>

      <div className="mx-auto">
        <ReUsableTable
          columns={columns}
          data={folders_documents}
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
