/* eslint-disable react/prop-types */
import { useDispatch, useSelector } from "react-redux";
import ReUsableTable from "../../../resusableComponents/table/ReUsableTable";
import React, { useMemo, useEffect, useState, useCallback } from "react";
import { fetchAllRepos } from "../repoThunks";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit,
  Shield,
  Trash2,
  Warehouse,
  WarehouseIcon,
} from "lucide-react";
// import Popup from "../../../globalComponents/Popup";
// import UserForm from "../../Users/components/UserForm";
// import RepoForm from "./RepoForm";
// import UpdateRepo from "./UpdateRepo";
// import { id } from "zod/v4/locales";import { useTranslation } from "react-i18next";
import { clearRepos } from "../repoSlice";
import usePermission from "../../auth/usePermission";
import { useTranslation } from "react-i18next";

function Repos() {
  const { t, i18n } = useTranslation();
  // Check for permissions
  const canCreateRepo = usePermission("screens.repositories.create");
  const canEditRepo = usePermission("screens.repositories.edit");
  const canDeleteRepo = usePermission("screens.repositories.delete");
  const canManagePermissions = usePermission(
    "screens.repositories.permissions"
  );

  const [isUpdateDetails, setIsUpdateDetails] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const { repos, status, error } = useSelector((state) => state.repoReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.authReducer);

  // Apply RTL/LTR direction dynamically
  useEffect(() => {
    document.body.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  useEffect(() => {
    dispatch(clearRepos());
  }, [dispatch, user?.id]);

  // Fetch All Repos
  useEffect(() => {
    dispatch(fetchAllRepos());
  }, [dispatch]);

  // Action button handlers
  const handleUpdateDetails = useCallback(
    (repo) => {
      console.log("Update details for:", repo.name);
      setSelectedRepo(repo.id);
      navigate(`/repos/${repo.id}/update-details`);
      setIsUpdateDetails(true);
    },
    [navigate]
  );

  const handleUpdatePermissions = useCallback(
    (repo) => {
      console.log("Update permissions for:", repo.name);
      navigate(`/repos/${repo.id}/permissions`);
    },
    [navigate]
  );

  const handleDelete = useCallback(
    (repo) => {
      console.log("Delete repo:", repo.name);
      if (window.confirm(t("system.confirmDelete", { name: repo.name }))) {
        // Dispatch delete action here
        // dispatch(deleteRepo(repo.id));
      }
    },
    [t]
  );

  // Action Buttons Component with permission checks
  const ActionButtons = useCallback(
    ({ repo }) => {
      return (
        <div className="flex gap-2">
          {repo.canEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUpdateDetails(repo);
              }}
              className="p-2 flex justify-center items-center gap-3 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors duration-200"
              title={t("update")}
            >
              <p>{t("update")}</p>
              <Edit className="w-4 h-4" />
            </button>
          )}

          {repo.canManagePermissions && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUpdatePermissions(repo);
              }}
              className="p-2 flex justify-center items-center gap-3 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-lg transition-colors duration-200"
              title={t("managePermissions")}
            >
              <p>{t("managePermissions")}</p>
              <Shield className="w-4 h-4" />
            </button>
          )}
          {console.log(repo)}
          {repo.canDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(repo);
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
    [handleUpdateDetails, handleUpdatePermissions, handleDelete, t]
  );

  // Conditionally show actions column only if user has any actions permissions
  const columns = useMemo(() => {
    const baseColumns = [
      {
        id: "name",
        accessorKey: "name",
        header: t("repositoryName"),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Warehouse className="w-5 h-5 text-indigo-500" />
            <span className="font-medium">{row.original.name}</span>
          </div>
        ),
      },
    ];

    // Only add actions column if user has any action permissions

    baseColumns.push({
      id: "actions",
      accessorKey: "actions",
      header: t("actions"),
      size: 140,
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ row }) => <ActionButtons repo={row.original} />,
    });

    return baseColumns;
  }, []);

  const { isAdmin } = useSelector((state) => state.authReducer);

  const handleRowDoubleClick = useCallback(
    (row) => {
      console.log("Full row data:", row.original);

      // Store repository name in sessionStorage
      sessionStorage.setItem("currentRepoName", row.original.name);

      if (isAdmin) {
        // Navigate to Document Type for Admins
        navigate(`/documentTypes/${row.original.id}`, {
          state: { repoName: row.original.name },
        });
      } else {
        // Navigate to Create Folder for non-Admins
        navigate(`/repoContents/${row.original.id} `, {
          state: { repoName: row.original.name },
        });
      }
    },
    [navigate, isAdmin]
  );

  return (
    <section className="p-6">
      <div className="flex justify-between ">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("repositories")}
          </h1>
          <p className="text-gray-600">{t("reposDescription")}</p>
        </div>
        <div className="flex items-center gap-3">
          {canCreateRepo && (
            <button
              onClick={() => navigate("/createRepo")}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
            >
              <WarehouseIcon className="w-5 h-5 mx-3" />
              {t("createRepository")}
            </button>
          )}
        </div>
      </div>

      <div className="mx-auto">
        <ReUsableTable
          columns={columns}
          data={repos || []}
          title={t("Repositories")}
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

export default React.memo(Repos);
