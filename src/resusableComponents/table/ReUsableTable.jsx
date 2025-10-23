/* eslint-disable react/prop-types */

import React, { useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import "./Table.css";

import Popup from "../../globalComponents/Popup";
import DisplaySelectedItems from "./DisplaySelectedItems";
import { useTranslation } from "react-i18next";

/**
 * Default column filter component
 */
const DefaultColumnFilter = ({ column }) => {
  const { t } = useTranslation();
  const columnFilterValue = column.getFilterValue();

  return (
    <input
      value={columnFilterValue ?? ""}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={t("searchPlaceholder")}
      className="filter-input"
    />
  );
};

DefaultColumnFilter.propTypes = {
  column: PropTypes.object,
};

/**
 * Global filter component for searching across all table data
 */
const GlobalFilter = ({ value, onChange }) => {
  const { t } = useTranslation();
  return (
    <span className="global-filter-container">
      <input
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t("typeToSearch")}
        className="global-filter-input"
      />
    </span>
  );
};

GlobalFilter.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

/**
 * Custom checkbox component that supports indeterminate state
 */
const Checkbox = React.forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = React.useRef();
  const resolvedRef = ref || defaultRef;

  useEffect(() => {
    if (resolvedRef.current) {
      resolvedRef.current.indeterminate = indeterminate;
    }
  }, [resolvedRef, indeterminate]);

  return <input type="checkbox" ref={resolvedRef} {...rest} />;
});
Checkbox.displayName = "Checkbox";

Checkbox.propTypes = {
  indeterminate: PropTypes.bool,
};

/**
 * Pagination controls component
 */
const PaginationControls = ({ table, pageSizeOptions }) => (
  <div className="pagination-container flex items-center justify-between gap-4">
    <div className="pagination-buttons flex items-center gap-1">
      <button
        onClick={() => table.setPageIndex(0)}
        disabled={!table.getCanPreviousPage()}
        className="px-2 py-1 border rounded disabled:opacity-50"
      >
        {"<<"}
      </button>
      <button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        className="px-2 py-1 border rounded disabled:opacity-50"
      >
        {"<"}
      </button>
      <button
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        className="px-2 py-1 border rounded disabled:opacity-50"
      >
        {">"}
      </button>
      <button
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
        className="px-2 py-1 border rounded disabled:opacity-50"
      >
        {">>"}
      </button>
    </div>

    <div className="flex items-center gap-3">
      <span className="page-indicator text-sm whitespace-nowrap">
        Page <strong>{table.getState().pagination.pageIndex + 1}</strong> of{" "}
        <strong>{table.getPageCount()}</strong>
      </span>

      <input
        type="number"
        defaultValue={table.getState().pagination.pageIndex + 1}
        onChange={(e) => {
          const page = e.target.value ? Number(e.target.value) - 1 : 0;
          table.setPageIndex(page);
        }}
        className="w-16 px-2 py-1 text-center border rounded"
        min="1"
        max={table.getPageCount()}
      />

      <select
        className="page-size-select px-2 py-1 border rounded"
        value={table.getState().pagination.pageSize}
        onChange={(e) => table.setPageSize(Number(e.target.value))}
      >
        {pageSizeOptions.map((size) => (
          <option key={size} value={size}>
            Show {size}
          </option>
        ))}
      </select>
    </div>
  </div>
);

PaginationControls.propTypes = {
  table: PropTypes.object,
  pageSizeOptions: PropTypes.array,
};

/**
 * Main reusable table component with TanStack React Table
 */
