/* eslint-disable react/prop-types */
import { useCallback, useEffect, useMemo, useState } from "react";
import ReUsableTable from "../../resusableComponents/table/ReUsableTable";
import { useDispatch, useSelector } from "react-redux";
import Permissions from "./Permissions";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { fetchPrinciples } from "./permissionsThunks";

// Access Type Cell Component
const AccessTypeCell = ({
  row,
  type,
  dataChanges,
  handleAccessTypeChange,
  getRowId,
  getOriginalAccessType,
  t,
}) => {
  const tableType = type === "user" ? "users" : "roles";
  const rowId = getRowId(row);
  const currentData = dataChanges[tableType]?.[rowId];

  const isChecked =
    currentData?.accessType !== undefined
      ? currentData.accessType === 1
      : getOriginalAccessType(row.original) === 1;

  const handleToggle = (checked) => {
    if (rowId) {
      const accessTypeValue = checked ? 1 : 0;
      handleAccessTypeChange(rowId, accessTypeValue, type);
    }
  };

  if (!rowId) {
    return <div className="text-red-500 text-sm">{t("noIdFound")}</div>;
  }

  return (
    <div className="flex items-center justify-center">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => handleToggle(e.target.checked)}
          className="sr-only peer"
        />
        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        <span className="ml-3 text-sm font-medium text-gray-700">
          {isChecked ? t("allow") : t("deny")}
        </span>
      </label>
    </div>
  );
};

// Security Level Cell Component
const SecurityLevelCell = ({
  row,
  type,
  dataChanges,
  handleSecurityLevelChange,
  getRowId,
  getOriginalClearanceLevel,
  t,
}) => {
  const tableType = type === "user" ? "users" : "roles";
  const rowId = getRowId(row);
  const currentData = dataChanges[tableType]?.[rowId];
  const initialValue = currentData
    ? currentData.clearanceLevel
    : getOriginalClearanceLevel(row.original);

  const [value, setValue] = useState(initialValue ?? "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (rowId) {
      const newValue =
        dataChanges[tableType]?.[rowId]?.clearanceLevel ??
        getOriginalClearanceLevel(row.original);
      setValue(newValue ?? "");
    }
  }, [
    dataChanges[tableType]?.[rowId]?.clearanceLevel,
    rowId,
    tableType,
    row.original.clearanceLevel,
    dataChanges,
    getOriginalClearanceLevel,
  ]);

  const handleChange = useCallback(
    (e) => {
      const inputValue = e.target.value;
      setValue(inputValue);

      if (inputValue === "") {
        setError("");
        return;
      }

      const numValue = parseInt(inputValue, 10);
      if (isNaN(numValue)) {
        setError(t("numbersOnly"));
        return;
      }
      if (numValue < 0 || numValue > 99) {
        setError(t("range0to99"));
        return;
      }
      setError("");
    },
    [t]
  );

  const handleBlur = useCallback(() => {
    if (value === "") return;

    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 0 || numValue > 99) {
      const defaultValue = getOriginalClearanceLevel(row.original);
      setValue(defaultValue ?? "");
      setError("");
      return;
    }

    if (rowId) {
      handleSecurityLevelChange(rowId, numValue, type);
    }
    setError("");
  }, [
    value,
    rowId,
    type,
    handleSecurityLevelChange,
    getOriginalClearanceLevel,
    row.original,
  ]);

  if (!rowId) {
    return <div className="text-red-500 text-sm">{t("noIdFound")}</div>;
  }

  return (
    <div className="flex flex-col items-center">
      <input
        key={`security-level-${rowId}-${tableType}`}
        type="number"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        min="0"
        max="99"
        className={`w-20 px-2 py-1 text-center border rounded-md focus:outline-none focus:ring-2 transition-colors ${
          error
            ? "border-red-300 focus:ring-red-500 focus:border-red-500"
            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        }`}
        placeholder={t("range0to99")}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
};

