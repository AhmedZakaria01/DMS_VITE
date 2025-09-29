/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
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
  Shield,
  Users,
  Loader,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  editRepositoryDetails,
  fetchRepositoryById,
  fetchAllRepos,
} from "../repoThunks";
import { useNavigate, useParams } from "react-router-dom";
import SuccessAlert from "../../../globalComponents/Alerts/SuccessAlert";
import ErrorAlert from "../../../globalComponents/Alerts/ErrorAlert";

// Form validation schema
const validationSchema = z.object({
  name: z
    .string()
    .min(1, "Repository name is required")
    .min(3, "Must be at least 3 characters"),
  description: z
    .string()
    .min(1, "Repository description is required")
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
  itemsPerPage = 3,
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
    const maxVisiblePages = 3;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          Showing {startIndex + 1} to {Math.min(endIndex, indexFields.length)}
          of {indexFields.length} fields
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {pageNumbers.map((number) => (
            <button
              key={number}
              onClick={() => goToPage(number)}
              className={`px-3 py-1 rounded-lg border text-sm font-medium transition-colors ${
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
            className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Index Fields</h3>
        <p className="text-sm text-gray-600 mt-1">
          {indexFields.length} field{indexFields.length !== 1 ? "s" : ""}
          configured
        </p>
      </div>
      <div className="flex-1 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-12">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Name
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Size
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Values
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentFields.length > 0 ? (
              currentFields.map((field, index) => (
                <tr
                  key={field.id || index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    {field.attributeName}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getTypeLabel(field.attributeType)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {field.attributeSize || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {field.valuesOfMemoType &&
                    field.valuesOfMemoType.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {field.valuesOfMemoType.slice(0, 1).map((value, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700"
                          >
                            {value}
                          </span>
                        ))}
                        {field.valuesOfMemoType.length > 1 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                            +{field.valuesOfMemoType.length - 1}
                          </span>
                        )}
                      </div>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(startIndex + index)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        disabled={isAddingField}
                        title="Edit field"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(startIndex + index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
                  <div className="text-gray-400">
                    <Database className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-base font-medium mb-1">
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

function UpdateRepo({ id, setIsOpen }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { currentRepository, status } = useSelector(
    (state) => state.repoReducer
  );

  // Initialize form with validation
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
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

  // Local state
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [showAddField, setShowAddField] = useState(false);
  const [currentField, setCurrentField] = useState({
    id: null,
    attributeName: "",
    attributeType: "",
    attributeSize: "",
    valuesOfMemoType: [""],
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [repositoryData, setRepositoryData] = useState(null);
  const params = useParams();

  const repoId = params.repoId
  console.log(repoId);
  
  // Fetch repository data when component mounts
  useEffect(() => {
    const fetchRepoData = async () => {
      if (repoId) {
        try {
          setIsLoading(true);
          console.log("Fetching repo with repoId:", repoId);
          console.log(repoId);

          const { response } = await dispatch(
            fetchRepositoryById(repoId)
          ).unwrap();
          setIsLoading(false);
          console.log("Fetched Response:", response);
          console.log("Category Option:", response.categoryOption);
          console.log("Attributes:", response.attributes);

          // Store the repository data
          setRepositoryData(response);

          // Use reset to populate all form fields at once - this is the key fix
          reset({
            name: response.name || "",
            description: response.description || "",
            isEncrypted: Boolean(response.isEncrypted),
            categoryOption: response.categoryOption || "",
          });

          // Set attributes if they exist - FIX: Use attributeResponses instead of attributes
          if (
            response.attributeResponses &&
            Array.isArray(response.attributeResponses)
          ) {
            console.log(
              "Processing attributeResponses:",
              response.attributeResponses
            );
            const formattedAttributes = response.attributeResponses.map(
              (attr, index) => ({
                id: attr.id || Date.now() + index,
                attributeName: attr.attributeName,
                attributeType: attr.attributeType,
                attributeSize: attr.attributeSize,
                valuesOfMemoType: attr.valuesOfMemoType || [], // This might be empty for non-dropdown types
              })
            );
            console.log("Formatted attributes:", formattedAttributes);
            setAttributes(formattedAttributes);
          } else {
            console.log("No attributeResponses found, setting empty array");
            setAttributes([]);
          }
        } catch (error) {
          console.error("Failed to fetch repository:", error);
          triggerError("Failed to load repository data. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchRepoData();
  }, [id, dispatch, reset]); // Added reset to dependencies

  // Alert handlers
  const triggerSuccess = () => {
    setShowSuccessAlert(true);
    setTimeout(() => {
      setShowSuccessAlert(false);
      navigate("/"); // Navigate back to repos list
    }, 2000);
  };

  const triggerError = (message) => {
    setErrorMessage(message);
    setShowErrorAlert(true);
    setTimeout(() => {
      setShowErrorAlert(false);
    }, 3000);
  };

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
      id: null,
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
      id: null,
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
      triggerError("Please fill in all required fields for the index field.");
      return;
    }

    const selectedType = ATTRIBUTE_TYPES.find(
      (type) => type.value === currentField.attributeType
    );

    if (selectedType?.hasSize && !currentField.attributeSize) {
      triggerError("Please specify size for this attribute type.");
      return;
    }

    if (
      currentField.attributeType === "dropdown" &&
      currentField.valuesOfMemoType.every((val) => !val.trim())
    ) {
      triggerError("Please add at least one dropdown value.");
      return;
    }

    const newField = {
      id:
        currentField.id ||
        (editingIndex !== null ? attributes[editingIndex]?.id : 0),
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
      id: field.id,
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

  // Submit form with backend-compatible data structure
  const onSubmit = async (data) => {
    const backendData = {
      name: data.name,
      description: data.description || undefined,
      isEncrypted: data.isEncrypted,
      categoryOption: data.categoryOption || undefined,
      newAttributes: attributes.map((field) => ({
        id: field.id,
        attributeName: field.attributeName,
        attributeType: field.attributeType,
        ...(field.attributeSize && { attributeSize: field.attributeSize }),
        ...(field.valuesOfMemoType && {
          valuesOfMemoType: field.valuesOfMemoType,
        }),
      })),
    };

    try {
      const response = await dispatch(
        editRepositoryDetails(id, backendData)
      ).unwrap();
      console.log("Repository updated successfully:", response);
      triggerSuccess();
      // Refresh repositories list
      dispatch(fetchAllRepos());
    } catch (error) {
      console.error("Failed to update repository:", error);
      const errorMsg =
        error?.message || "Failed to update repository. Please try again.";
      triggerError(errorMsg);
    }
  };

  // Get selected attribute type details
  const selectedType = ATTRIBUTE_TYPES.find(
    (type) => type.value === currentField.attributeType
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="py-3 px-4 sm:px-6 lg:px-8 h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading repository data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-3 px-4 sm:px-6 lg:px-8 overflow-auto">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        {/* Header */}
        <div className="text-center mb-6 flex-shrink-0">
          <div className="inline-flex items-center gap-4 bg-white rounded-xl px-8 py-4 shadow-sm border border-gray-200">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-gray-900">
                Update Repository
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Update your repository settings and index fields
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Repository Information */}
              <div className="space-y-6">
                {/* Repository Information Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        Repository Information
                      </h2>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      {/* Repository Name */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Repository Name
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          {...register("name")}
                          type="text"
                          className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            errors.name
                              ? "border-red-300 bg-red-50"
                              : "border-gray-300"
                          }`}
                          placeholder="Enter repository name"
                        />
                        {errors.name && (
                          <p className="text-red-600 text-sm mt-2">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      {/* Category Option */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Category Option
                        </label>
                        <select
                          {...register("categoryOption")}
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                        >
                          <option value="">Select Category (Optional)</option>
                          <option value="per_repository">Per Repository</option>
                          <option value="per_document">
                            Per Document Type
                          </option>
                        </select>
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        {...register("description")}
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical"
                        placeholder="Enter repository description"
                      />
                      {errors.description && (
                        <p className="text-red-600 text-sm mt-2">
                          {errors.description.message}
                        </p>
                      )}
                    </div>

                    {/* Enable Encryption */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Shield className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-700 cursor-pointer">
                            Enable Encryption
                          </label>
                          <p className="text-xs text-gray-600 mt-1">
                            Secure your repository with encryption
                          </p>
                        </div>
                      </div>
                      <label className="flex items-center cursor-pointer">
                        <input
                          {...register("isEncrypted")}
                          type="checkbox"
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Index Fields Management */}
              <div className="space-y-6">
                {/* Index Fields Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Settings className="w-5 h-5 text-green-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900">
                          Index Fields Management
                        </h2>
                      </div>
                      <button
                        type="button"
                        onClick={startAddingField}
                        disabled={showAddField}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium"
                      >
                        <Plus className="w-4 h-4" />
                        Add Index Field
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Add/Edit Field Form */}
                    {showAddField && (
                      <div className="bg-blue-50 rounded-lg p-6 border-2 border-blue-200">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {editingIndex !== null
                              ? "Edit Index Field"
                              : "Add Index Field"}
                          </h3>
                          <button
                            onClick={cancelAddField}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {/* Attribute Name */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Attribute Name
                              <span className="text-red-500">*</span>
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
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                              placeholder="Enter attribute name"
                            />
                          </div>

                          {/* Attribute Type */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Attribute Type
                              <span className="text-red-500">*</span>
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
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
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
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Attribute Size
                              <span className="text-red-500">*</span>
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
                              className="w-full md:w-48 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                              placeholder="Enter size"
                              min="1"
                            />
                          </div>
                        )}

                        {/* Dropdown Values */}
                        {currentField.attributeType === "dropdown" && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between mb-3">
                              <label className="block text-sm font-semibold text-gray-700">
                                Values of Memo Type
                              </label>
                              <button
                                type="button"
                                onClick={addValue}
                                className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                                Add Value
                              </button>
                            </div>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                              {currentField.valuesOfMemoType.map(
                                (value, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2"
                                  >
                                    <input
                                      type="text"
                                      value={value}
                                      onChange={(e) =>
                                        updateValue(index, e.target.value)
                                      }
                                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                      placeholder={`Option ${index + 1}`}
                                    />
                                    {currentField.valuesOfMemoType.length >
                                      1 && (
                                      <button
                                        type="button"
                                        onClick={() => removeValue(index)}
                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={saveIndexField}
                            className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                          >
                            {editingIndex !== null
                              ? "Update Field"
                              : "Save Field"}
                          </button>
                          <button
                            type="button"
                            onClick={cancelAddField}
                            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Index Fields Table */}
                    <IndexFieldsTable
                      indexFields={attributes}
                      onEdit={editIndexField}
                      onDelete={deleteIndexField}
                      isAddingField={showAddField}
                      itemsPerPage={3}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Sticky Action Bar - Better positioned for UX */}
            <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4 mt-8 -mx-4 sm:-mx-6 lg:-mx-8">
              <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-end gap-4">
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!isValid || showAddField}
                    className="inline-flex items-center justify-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none"
                  >
                    <Save className="w-5 h-5" />
                    Update Repository
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Alert Components */}
      {showSuccessAlert && (
        <SuccessAlert
          show={showSuccessAlert}
          onClose={() => setShowSuccessAlert(false)}
          title="Successfully updated!"
          message="Your repository has been updated successfully."
        />
      )}

      {showErrorAlert && (
        <ErrorAlert
          show={showErrorAlert}
          onClose={() => setShowErrorAlert(false)}
          title="Update Failed!"
          message={errorMessage}
          autoClose={true}
          duration={6000}
        />
      )}
    </div>
  );
}

export default UpdateRepo;
