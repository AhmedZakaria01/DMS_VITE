import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";

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
  ArrowLeft,
} from "lucide-react";
import {
  updateDocTypeDetails,
  fetchtDocTypeByAttributes,
} from "./docTypeThunks";

// Index field types configuration
const indexFieldsTypes = [
  { id: 1, name: "STRING", value: "string", label: "String", hasSize: true },
  { id: 2, name: "INT", value: "int", label: "Integer", hasSize: true },
  { id: 3, name: "MEMO", value: "memo", label: "Memo", hasSize: true },
  {
    id: 4,
    name: "DROPDOWNLIST",
    value: "dropdown",
    label: "Dropdown",
    hasSize: false,
  },
  { id: 5, name: "DATE", value: "date", label: "Date", hasSize: false },
  {
    id: 6,
    name: "BOOLEAN",
    value: "boolean",
    label: "Boolean",
    hasSize: false,
  },
];

// Simple Alert Component for showing errors
const Alert = ({ message, type = "error" }) => {
  if (!message) return null;

  const styles = {
    error: "bg-red-50 border-red-200 text-red-700",
    success: "bg-green-50 border-green-200 text-green-700",
  };

  return (
    <div className={`p-3 rounded-lg border ${styles[type]} mb-4`}>
      {message}
    </div>
  );
};

Alert.propTypes = {
  message: PropTypes.string,
  type: PropTypes.oneOf(["error", "success"]),
};

