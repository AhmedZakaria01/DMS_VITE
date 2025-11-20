/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import React, { useMemo, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Plus, Edit, Shield, Trash2, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import ReUsableTable from "../../resusableComponents/table/ReUsableTable";
import { fetchDocTypesByRepo } from "./DocTypeThunks";

function DocumentTypes() {
  const { t, i18n } = useTranslation();
  const { repoId } = useParams(); // Get repository ID from URL params
  const [isUpdateDetails, setIsUpdateDetails] = useState(false);
  const [selectedDocumentType, setSelectedDocumentType] = useState(null);
  const { docTypes, status, error } = useSelector(
    (state) => state.docTypeReducer
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAdmin } = useSelector((state) => state.authReducer);

  // Get repository name from sessionStorage or location state
  const repoName = sessionStorage.getItem("currentRepoName") || "Repository";

  // Apply RTL/LTR direction dynamically
  useEffect(() => {
    document.body.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  //   useEffect(() => {
  //     dispatch(clearDocumentTypes());
  //   }, [dispatch, user?.id, repoId]); // Clear when user changes or repo changes

  // Fetch Document Types for this repository
  useEffect(() => {
    if (repoId) {
      dispatch(fetchDocTypesByRepo(repoId));
    }
  }, [dispatch, repoId]);

  // Action button handlers
  const handleUpdateDetails = (documentType) => {
    console.log("Update details for:", documentType.name);
    setSelectedDocumentType(documentType.id);
    // Navigate to update details page or open modal
    navigate(`/updateDocType/${documentType.id}`);
    setIsUpdateDetails(true);
  };

  const handleUpdatePermissions = (documentType) => {
    console.log("Update permissions for:", documentType.name);
    // Navigate to permissions page or open modal
    navigate(`/documentTypes/${repoId}/${documentType.id}/permissions`);
  };

  const handleDelete = (documentType) => {
    console.log("Delete document type:", documentType.name);
    // Show confirmation dialog and handle delete
    if (
      window.confirm(t("system.confirmDelete", { name: documentType.name }))
    ) {
      // Dispatch delete action here
      // dispatch(deleteDocumentType(documentType.id));
    }
  };

  // Action Buttons Component
  const ActionButtons = ({ documentType }) => (
    <div className="flex gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleUpdateDetails(documentType);
        }}
        className="p-2 flex justify-center items-center gap-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
        title={t("update")}
      >
        <p>{t("update")}</p>
        <Edit className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleUpdatePermissions(documentType);
        }}
        className="p-2 flex justify-center items-center gap-3 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors duration-200"
        title={t("managePermissions")}
      >
        <p>{t("managePermissions")}</p>
        <Shield className="w-4 h-4" />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleDelete(documentType);
        }}
        className="p-2 flex justify-center items-center gap-3 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors duration-200"
        title={t("delete")}
      >
        <p>{t("delete")}</p>
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
        header: t("documentTypeName"),
      },
      {
        id: "description",
        accessorKey: "description",
        header: t("description"),
      },
      {
        id: "actions",
        accessorKey: "actions",
        header: t("actions"),
        size: 140,
        enableSorting: false,
        enableColumnFilter: false,
        cell: ({ row }) => <ActionButtons documentType={row.original} />,
      },
    ],
    [t]
  );

  const handleRowDoubleClick = (row) => {
    console.log("Full row data:", row.original);

    // Store document type information in sessionStorage
    sessionStorage.setItem("currentDocumentTypeName", row.original.name);
    sessionStorage.setItem("currentDocumentTypeId", row.original.id);

    // Navigate to document type contents/documents
    if (isAdmin) {
      navigate(`/documents/${repoId}/${row.original.id}`, {
        state: {
          repoName: repoName,
          documentTypeName: row.original.name,
        },
      });
    }
  };

  const handleBackToRepos = () => {
    navigate("/");
  };

  return (
    <section className="p-6">
      {/* Breadcrumb navigation */}
      <div className="mb-4">
        <button
          onClick={handleBackToRepos}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToRepositories")}
        </button>
        <nav className="text-sm text-gray-600 mt-2">
          <span>{t("repositories")}</span>
          <span className="mx-2">/</span>
          <span className="font-medium">{repoName}</span>
          <span className="mx-2">/</span>
          <span>{t("documentTypes")}</span>
        </nav>
      </div>

      <div className="flex justify-between">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("documentTypes")}
          </h1>

        </div>
        <div>
          <button
            onClick={() => navigate(`/createDocumentType/${repoId}`)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
          >
            <Plus className="w-5 h-5" />
            {t("createDocumentType")}
          </button>
        </div>
      </div>

      <div className="mx-auto">
        <ReUsableTable
          columns={columns}
          data={docTypes || []}
          title={t("documentTypesManagement")}
          isLoading={status === "loading"}
          onRowDoubleClick={handleRowDoubleClick}
          showGlobalFilter={true}
          pageSizeOptions={[5, 10, 20, 50]}
          defaultPageSize={10}
          className="document-types-table"
          enableSelection={false}
        />
      </div>
    </section>
  );
}

export default React.memo(DocumentTypes);
