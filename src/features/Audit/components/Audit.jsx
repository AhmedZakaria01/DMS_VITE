import { useDispatch, useSelector } from "react-redux";
import ReUsableTable from "../../../resusableComponents/table/ReUsableTable";
import React, { useMemo, useState, useEffect } from "react";
import { fetchAuditTrail } from "../auditThunks";

function AuditTrail() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const { audits, status, error } = useSelector((state) => state.auditReducer);

  // Fetching Audit Trail Data
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAuditTrail());
    }

    // Update loading based on status
    if (status !== "loading") {
      setLoading(false);
    }
  }, [dispatch, status]);

  // Define table columns for audit trail
  const columns = useMemo(
    () => [
      {
        id: "action",
        accessorKey: "action",
        header: "Status",
        size: 150,
      },
      {
        id: "entityName",
        accessorKey: "entityName",
        header: "Entity Type",
        size: 120,
      },
      {
        id: "actionDate",
        accessorKey: "actionDate",
        header: "Action Date",
        size: 150,
      },
      {
        id: "userId",
        accessorKey: "userId",
        header: "Created By",
      },
    ],
    []
  );

  // Handle double click - view audit log details
  const handleRowDoubleClick = (row) => {
    console.log("Audit log selected! Log ID:", row.original.id);
    console.log("Full audit data:", row.original);
    // You can add navigation or modal logic here to view full audit details
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Audit Trail</h1>
        <p className="text-gray-600">
          Track and monitor system activities and changes
        </p>
      </div>

      <ReUsableTable
        columns={columns}
        data={audits}
        title="Audit Trail"
        isLoading={loading}
        onRowDoubleClick={handleRowDoubleClick}
        showGlobalFilter={true}
        pageSizeOptions={[10, 15, 25, 50, 100]}
        defaultPageSize={15}
        className="audit-trail-table"
        enableSelection={false}
      />
    </div>
  );
}

export default React.memo(AuditTrail);