const ReUsableTable = ({
  columns: userColumns,
  data,
  title,
  initialState = {},
  onRowDoubleClick,
  showGlobalFilter = true,
  enableSelection = false, // New prop to control row selection
  selectedItemsConfig = null, // Configuration for DisplaySelectedItems
  pageSizeOptions = [5, 10, 20, 30, 50],
  defaultPageSize = 10,
  className = "",
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});

  // Process user columns for TanStack Table format
  const processedUserColumns = useMemo(() => {
    return userColumns.map((col, idx) => ({
      ...col,
      id: col.id || col.accessorKey || `col_${idx}`,
      accessorKey: col.accessorKey || col.accessor || col.id,
      enableSorting: col.enableSorting !== false && col.canSort !== false,
      // Disable filtering for actions column or columns that explicitly disable it
      enableColumnFilter:
        col.enableColumnFilter !== false && col.id !== "actions",
      filterFn: "includesString",
    }));
  }, [userColumns]);

  // Local state for popup management
  const [popupOpen, setPopupOpen] = useState(false);

  const handlePopupToggle = (isOpen) => {
    setPopupOpen(isOpen);
  };

  // Add selection column only if enableSelection is true
  const columns = useMemo(() => {
    const baseColumns = [...processedUserColumns];

    if (enableSelection) {
      return [
        {
          id: "select",
          header: ({ table }) => (
            <Checkbox
              {...{
                checked: table.getIsAllRowsSelected(),
                indeterminate: table.getIsSomeRowsSelected(),
                onChange: table.getToggleAllRowsSelectedHandler(),
              }}
            />
          ),
          cell: ({ row }) => (
            <div>
              <Checkbox
                {...{
                  checked: row.getIsSelected(),
                  disabled: !row.getCanSelect(),
                  indeterminate: row.getIsSomeSelected(),
                  onChange: (e) => {
                    e.stopPropagation(); // Prevent row click
                    console.log(
                      "Checkbox clicked! Row ID:",
                      row.original.id,
                      "Checked:",
                      !row.getIsSelected()
                    );
                    row.toggleSelected();
                  },
                }}
              />
            </div>
          ),
          enableSorting: false,
          enableColumnFilter: false,
          enableHiding: false,
          size: 50,
        },
        ...baseColumns,
      ];
    }

    return baseColumns;
  }, [processedUserColumns, enableSelection]);

  // Initialize TanStack Table
  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      ...(enableSelection && { rowSelection }),
    },
    enableRowSelection: enableSelection,
    enableMultiRowSelection: enableSelection,
    ...(enableSelection && { onRowSelectionChange: setRowSelection }),
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: defaultPageSize,
      },
      ...initialState,
    },
  });

  // Get selected rows data (only if selection is enabled)
  const selectedRows = useMemo(() => {
    if (!enableSelection) return [];
    return table.getSelectedRowModel().rows.map((row) => row.original);
  }, [table.getSelectedRowModel().rows, enableSelection]);

  const handleTablePopup = () => {
    handlePopupToggle(true);
  };

  return (
    <div className={`modern-table-container ${className}`}>
      {/* Table header with title and global filter */}
      <div className="table-header flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h2 className="table-title text-xl font-bold text-white">{title}</h2>

        {/* View Selected */}
        <div className="table-controls flex items-center gap-4">
          {enableSelection && selectedRows.length > 0 && (
            <button
              type="button"
              onClick={handleTablePopup}
              className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 font-semibold shadow hover:from-blue-700 hover:to-cyan-600 transition-all duration-200"
              title="View selected items"
            >
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Show Selected ({selectedRows.length})
            </button>
          )}
          {showGlobalFilter && (
            <GlobalFilter value={globalFilter} onChange={setGlobalFilter} />
          )}
        </div>
      </div>

      {/* Main table element */}
      <div className="table-wrapper ">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <React.Fragment key={headerGroup.id}>
                {/* Column headers row */}
                <tr key={`header-${headerGroup.id}`}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} style={{ width: header.getSize() }}>
                      <div className="header-content">
                        {header.isPlaceholder ? null : (
                          <div
                            className={
                              header.column.getCanSort()
                                ? "cursor-pointer select-none"
                                : ""
                            }
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.id !== "select" &&
                              header.column.id !== "actions" && (
                                <span className="sort-indicator">
                                  {{
                                    asc: " ▲",
                                    desc: " ▼",
                                  }[header.column.getIsSorted()] ?? " ↕"}
                                </span>
                              )}
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
                {/* Column filters row */}
                <tr key={`filter-${headerGroup.id}`} className="filter-row">
                  {headerGroup.headers.map((header) => (
                    <th key={`${header.id}-filter`}>
                      {header.column.getCanFilter() &&
                      header.column.id !== "actions" ? (
                        <DefaultColumnFilter column={header.column} />
                      ) : (
                        // Empty cell for non-filterable columns (like actions)
                        <div className="filter-placeholder"></div>
                      )}
                    </th>
                  ))}
                </tr>
              </React.Fragment>
            ))}
          </thead>
          <tbody>
            {/* Loading state */}
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="loading-state">
                  <div className="loading-spinner" /> Loading...
                </td>
              </tr>
            ) : /* Empty state */
            table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="empty-state">
                  <div className="empty-icon">📭</div>
                  <p>No data available</p>
                  <small>Try adjusting filters or searching again.</small>
                </td>
              </tr>
            ) : (
              /* Data rows */
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  onClick={(e) => {
                    // Prevent row selection if clicking on action buttons or checkboxes
                    if (
                      e.target.closest("button") ||
                      e.target.closest('input[type="checkbox"]')
                    ) {
                      return;
                    }
                    // Only prevent selection if clicking on the checkbox and selection is enabled
                    if (
                      enableSelection &&
                      !e.target.closest('input[type="checkbox"]')
                    ) {
                      // Single click does nothing - just prevent default selection
                      e.preventDefault();
                    }
                  }}
                  onDoubleClick={(e) => {
                    // Don't trigger double click if clicking on action buttons
                    if (e.target.closest("button")) {
                      return;
                    }
                    console.log("Row double-clicked! Row ID:", row.original.id);
                    if (onRowDoubleClick) onRowDoubleClick(row);
                  }}
                  className={`cursor-pointer hover:bg-blue-50 transition-colors duration-200 ${
                    enableSelection && row.getIsSelected() ? "bg-blue-100" : ""
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Add this after the table wrapper and before pagination */}
      <div className="table-info flex justify-between items-center py-2 px-4 bg-gray-50 rounded text-sm text-gray-600">
        <span>
          Showing {table.getRowModel().rows.length} of {""}
          {table.getFilteredRowModel().rows.length} entries
        </span>
      </div>
      {/* Pagination controls */}
      <PaginationControls table={table} pageSizeOptions={pageSizeOptions} />

      {/* Selected rows preview section - only show if selection is enabled */}
      {enableSelection && selectedRows.length > 0 && (
        <Popup
          isOpen={popupOpen}
          setIsOpen={() => handlePopupToggle(false)}
          component={
            <DisplaySelectedItems
              selectedRows={selectedRows}
              {...selectedItemsConfig}
            />
          }
        />
      )}
    </div>
  );
};

export default ReUsableTable;
