/* eslint-disable react/prop-types */
import React, { useState } from "react";
import {
  Edit2,
  Trash2,
  Database,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

const ATTRIBUTE_TYPES = [
  { value: "string", label: "String" },
  { value: "int", label: "Integer" },
  { value: "date", label: "Date" },
  { value: "datetime", label: "DateTime" },
  { value: "memo", label: "Memo" },
  { value: "dropdown", label: "Dropdown" },
];

const IndexFieldsTable = ({
  indexFields,
  onEdit,
  onDelete,
  isAddingField = false,
  itemsPerPage = 5,
}) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil(indexFields.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFields = indexFields.slice(startIndex, endIndex);

  // Reset to first page if current page becomes invalid
  React.useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getTypeLabel = (type) => {
    return ATTRIBUTE_TYPES.find((t) => t.value === type)?.label || type;
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
        <div className="flex items-center text-sm text-gray-700">
          <span>
            Showing {startIndex + 1} to {Math.min(endIndex, indexFields.length)}{" "}
            of {indexFields.length} fields
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => goToPage(number)}
              className={`px-3 py-2 rounded-lg border text-sm font-medium ${
                currentPage === number
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
              }`}
            >
              {number}
            </button>
          ))}

          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };
  const columns = [
    {
      name: "index",
      header: t("index"),
      accessor: "index",
    },
    {
      id: "attributeType",
      header: t("type"),
      accessor: "attributeType",
    },
    {
      id: "attributeType",
      header: t("type"),
      accessor: "attributeType",
    },
    {
      id: "attributeSize",
      header: t("size"),
      accessor: "attributeSize",
    },
    {
      id: "valuesOfMemoType",
      header: t("values"),
      accessor: "valuesOfMemoType",
    },
  ];

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border">
      {/* Table Header */}
      <div className="px-4 py-3 bg-gray-50 border-b">
        <h3 className="text-lg font-medium text-gray-900">{t("indexFields")}</h3>
        <p className="text-sm text-gray-600">
          {indexFields.length === 1
            ? t("fieldConfigured")
            : t("fieldsConfigured", { count: indexFields.length })}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((ele) => (
                <th
                  className="px-4 py-3 text-left text-2xl font-medium text-gray-500 uppercase w-16"
                  key={ele.id}
                >
                  {ele.header}
                </th>
              ))}

              {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Attribute Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Size
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Values
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                Actions
              </th> */}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentFields.length > 0 ? (
              currentFields.map((field, index) => (
                <tr
                  key={field.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {field.attributeName}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {getTypeLabel(field.attributeType)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {field.attributeSize || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {field.valuesOfMemoType &&
                    field.valuesOfMemoType.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {field.valuesOfMemoType.slice(0, 2).map((value, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
                          >
                            {value}
                          </span>
                        ))}
                        {field.valuesOfMemoType.length > 2 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                            +{field.valuesOfMemoType.length - 2} more
                          </span>
                        )}
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => onEdit(startIndex + index)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                        disabled={isAddingField}
                        title="Edit field"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(startIndex + index)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                        disabled={isAddingField}
                        title="Delete field"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center">
                  <div className="text-gray-500">
                    <Database className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-lg font-medium mb-1">
                      No index fields added yet
                    </p>
                    <p className="text-sm">
                      Click Add Index Field to create your first field
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};

export default React.memo(IndexFieldsTable);