function UsersRolesPermissionsTable({ onDone, savedData, entityType }) {
  const dispatch = useDispatch();
  const [activeTable, setActiveTable] = useState("users");
  const { t } = useTranslation();
  const { repoId } = useParams();

  const [dataChanges, setDataChanges] = useState(() => {
    if (
      savedData &&
      (savedData.clearanceRules?.length > 0 || savedData.aclRules?.length > 0)
    ) {
      const initialState = { users: {}, roles: {} };

      savedData.clearanceRules?.forEach((rule) => {
        const tableType = rule.principalType === "user" ? "users" : "roles";
        initialState[tableType][rule.principalId] = {
          ...initialState[tableType][rule.principalId],
          principalId: rule.principalId,
          principalType: rule.principalType,
          [rule.principalType === "user" ? "userName" : "roleName"]:
            rule.userName || rule.roleName || "",
          clearanceLevel: rule.clearanceLevel,
        };
      });

      savedData.aclRules?.forEach((rule) => {
        const tableType = rule.principalType === "user" ? "users" : "roles";
        initialState[tableType][rule.principalId] = {
          ...initialState[tableType][rule.principalId],
          principalId: rule.principalId,
          principalType: rule.principalType,
          [rule.principalType === "user" ? "userName" : "roleName"]:
            rule.userName || rule.roleName || "",
          permissions: rule.permissions || [],
          accessType:
            rule.accessType === "Deny" ||
            rule.accessType === "deny" ||
            rule.accessType === 0
              ? 0
              : 1,
        };
      });

      return initialState;
    }
    return { users: {}, roles: {} };
  });

  // Updated selector - make sure this matches your actual Redux state structure
  const principlesState = useSelector((state) => state.permissionsReducer);

  // Extract principles data - adjust this path based on your actual state structure
  const principles =
    principlesState?.principles ||
    principlesState?.data ||
    principlesState?.response ||
    [];
  const principlesStatus = principlesState?.status || "idle";

  const users = useMemo(() => {
    const filteredUsers = principles.filter((principle) => {
      const isUser = principle?.type === "User";

      return isUser;
    });

    return filteredUsers;
  }, [principles]);

  const roles = useMemo(() => {
    if (!Array.isArray(principles)) {
      console.log(
        "❌ Principles is not an array:",
        typeof principles,
        principles
      );
      return [];
    }

    const filteredRoles = principles.filter((principle) => {
      const isRole = principle?.type === "Role";

      return isRole;
    });

    return filteredRoles;
  }, [principles]);

  useEffect(() => {
    if (principlesStatus === "idle" && repoId) {
      dispatch(fetchPrinciples(repoId));
    }
  }, [dispatch, principlesStatus, repoId]);

  // Debug current data

  const getRowId = (row) => row.original.id || row.original._id;

  const getOriginalAccessType = (item) => {
    return item.accessType === false ||
      item.accessType === "disabled" ||
      item.accessType === "Deny" ||
      item.accessType === "deny" ||
      item.accessType === 0
      ? 0
      : 1;
  };

  const getOriginalClearanceLevel = (item) => {
    return typeof item.clearanceLevel === "number" ? item.clearanceLevel : null;
  };

  const handleRowDoubleClickRoles = useCallback((row) => {
    const roleId = getRowId(row);
    console.log(
      "Role selected! Role ID:",
      roleId,
      "Full row data:",
      row.original
    );
  }, []);

  const handleRowDoubleClickUsers = useCallback((row) => {
    const userId = getRowId(row);
    console.log(
      "User selected! User ID:",
      userId,
      "Full row data:",
      row.original
    );
  }, []);

  const handleUserPermissionsChange = useCallback(
    (userId, selectedPermissions) => {
      console.log(
        "User ID:",
        userId,
        "Selected Permissions:",
        selectedPermissions
      );

      if (!userId) {
        console.error(
          "Invalid user ID provided to handleUserPermissionsChange"
        );
        return;
      }

      const originalUser = users.find((user) => user.id === userId);

      setDataChanges((prev) => ({
        ...prev,
        users: {
          ...prev.users,
          [userId]: {
            ...prev.users[userId],
            principalId: userId,
            principalType: "user",
            userName: originalUser?.name || "",
            permissions: Array.isArray(selectedPermissions)
              ? [...selectedPermissions]
              : [],
          },
        },
      }));
    },
    [users]
  );

  const handleRolePermissionsChange = useCallback(
    (roleId, selectedPermissions) => {
      console.log(
        "Role ID:",
        roleId,
        "Selected Permissions:",
        selectedPermissions
      );

      if (!roleId) {
        console.error(
          "Invalid role ID provided to handleRolePermissionsChange"
        );
        return;
      }

      const originalRole = roles.find((role) => role.id === roleId);

      setDataChanges((prev) => ({
        ...prev,
        roles: {
          ...prev.roles,
          [roleId]: {
            ...prev.roles[roleId],
            principalId: roleId,
            principalType: "role",
            roleName: originalRole?.name || "",
            permissions: Array.isArray(selectedPermissions)
              ? [...selectedPermissions]
              : [],
          },
        },
      }));
    },
    [roles]
  );

  const handleAccessTypeChange = useCallback(
    (id, accessTypeValue, type) => {
      console.log(
        `${type} ID:`,
        id,
        "Access Type:",
        accessTypeValue === 1 ? "Allow" : "Deny",
        "Value:",
        accessTypeValue
      );

      if (!id) {
        console.error(
          `Invalid ${type} ID provided to handleAccessTypeChange:`,
          id
        );
        return;
      }

      const originalData =
        type === "user"
          ? users.find((user) => user.id === id)
          : roles.find((role) => role.id === id);

      const tableType = type === "user" ? "users" : "roles";
      const nameField = type === "user" ? "userName" : "roleName";

      setDataChanges((prev) => ({
        ...prev,
        [tableType]: {
          ...prev[tableType],
          [id]: {
            ...prev[tableType][id],
            principalId: id,
            principalType: type,
            [nameField]: originalData?.name || "",
            accessType: accessTypeValue,
          },
        },
      }));
    },
    [users, roles]
  );

  const handleSecurityLevelChange = useCallback(
    (id, value, type) => {
      const numValue = parseInt(value, 10);
      if (isNaN(numValue) || numValue < 0 || numValue > 99) {
        console.log("Invalid security level. Must be between 0-99");
        return;
      }
      console.log(`${type} ID:`, id, "Security Level:", numValue);

      if (!id) {
        console.error(
          `Invalid ${type} ID provided to handleSecurityLevelChange:`,
          id
        );
        return;
      }

      const originalData =
        type === "user"
          ? users.find((user) => user.id === id)
          : roles.find((role) => role.id === id);

      const tableType = type === "user" ? "users" : "roles";
      const nameField = type === "user" ? "userName" : "roleName";

      setDataChanges((prev) => ({
        ...prev,
        [tableType]: {
          ...prev[tableType],
          [id]: {
            ...prev[tableType][id],
            principalId: id,
            principalType: type,
            [nameField]: originalData?.name || "",
            clearanceLevel: numValue,
          },
        },
      }));
    },
    [users, roles]
  );

  const handleDoneClick = useCallback(() => {
    const getChangedData = (dataType, originalArray) => {
      const changedEntries = {};

      Object.entries(dataChanges[dataType]).forEach(([id, changeData]) => {
        const originalItem = originalArray.find((item) => item.id === id);
        if (!originalItem) return;

        const hasChanges =
          (changeData.permissions &&
            JSON.stringify(changeData.permissions) !==
              JSON.stringify(originalItem.permissions || [])) ||
          (changeData.accessType !== undefined &&
            changeData.accessType !== getOriginalAccessType(originalItem)) ||
          (typeof changeData.clearanceLevel === "number" &&
            changeData.clearanceLevel !==
              getOriginalClearanceLevel(originalItem));

        if (hasChanges) {
          changedEntries[id] = changeData;
        }
      });

      return changedEntries;
    };

    const changedUsers = getChangedData("users", users || []);
    const changedRoles = getChangedData("roles", roles || []);
    const allChangedData = { ...changedUsers, ...changedRoles };

    const clearanceRules = Object.values(allChangedData)
      .filter((item) => typeof item.clearanceLevel === "number")
      .map((item) => ({
        principalId: item.principalId,
        principalType: item.principalType,
        [item.principalType === "user" ? "userName" : "roleName"]:
          item.userName || item.roleName,
        clearanceLevel: item.clearanceLevel,
      }));

    const aclRules = Object.values(allChangedData)
      .filter(
        (item) =>
          (item.permissions && item.permissions.length > 0) ||
          item.accessType !== undefined
      )
      .map((item) => ({
        principalId: item.principalId,
        principalType: item.principalType,
        [item.principalType === "user" ? "userName" : "roleName"]:
          item.userName || item.roleName,
        permissions: item.permissions || [],
        accessType: item.accessType !== undefined ? item.accessType : 1,
      }));

    const result = { clearanceRules, aclRules };

    console.log(
      "Final Result (Only Changed Data):",
      JSON.stringify(result, null, 2)
    );
    console.log("Changed Users:", changedUsers);
    console.log("Changed Roles:", changedRoles);

    if (onDone) {
      onDone(result);
    }

    return result;
  }, [dataChanges, users, roles, onDone]);

  const rolesColumns = useMemo(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: t("roleName"),
        size: 150,
        minSize: 120,
      },
      {
        id: "permissions",
        accessorKey: "permissions",
        header: t("permissions"),
        size: 300,
        minSize: 250,
        cell: ({ row }) => (
          <div className="py-2 min-h-[60px] flex items-center">
            <div className="w-full">
              <Permissions
                key={`role-permissions-${getRowId(row)}`}
                targetId={getRowId(row)}
                targetType="role"
                entityType={entityType}
                onPermissionsChange={handleRolePermissionsChange}
                initialSelectedPermissions={
                  dataChanges.roles?.[getRowId(row)]?.permissions ||
                  row.original.permissions ||
                  []
                }
              />
            </div>
          </div>
        ),
      },
      {
        id: "accessType",
        accessorKey: "accessType",
        header: t("accessType"),
        size: 180,
        minSize: 150,
        cell: ({ row }) => (
          <AccessTypeCell
            row={row}
            type="role"
            dataChanges={dataChanges}
            handleAccessTypeChange={handleAccessTypeChange}
            getRowId={getRowId}
            getOriginalAccessType={getOriginalAccessType}
            t={t}
          />
        ),
      },
      {
        id: "clearanceLevel",
        accessorKey: "clearanceLevel",
        header: t("securityLevel"),
        size: 180,
        minSize: 150,
        cell: ({ row }) => (
          <SecurityLevelCell
            row={row}
            type="role"
            dataChanges={dataChanges}
            handleSecurityLevelChange={handleSecurityLevelChange}
            getRowId={getRowId}
            getOriginalClearanceLevel={getOriginalClearanceLevel}
            t={t}
          />
        ),
      },
    ],
    [
      handleRolePermissionsChange,
      handleAccessTypeChange,
      handleSecurityLevelChange,
      dataChanges,
      entityType,
      t,
    ]
  );

  const usersColumns = useMemo(
    () => [
      {
        id: "userName",
        accessorKey: "name",
        header: t("username"),
        size: 150,
        minSize: 120,
      },
      {
        id: "permissions",
        accessorKey: "permissions",
        header: t("permissions"),
        size: 300,
        minSize: 250,
        cell: ({ row }) => (
          <div className="py-2 min-h-[60px] flex items-center">
            <div className="w-full">
              <Permissions
                key={`user-permissions-${getRowId(row)}`}
                targetId={getRowId(row)}
                targetType="user"
                entityType={entityType}
                onPermissionsChange={handleUserPermissionsChange}
                initialSelectedPermissions={
                  dataChanges.users?.[getRowId(row)]?.permissions ||
                  row.original.permissions ||
                  []
                }
              />
            </div>
          </div>
        ),
      },
      {
        id: "accessType",
        accessorKey: "accessType",
        header: t("accessType"),
        size: 180,
        minSize: 150,
        cell: ({ row }) => (
          <AccessTypeCell
            row={row}
            type="user"
            dataChanges={dataChanges}
            handleAccessTypeChange={handleAccessTypeChange}
            getRowId={getRowId}
            getOriginalAccessType={getOriginalAccessType}
            t={t}
          />
        ),
      },
      {
        id: "clearanceLevel",
        accessorKey: "clearanceLevel",
        header: t("securityLevel"),
        size: 180,
        minSize: 150,
        cell: ({ row }) => (
          <SecurityLevelCell
            row={row}
            type="user"
            dataChanges={dataChanges}
            handleSecurityLevelChange={handleSecurityLevelChange}
            getRowId={getRowId}
            getOriginalClearanceLevel={getOriginalClearanceLevel}
            t={t}
          />
        ),
      },
    ],
    [
      handleUserPermissionsChange,
      handleAccessTypeChange,
      handleSecurityLevelChange,
      dataChanges,
      entityType,
      t,
    ]
  );

  const currentData = activeTable === "users" ? users || [] : roles || [];
  const currentColumns = activeTable === "users" ? usersColumns : rolesColumns;
  const currentStatus = principlesStatus;
  const currentDoubleClick =
    activeTable === "users"
      ? handleRowDoubleClickUsers
      : handleRowDoubleClickRoles;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 max-w-full overflow-hidden">
      {/* Debug Panel */}
      <div className="p-3 bg-blue-50 border-b border-blue-200 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <strong>Status:</strong> {principlesStatus} |{" "}
            <strong>RepoId:</strong> {repoId || "Missing"}
          </div>
          <div>
            <strong>Raw:</strong> {principles?.length || 0} |{" "}
            <strong>Users:</strong> {users?.length || 0} |{" "}
            <strong>Roles:</strong> {roles?.length || 0}
          </div>
        </div>
      </div>

      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {activeTable === "users"
                ? t("usersManagement")
                : t("rolesManagement")}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {activeTable === "users"
                ? t("usersManagementDescription")
                : t("rolesManagementDescription")}
            </p>
          </div>
        </div>

        {/* Toggle Button Group */}
        <div className="flex items-center gap-4">
          <div className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <button
              onClick={() => setActiveTable("users")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTable === "users"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {t("users")} ({users?.length || 0})
            </button>
            <button
              onClick={() => setActiveTable("roles")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                activeTable === "roles"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              {t("roles")} ({roles?.length || 0})
            </button>
          </div>

          {/* Done Button */}
          <button
            onClick={handleDoneClick}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-all duration-200 flex items-center gap-2 shadow-sm"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {t("done")}
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
        <ReUsableTable
          columns={currentColumns}
          data={currentData}
          title={`${activeTable === "users" ? t("users") : t("roles")} ${t(
            "list"
          )}`}
          isLoading={currentStatus === "loading"}
          onRowDoubleClick={currentDoubleClick}
          showGlobalFilter={true}
          pageSizeOptions={[5, 10, 15, 25, 50]}
          defaultPageSize={10}
          className={`${activeTable}-permissions-table`}
          enableSelection={false}
          tableClassName="min-w-full"
          rowClassName="hover:bg-gray-50 transition-colors duration-150"
          headerClassName="bg-gradient-to-r from-gray-50 to-gray-100 text-sm font-semibold text-gray-700 border-b border-gray-200"
          cellClassName="text-sm py-3 px-4"
        />
      </div>
    </div>
  );
}

export default UsersRolesPermissionsTable;