// Index Fields Table Component
const IndexFieldsTable = ({
  indexFields = [],
  onEdit = () => {},
  onDelete = () => {},
  isAddingField = false,
  itemsPerPage = 3,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { t } = useTranslation();

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
  }, [currentPage, totalPages, indexFields.length]);

  // Navigate to specific page
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Get display label for attribute type
  const getTypeLabel = (type) => {
    const typeConfig = indexFieldsTypes.find(
      (attrType) => attrType.name === type
    );
    return typeConfig?.label || type;
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
          {t("showing")} {startIndex + 1} {t("to")}{" "}
          {Math.min(endIndex, indexFields.length)} {t("of")}{" "}
          {indexFields.length} {t("fields")}
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
      <div className="px-6 py-2 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          {t("indexFields")}
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          {indexFields.length === 1
            ? t("fieldConfigured")
            : t("fieldsConfigured", { count: indexFields.length })}
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
                {t("name")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {t("type")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {t("size")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {t("required")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                {t("named")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {currentFields.length > 0 ? (
              currentFields.map((field, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {startIndex + index + 1}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    {field.name}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getTypeLabel(field.type)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {field.size || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {field.isRequired ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {t("yes")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {t("no")}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {field.isNamed ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {t("yes")}
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {t("no")}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(startIndex + index)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        disabled={isAddingField}
                        title={t("edit")}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(startIndex + index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        disabled={isAddingField}
                        title={t("delete")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-11 text-center">
                  <div className="text-gray-400">
                    <Database className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-base font-medium mb-1">
                      {t("noIndexFields")}
                    </p>
                    <p className="text-sm">{t("addIndexFieldHint")}</p>
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

IndexFieldsTable.propTypes = {
  indexFields: PropTypes.array,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  isAddingField: PropTypes.bool,
  itemsPerPage: PropTypes.number,
};

const UpdateDocType = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { repoId, docTypeId } = useParams();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  // Redux state with error handling
  const docTypeState = useSelector((state) => {
    if (!state.docTypeReducer) {
      console.warn(
        "docType slice not found in Redux store. Make sure DocTypeSlice is properly added to your store configuration."
      );
      return {
        loading: false,
        error: null,
        success: false,
        message: null,
        currentDocType: null,
      };
    }
    return state.docTypeReducer;
  });

  const { loading, error, success, message, currentDocType } = docTypeState;

  // Local state
  const [indexFields, setIndexFields] = useState([]);
  const [showAddField, setShowAddField] = useState(false);
  const [currentField, setCurrentField] = useState({
    name: "",
    type: "",
    size: "",
    isRequired: false,
    isNamed: false,
    values: [],
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  // Fetch document type data on component mount
  useEffect(() => {
    console.log("Component mounted. docTypeId:", docTypeId, "repoId:", repoId);
    if (docTypeId) {
      console.log("Dispatching fetchtDocTypeByAttributes with:", docTypeId);
      dispatch(fetchtDocTypeByAttributes(docTypeId));
    }
  }, [dispatch, docTypeId]);

  // Populate form when currentDocType is loaded
  useEffect(() => {
    console.log("currentDocType changed:", currentDocType);
    console.log("isDataLoaded:", isDataLoaded);

    if (currentDocType && !isDataLoaded) {
      console.log("Setting form values with:", currentDocType);

      // Set form values
      setValue("documentType", currentDocType.name || "");
      setValue("securityLevel", currentDocType.securityLevel || "");

      // Set index fields from attributeResponses (not attributes)
      if (
        currentDocType.attributeResponses &&
        Array.isArray(currentDocType.attributeResponses)
      ) {
        console.log(
          "Setting attributeResponses:",
          currentDocType.attributeResponses
        );
        const formattedFields = currentDocType.attributeResponses.map(
          (attr) => ({
            name: attr.attributeName,
            type: attr.attributeType,
            size: attr.attributeSize,
            isRequired: attr.isRequired !== undefined ? attr.isRequired : true,
            isNamed: attr.isNamed !== undefined ? attr.isNamed : false,
            values: attr.valuesOfMemoType || [],
          })
        );
        setIndexFields(formattedFields);
        console.log("Formatted fields:", formattedFields);
      } else {
        console.log(
          "No attributeResponses found in currentDocType or not an array"
        );
        console.log(
          "Available keys in currentDocType:",
          Object.keys(currentDocType)
        );
      }

      setIsDataLoaded(true);
    }
  }, [currentDocType, setValue, isDataLoaded]);

  const resetFieldForm = () => {
    setCurrentField({
      name: "",
      type: "",
      size: "",
      isRequired: false,
      isNamed: false,
      values: [],
    });
    setEditingIndex(null);
    setShowAddField(false);
    setInputValue("");
    setErrorMessage("");
  };

  const handleAddDropdownValue = () => {
    if (inputValue.trim() !== "") {
      setCurrentField((prev) => ({
        ...prev,
        values: [...prev.values, inputValue.trim()],
      }));
      setInputValue("");
      setErrorMessage("");
    } else {
      setErrorMessage(t("dropdownValueRequired"));
    }
  };

  const handleDeleteDropdownValue = (index) => {
    if (window.confirm(t("confirmDeleteDropdownValue"))) {
      setCurrentField((prev) => ({
        ...prev,
        values: prev.values.filter((_, i) => i !== index),
      }));
    }
  };

  const startAddingField = () => {
    setShowAddField(true);
    setCurrentField({
      name: "",
      type: "",
      size: "",
      isRequired: false,
      isNamed: false,
      values: [],
    });
    setEditingIndex(null);
    setErrorMessage("");
  };

  const cancelAddField = () => {
    resetFieldForm();
  };

  const saveIndexField = () => {
    // Reset error message
    setErrorMessage("");

    // Validate required fields
    if (!currentField.name.trim()) {
      setErrorMessage(
        t("attributeNameRequired") || "Attribute name is required"
      );
      return;
    }

    if (!currentField.type) {
      setErrorMessage(
        t("attributeTypeRequired") || "Attribute type is required"
      );
      return;
    }

    const selectedType = indexFieldsTypes.find(
      (field) => field.name === currentField.type
    );

    // Validate size for types that require it
    if (selectedType?.hasSize && !currentField.size) {
      setErrorMessage(
        t("specifySize") || "Please specify size for this field type"
      );
      return;
    }

    // Validate dropdown values
    if (
      currentField.type === "DROPDOWNLIST" &&
      currentField.values.length === 0
    ) {
      setErrorMessage(
        t("addDropdownValue") || "Please add at least one dropdown value"
      );
      return;
    }

    // Create the new field object
    const newField = {
      name: currentField.name.trim(),
      type: currentField.type,
      size: selectedType?.hasSize ? currentField.size : null,
      isRequired: currentField.isRequired,
      isNamed: currentField.isNamed,
      values: currentField.type === "DROPDOWNLIST" ? currentField.values : [],
    };

    // Update the indexFields array
    if (editingIndex !== null) {
      // Editing existing field
      setIndexFields((prev) =>
        prev.map((field, index) => (index === editingIndex ? newField : field))
      );
    } else {
      // Adding new field
      setIndexFields((prev) => [...prev, newField]);
    }

    // Reset the form
    resetFieldForm();
  };

  const editIndexField = (index) => {
    const field = indexFields[index];
    setCurrentField({
      name: field.name,
      type: field.type,
      size: field.size || "",
      isRequired: field.isRequired,
      isNamed: field.isNamed,
      values: field.values || [],
    });
    setEditingIndex(index);
    setShowAddField(true);
    setErrorMessage("");
  };

  const deleteIndexField = (index) => {
    if (
      window.confirm(
        t("confirmDeleteField") || "Are you sure you want to delete this field?"
      )
    ) {
      setIndexFields((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const onSubmit = async (values) => {
    const finalIndexFields = [...indexFields];

    // Add current field if being edited (in case user forgot to click save)
    if (showAddField && currentField.name.trim() && currentField.type) {
      const selectedType = indexFieldsTypes.find(
        (field) => field.name === currentField.type
      );

      const newField = {
        name: currentField.name.trim(),
        type: currentField.type,
        size: selectedType?.hasSize ? currentField.size : null,
        isRequired: currentField.isRequired,
        isNamed: currentField.isNamed,
        values: currentField.type === "DROPDOWNLIST" ? currentField.values : [],
      };

      if (editingIndex !== null) {
        finalIndexFields[editingIndex] = newField;
      } else {
        finalIndexFields.push(newField);
      }
    }

    const payload = {
      id: Number(docTypeId), // Ensure it's a number
      name: values.documentType,
      repositoryId: Number(repoId),
      // Only include securityLevel if it has a value
      ...(values.securityLevel && {
        securityLevel: Number(values.securityLevel),
      }),
      newAttributes: finalIndexFields.map((f) => ({
        attributeName: f.name,
        attributeType: f.type,
        attributeSize: f.size ?? "",
        attributeValue: "",
        valuesOfMemoType: f.type === "DROPDOWNLIST" ? f.values : [],
        isRequired: f.isRequired ?? true,
        isNamed: f.isNamed ?? false,
      })),
    };

    console.log("Update payload:", payload);

    try {
      // Fix: Pass both docTypeId and payload as expected by the thunk
      const resultAction = await dispatch(
        updateDocTypeDetails({
          docTypeId: Number(docTypeId),
          payload: payload,
        })
      );

      if (updateDocTypeDetails.fulfilled.match(resultAction)) {
        // Navigate back or show success message
        // navigate(`/documentTypes/${repoId}`);
      }
    } catch (error) {
      console.error("Error during document type update:", error);
    }
  };

  const selectedType = indexFieldsTypes.find(
    (field) => field.name === currentField.type
  );

  // Show loading state while fetching data
  if (!currentDocType && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">{t("loadingDocumentType")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-1 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back Button */}
        <div className="mb-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-4 bg-white rounded-xl px-8 py-4 shadow-sm border border-gray-200">
              <div className="p-3 bg-orange-100 rounded-lg">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-left">
                <h1 className="text-xl font-bold text-gray-900">
                  {t("Update Document Type")}
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  {t("Update Document Type Description")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Success/Error Messages */}
        {error && <Alert message={error} type="error" />}
        {success && message && <Alert message={message} type="success" />}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Document Type Information */}
            <div className="space-y-6">
              {/* Document Type Information Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {t("information")}
                    </h2>
                  </div>
                </div>

                <div className="p-3 space-y-4">
                  {/* Document Type Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t("documentTypeName")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      {...register("documentType", {
                        required: t("documentTypeRequired"),
                      })}
                      type="text"
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.documentType
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder={t("enterDocumentTypeName")}
                      disabled={loading}
                    />
                    {errors.documentType && (
                      <p className="text-red-600 text-sm mt-2">
                        {errors.documentType.message}
                      </p>
                    )}
                  </div>

                  {/* Security Level - OPTIONAL */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t("securityLevel")}
                    </label>
                    <input
                      {...register("securityLevel", {
                        min: {
                          value: 1,
                          message: t("Min security level is 1"),
                        },
                        max: {
                          value: 99,
                          message: t("Max security level is 99"),
                        },
                      })}
                      type="number"
                      min="1"
                      max="99"
                      className={`w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.securityLevel
                          ? "border-red-300 bg-red-50"
                          : "border-gray-300"
                      }`}
                      placeholder={t("enterSecurityLevel")}
                      disabled={loading}
                    />
                    {errors.securityLevel && (
                      <p className="text-red-600 text-sm mt-2">
                        {errors.securityLevel.message}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      {t("securityLevelHint")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Index Fields Management */}
            <div className="space-y-6">
              {/* Index Fields Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-2 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Settings className="w-5 h-5 text-green-600" />
                      </div>
                      <h2 className="text-xl font-semibold text-gray-900">
                        {t("indexFieldsManagement")}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={startAddingField}
                      disabled={showAddField || loading}
                      className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      {t("addIndexField")}
                    </button>
                  </div>
                </div>

                <div className="p-2 space-y-6">
                  {/* Add/Edit Field Form */}
                  {showAddField && (
                    <div className="bg-blue-50 rounded-lg p-3 border-2 border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {editingIndex !== null
                            ? t("editIndexField")
                            : t("addNewIndexField")}
                        </h3>
                        <button
                          onClick={cancelAddField}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
                          disabled={loading}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Error Message */}
                      {errorMessage && (
                        <Alert message={errorMessage} type="error" />
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Attribute Name */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {t("attributeName")}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={currentField.name}
                            onChange={(e) =>
                              setCurrentField((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            placeholder={t("enterAttributeName")}
                            autoFocus
                            disabled={loading}
                          />
                        </div>

                        {/* Attribute Type */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {t("attributeType")}{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={currentField.type}
                            onChange={(e) =>
                              setCurrentField((prev) => ({
                                ...prev,
                                type: e.target.value,
                                size: "",
                                values:
                                  e.target.value === "DROPDOWNLIST" ? [] : [],
                              }))
                            }
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                            disabled={loading}
                          >
                            <option value="">{t("selectAttributeType")}</option>
                            {indexFieldsTypes?.map((field, i) => (
                              <option key={i} value={field.name}>
                                {field.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Size Field */}
                      {selectedType?.hasSize && (
                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {t("attributeSize")}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            value={currentField.size}
                            onChange={(e) =>
                              setCurrentField((prev) => ({
                                ...prev,
                                size: e.target.value,
                              }))
                            }
                            className="w-full md:w-48 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            placeholder={t("enterSize")}
                            min="1"
                            disabled={loading}
                          />
                        </div>
                      )}

                      {/* Dropdown Values */}
                      {currentField.type === "DROPDOWNLIST" && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-semibold text-gray-700">
                              {t("dropdownValues")}
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="text"
                                className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder={t("enterDropdownValue")}
                                onKeyDown={(e) =>
                                  e.key === "Enter" && handleAddDropdownValue()
                                }
                                disabled={loading}
                              />
                              <button
                                type="button"
                                onClick={handleAddDropdownValue}
                                className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                                disabled={loading}
                              >
                                <Plus className="w-4 h-4" />
                                {t("addValue")}
                              </button>
                            </div>
                          </div>
                          {currentField.values.length > 0 && (
                            <div className="space-y-2 mb-4">
                              {currentField.values.map((value, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2"
                                >
                                  <input
                                    type="text"
                                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                                    value={value}
                                    onChange={(e) => {
                                      const newValues = [
                                        ...currentField.values,
                                      ];
                                      newValues[index] = e.target.value;
                                      setCurrentField((prev) => ({
                                        ...prev,
                                        values: newValues,
                                      }));
                                    }}
                                    disabled={loading}
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleDeleteDropdownValue(index)
                                    }
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                                    disabled={loading}
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Checkboxes */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isRequired"
                            checked={currentField.isRequired}
                            onChange={(e) =>
                              setCurrentField((prev) => ({
                                ...prev,
                                isRequired: e.target.checked,
                              }))
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            disabled={loading}
                          />
                          <label
                            htmlFor="isRequired"
                            className="ml-2 block text-sm text-gray-700 font-medium"
                          >
                            {t("requiredField")}
                          </label>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id="isNamed"
                            checked={currentField.isNamed}
                            onChange={(e) =>
                              setCurrentField((prev) => ({
                                ...prev,
                                isNamed: e.target.checked,
                              }))
                            }
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            disabled={loading}
                          />
                          <label
                            htmlFor="isNamed"
                            className="ml-2 block text-sm text-gray-700 font-medium"
                          >
                            {t("namedField")}
                          </label>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={saveIndexField}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium"
                          disabled={loading}
                        >
                          {editingIndex !== null
                            ? t("updateField")
                            : t("saveField")}
                        </button>
                        <button
                          type="button"
                          onClick={cancelAddField}
                          className="px-6 py-2 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-400 text-white rounded-lg transition-colors font-medium"
                          disabled={loading}
                        >
                          {t("cancel")}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Index Fields Table */}
                  <IndexFieldsTable
                    indexFields={indexFields}
                    onEdit={editIndexField}
                    onDelete={deleteIndexField}
                    isAddingField={showAddField}
                    itemsPerPage={3}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Action Bar */}
          <div className="bg-white border-t border-gray-200 py-3 mx-4 sm:-mx-6 lg:-mx-8">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-end gap-4">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  type="submit"
                  disabled={!isValid || showAddField || loading}
                  className="inline-flex items-center justify-center gap-3 px-8 py-3 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-5 h-5" />
                  )}
                  {loading ? t("updating") : t("updateDocumentType")}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateDocType;
