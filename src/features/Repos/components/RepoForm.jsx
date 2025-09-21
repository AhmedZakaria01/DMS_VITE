/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Plus,
  X,
  Edit2,
  Trash2,
  Database,
  FileText,
  Settings,
  Save,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createNewRepo, fetchUserRepos } from "../repoThunks";
import { useNavigate } from "react-router-dom";
import SuccessAlert from "../../../globalComponents/Alerts/SuccessAlert";

// Form validation schema
const validationSchema = z.object({
  name: z
    .string()
    .min(1, "Repository name is required")
    .min(3, "Must be at least 3 characters"),
  description: z
    .string()
    .min(1, "Repository name is required")
    .min(3, "Must be at least 3 characters"),
  isEncrypted: z.boolean(),
  categoryOption: z.string().optional(),
});

// Available attribute types with size requirements
const ATTRIBUTE_TYPES = [
  { value: "string", label: "String", hasSize: true },
  { value: "int", label: "Integer", hasSize: true },
  { value: "date", label: "Date", hasSize: false },
  { value: "datetime", label: "DateTime", hasSize: false },
  { value: "memo", label: "Memo", hasSize: true },
  { value: "dropdown", label: "Dropdown", hasSize: false },
];

// Paginated table component for index fields
const IndexFieldsTable = ({
  indexFields,
  onEdit,
  onDelete,
  isAddingField = false,
  itemsPerPage = 5,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate pagination values
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

  // Navigate to specific page
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Get display label for attribute type
  const getTypeLabel = (type) => {
    return ATTRIBUTE_TYPES.find((t) => t.value === type)?.label || type;
  };

  // Render pagination controls
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

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm border">
      <div className="px-4 py-3 bg-gray-50 border-b">
        <h3 className="text-lg font-medium text-gray-900">Index Fields</h3>
        <p className="text-sm text-gray-600">
          {indexFields.length} field{indexFields.length !== 1 ? "s" : ""}{" "}
          configured
        </p>
      </div>

      <div className="overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
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
              </th>
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

      {renderPagination()}
    </div>
  );
};

function RepoForm() {
  // Initialize form with validation
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: zodResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      isEncrypted: false,
      categoryOption: "",
    },
  });

  const [showAlert, setShowAlert] = useState(false);
  const triggerSuccess = () => {
    setShowAlert(true);
    // Auto-hide and navigate after 5 seconds
    setTimeout(() => {
      setShowAlert(false);
      navigate("/");
    }, 2000);
  };
  // State for managing index fields
  const [attributes, setAttributes] = useState([]);
  const [showAddField, setShowAddField] = useState(false);
  const [currentField, setCurrentField] = useState({
    attributeName: "",
    attributeType: "",
    attributeSize: "",
    valuesOfMemoType: [""],
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const { user } = useSelector((state) => state.authReducer);
  const navigate = useNavigate();
  // Add new dropdown/memo value to current field
  const addValue = () => {
    setCurrentField((prev) => ({
      ...prev,
      valuesOfMemoType: [...prev.valuesOfMemoType, ""],
    }));
  };

  // Update specific dropdown/memo value
  const updateValue = (index, value) => {
    setCurrentField((prev) => ({
      ...prev,
      valuesOfMemoType: prev.valuesOfMemoType.map((item, i) =>
        i === index ? value : item
      ),
    }));
  };

  // Remove dropdown/memo value by index
  const removeValue = (index) => {
    if (currentField.valuesOfMemoType.length > 1) {
      setCurrentField((prev) => ({
        ...prev,
        valuesOfMemoType: prev.valuesOfMemoType.filter((_, i) => i !== index),
      }));
    }
  };

  // Initialize add field form
  const startAddingField = () => {
    setShowAddField(true);
    setCurrentField({
      attributeName: "",
      attributeType: "",
      attributeSize: "",
      valuesOfMemoType: [""],
    });
    setEditingIndex(null);
  };

  // Cancel add/edit field operation
  const cancelAddField = () => {
    setShowAddField(false);
    setCurrentField({
      attributeName: "",
      attributeType: "",
      attributeSize: "",
      valuesOfMemoType: [""],
    });
    setEditingIndex(null);
  };

  // Validate and save index field
  const saveIndexField = () => {
    if (!currentField.attributeName.trim() || !currentField.attributeType) {
      alert("Please fill in required fields");
      return;
    }

    const selectedType = ATTRIBUTE_TYPES.find(
      (type) => type.value === currentField.attributeType
    );

    if (selectedType?.hasSize && !currentField.attributeSize) {
      alert("Please specify size for this attribute type");
      return;
    }

    if (
      currentField.attributeType === "dropdown" &&
      currentField.valuesOfMemoType.every((val) => !val.trim())
    ) {
      alert("Please add at least one dropdown value");
      return;
    }

    const newField = {
      id: editingIndex !== null ? editingIndex : Date.now(),
      attributeName: currentField.attributeName.trim(),
      attributeType: currentField.attributeType,
      attributeSize: selectedType?.hasSize
        ? currentField.attributeSize
        : undefined,
      valuesOfMemoType:
        currentField.attributeType === "dropdown"
          ? currentField.valuesOfMemoType.filter((val) => val.trim())
          : undefined,
    };

    if (editingIndex !== null) {
      setAttributes((prev) =>
        prev.map((field, index) => (index === editingIndex ? newField : field))
      );
    } else {
      setAttributes((prev) => [...prev, newField]);
    }

    cancelAddField();
  };

  // Load field data for editing
  const editIndexField = (index) => {
    const field = attributes[index];
    setCurrentField({
      attributeName: field.attributeName,
      attributeType: field.attributeType,
      attributeSize: field.attributeSize || "",
      valuesOfMemoType: field.valuesOfMemoType || [""],
    });
    setEditingIndex(index);
    setShowAddField(true);
  };

  // Remove field with confirmation
  const deleteIndexField = (index) => {
    if (window.confirm("Are you sure you want to delete this index field?")) {
      setAttributes((prev) => prev.filter((_, i) => i !== index));
    }
  };
  const dispatch = useDispatch();
  // Submit form with backend-compatible data structure
  const onSubmit = async (data) => {
    const backendData = {
      name: data.name,
      description: data.description || undefined,
      isEncrypted: data.isEncrypted,
      categoryOption: data.categoryOption || undefined,
      attributes: attributes.map((field) => ({
        attributeName: field.attributeName,
        attributeType: field.attributeType,
        ...(field.attributeSize && { attributeSize: field.attributeSize }),
        ...(field.valuesOfMemoType && {
          valuesOfMemoType: field.valuesOfMemoType,
        }),
      })),
    };
    try {
      await dispatch(createNewRepo(backendData));
      await triggerSuccess();
      await dispatch(fetchUserRepos(user.id));

      // Only reset on success
      reset();
      setAttributes([]);
    } catch (error) {
      console.error("Failed to create repository:", error);
      alert("Failed to create repository. Please try again.");
    }
  };
  // Get selected attribute type details
  const selectedType = ATTRIBUTE_TYPES.find(
    (type) => type.value === currentField.attributeType
  );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center gap-3">
            <Database className="w-8 h-8" />
            <div>
              <h1 className="text-3xl font-bold">Create New Repository</h1>
              <p className="text-purple-100">
                Configure your repository settings and index fields
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="space-y-8">
            {/* Basic Information */}
        <div className="marwa flex">
              <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Repository Information
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Repository Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Repository Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("name")}
                    type="text"
                    className={`w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.name
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    placeholder="Enter repository name"
                  />
                  {errors.name && (
                    <p className="text-red-600 text-sm mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Category Option */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category Option
                  </label>
                  <select
                    {...register("categoryOption")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Category (Optional)</option>
                    <option value="per_repository">Per Repository</option>
                    <option value="per_document">Per Document Type</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-vertical"
                  placeholder="Enter repository description (optional)"
                />
              </div>

              {/* Enable Encryption */}
              <div className="mt-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    {...register("isEncrypted")}
                    type="checkbox"
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-3"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Enable Encryption
                  </span>
                </label>
              </div>
                  <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-blue-600" />
                  Index Fields Management
                </h2>
                <button
                  type="button"
                  onClick={startAddingField}
                  disabled={showAddField}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Index Field
                </button>
              </div>

              {/* Add/Edit Field Form */}
              {showAddField && (
                <div className="bg-white rounded-lg p-6 mb-6 border-2 border-blue-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingIndex !== null
                      ? "Edit Index Field"
                      : "Add Index Field"}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {/* Attribute Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Attribute Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={currentField.attributeName}
                        onChange={(e) =>
                          setCurrentField((prev) => ({
                            ...prev,
                            attributeName: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter attribute name"
                      />
                    </div>

                    {/* Attribute Type */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Attribute Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={currentField.attributeType}
                        onChange={(e) =>
                          setCurrentField((prev) => ({
                            ...prev,
                            attributeType: e.target.value,
                            attributeSize: "",
                            valuesOfMemoType:
                              e.target.value === "dropdown" ? [""] : [],
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select Type</option>
                        {ATTRIBUTE_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Size Field */}
                  {selectedType?.hasSize && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Attribute Size <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={currentField.attributeSize}
                        onChange={(e) =>
                          setCurrentField((prev) => ({
                            ...prev,
                            attributeSize: e.target.value,
                          }))
                        }
                        className="w-full md:w-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter size"
                        min="1"
                      />
                    </div>
                  )}

                  {/* Dropdown Values */}
                  {currentField.attributeType === "dropdown" && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Values of Memo Type
                        </label>
                        <button
                          type="button"
                          onClick={addValue}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded"
                        >
                          <Plus className="w-3 h-3" />
                          Add Value
                        </button>
                      </div>
                      <div className="space-y-2">
                        {currentField.valuesOfMemoType.map((value, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <input
                              type="text"
                              value={value}
                              onChange={(e) =>
                                updateValue(index, e.target.value)
                              }
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder={`Option ${index + 1}`}
                            />
                            {currentField.valuesOfMemoType.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeValue(index)}
                                className="p-1 text-red-600 hover:bg-red-100 rounded"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={saveIndexField}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      {editingIndex !== null ? "Update Field" : "Save Field"}
                    </button>
                    <button
                      type="button"
                      onClick={cancelAddField}
                      className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

        
    {/* Index Fields Section */}
            <div className="bg-gray-50 rounded-xl p-6">
          

              {/* Index Fields Table */}
              <IndexFieldsTable
                indexFields={attributes}
                onEdit={editIndexField}
                onDelete={deleteIndexField}
                isAddingField={showAddField}
                itemsPerPage={5}
              />
            </div>
        </div>
            {/* Submit Button */}
            <div className="flex justify-end pt-6">
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={!isValid || showAddField}
                className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
              >
                <Save className="w-5 h-5" />
                Create Repository
              </button>
            </div>
          </div>
        </div>
      </div>
      {showAlert && (
        <SuccessAlert
          show={showAlert}
          onClose={() => setShowAlert(false)}
          title="Successfully saved!"
          message="Your changes have been saved to the database."
        />
      )}
    </div>
  );
}

export default RepoForm;
