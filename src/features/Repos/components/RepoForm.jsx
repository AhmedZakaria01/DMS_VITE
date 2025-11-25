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
  Shield,
  Users,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { createNewRepo, fetchAllRepos } from "../repoThunks";
import { useNavigate } from "react-router-dom";
import SuccessAlert from "../../../globalComponents/Alerts/SuccessAlert";
import ErrorAlert from "../../../globalComponents/Alerts/ErrorAlert";
import Popup from "../../../globalComponents/Popup";

import UsersRolesPermissionsTable from "../../Permissions/UsersRolesPermissionsTable";

import { useTranslation } from "react-i18next";
import { getAllUsers, getRoles } from "../../../services/apiServices";
import { fetchUsers } from "../../Users/usersThunks";
import { fetchRoles } from "../../Roles/RolesThunks";

// Paginated table component for index fields
const IndexFieldsTable = ({
  indexFields,
  onEdit,
  onDelete,
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
  }, [currentPage, totalPages]);

  // Navigate to specific page
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Get display label for attribute type - FIXED
  const getTypeLabel = (type) => {
    const ATTRIBUTE_TYPES = [
      { value: "string", label: t("string"), hasSize: true },
      { value: "int", label: t("integer"), hasSize: true },
      { value: "date", label: t("date"), hasSize: false },
      { value: "datetime", label: t("dateTime"), hasSize: false },
      { value: "memo", label: t("memo"), hasSize: true },
      { value: "dropdown", label: t("dropdown"), hasSize: false },
    ];
    return (
      ATTRIBUTE_TYPES.find((attrType) => attrType.value === type)?.label || type
    );
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
                {t("values")}
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">
                {t("actions")}
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
                <td colSpan={6} className="px-4 py-11 text-center">
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

function RepoForm() {
  const { t } = useTranslation();

  // Form validation schema - FIXED validation keys
  const validationSchema = z.object({
    name: z.string().min(1, t("nameRequired")).min(3, t("minThreeChars")),
    description: z
      .string()
      .min(1, t("descriptionRequired"))
      .min(3, t("minThreeChars")),
    isEncrypted: z.boolean(),
    categoryOption: z.string().optional(),
  });

  // Available attribute types with size requirements - FIXED
  const ATTRIBUTE_TYPES = [
    { value: "string", label: t("string"), hasSize: true },
    { value: "int", label: t("integer"), hasSize: true },
    { value: "date", label: t("date"), hasSize: false },
    { value: "datetime", label: t("dateTime"), hasSize: false },
    { value: "memo", label: t("memo"), hasSize: true },
    { value: "dropdown", label: t("dropdown"), hasSize: false },
  ];

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

  // Alert states
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [openPermissions, setOpenPermissions] = useState(false);

  // State to store permissions data
  const [permissionsData, setPermissionsData] = useState({
    clearanceRules: [],
    aclRules: [],
  });

  const triggerSuccess = () => {
    setShowSuccessAlert(true);
    setTimeout(() => {
      setShowSuccessAlert(false);
      navigate("/");
    }, 2000);
  };

  const triggerError = (message) => {
    setErrorMessage(message);
    setShowErrorAlert(true);
    setTimeout(() => {
      setShowErrorAlert(false);
    }, 3000);
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

  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  // Validate and save index field - FIXED validation keys
  const saveIndexField = () => {
    if (!currentField.attributeName.trim() || !currentField.attributeType) {
      triggerError(t("fillRequiredFields"));
      return;
    }

    const selectedType = ATTRIBUTE_TYPES.find(
      (type) => type.value === currentField.attributeType
    );

    if (selectedType?.hasSize && !currentField.attributeSize) {
      triggerError(t("specifySize"));
      return;
    }

    if (
      currentField.attributeType === "dropdown" &&
      currentField.valuesOfMemoType.every((val) => !val.trim())
    ) {
      triggerError(t("addDropdownValue"));
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
    if (window.confirm(t("confirmDeleteField"))) {
      setAttributes((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // Handle permissions button click
  const handlePermissions = () => {
    setOpenPermissions(true);
    console.log("Opening permissions modal/page");
  };

  // Handle permissions data from UsersRolesPermissionsTable
  const handlePermissionsDataChange = (data) => {
    console.log("Received permissions data:", data);
    setPermissionsData(data);
    setOpenPermissions(false); // Close the popup
  };

  const aclRules = permissionsData.aclRules.map((per) => per);
  console.log(aclRules);

  // Submit form with backend-compatible data structure - FIXED validation key
  const onSubmit = async (data) => {
    const backendData = {
      name: data.name,
      description: data.description || undefined,
      isEncrypted: data.isEncrypted,
      categoryOption: data.categoryOption || undefined,
      clearanceRules: permissionsData.clearanceRules || [],
      aclRules:
        permissionsData.aclRules.map((rule) => ({
          principalId: rule.principalId,
          principalType: rule.principalType,
          permissions: rule.permissions.map((perm) => perm.code), // Extract codes from permission objects
          accessType: rule.accessType,
        })) || [],
      indexFiels: attributes.map((field) => ({
        attributeName: field.attributeName,
        attributeType: field.attributeType,
        ...(field.attributeSize && { attributeSize: field.attributeSize }),
        ...(field.valuesOfMemoType && {
          valuesOfMemoType: field.valuesOfMemoType,
        }),
      })),
    };

    try {
      const response = await dispatch(createNewRepo(backendData)).unwrap();
      console.log("Repository created successfully:", response);
      triggerSuccess();
      await dispatch(fetchAllRepos());
      reset();
      setAttributes([]);
      // Clear permissions data after successful creation
      setPermissionsData({
        clearanceRules: [],
        aclRules: [],
      });
    } catch (error) {
      console.error("Failed to create repository:", error);
      const errorMsg = error?.message || t("createRepoFailed");
      triggerError(errorMsg);
    }
  };

  // Get selected attribute type details
  const selectedType = ATTRIBUTE_TYPES.find(
    (type) => type.value === currentField.attributeType
  );

  return (
    <div className="py-1 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center gap-4 bg-white rounded-xl px-8 py-4 shadow-sm border border-gray-200">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Database className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-bold text-gray-900">
                {t("createNewRepository")}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {t("repoSetupDescription")}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content Area */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Repository Information */}
            <div className="space-y-6">
              {/* Repository Information Card */}
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

                <div className="p-3 space-y-2">
                  <div className="grid grid-cols-1 gap-2">
                    {/* Repository Name */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        {t("repositoryName")}{" "}
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
                        placeholder={t("repositoryNamePlaceholder")}
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
                        {t("categoryOptions")}
                      </label>
                      <select
                        {...register("categoryOption")}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                      >
                        <option value="">{t("selectCategory")}</option>
                        <option value="per_repository">
                          {t("perRepository")}
                        </option>
                        <option value="per_document">
                          {t("perDocumentType")}
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      {t("description")} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      {...register("description")}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical"
                      placeholder={t("descriptionPlaceholder")}
                    />
                    {errors.description && (
                      <p className="text-red-600 text-sm mt-2">
                        {errors.description.message}
                      </p>
                    )}
                  </div>

                  {/* Enable Encryption */}
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Shield className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <label className="text-sm font-semibold text-gray-700 cursor-pointer">
                          {t("enableEncryption")}
                        </label>
                        <p className="text-xs text-gray-600 mt-1">
                          {t("enableEncryptionHint")}
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

              {/* Permissions Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-2 bg-gray-50 border-b border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Users className="w-5 h-5 text-orange-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {t("accessPermissions")}
                    </h2>
                  </div>
                </div>

                <div className="p-3 text-center ">
                  <button
                    type="button"
                    onClick={handlePermissions}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium"
                  >
                    <Shield className="w-4 h-4" />
                    {t("configurePermissions")}
                  </button>
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
                      disabled={showAddField}
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
                          {t("indexFields")}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {attributes.length === 1
                            ? t("fieldConfigured")
                            : t("fieldsConfigured", {
                                count: attributes.length,
                              })}
                        </p>
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
                            {t("attributeName")}{" "}
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
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                            placeholder={t("enterAttributeName")}
                          />
                        </div>

                        {/* Attribute Type */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {t("attributeType")}{" "}
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
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white"
                          >
                            <option value="">{t("selectAttributeType")}</option>
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
                            {t("attributeSize")}
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
                            placeholder={t("enterSize")}
                            min="1"
                          />
                        </div>
                      )}

                      {/* Dropdown Values */}
                      {currentField.attributeType === "dropdown" && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-3">
                            <label className="block text-sm font-semibold text-gray-700">
                              {t("dropdownValues")}
                            </label>
                            <button
                              type="button"
                              onClick={addValue}
                              className="flex items-center gap-2 px-3 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                              {t("addValue")}
                            </button>
                          </div>
                          <div className="space-y-2">
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
                                    placeholder={`${t("option")} ${index + 1}`}
                                  />
                                  {currentField.valuesOfMemoType.length > 1 && (
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
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium"
                        >
                          {editingIndex !== null
                            ? t("updateField")
                            : t("saveField")}
                        </button>
                        <button
                          type="button"
                          onClick={cancelAddField}
                          className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                        >
                          {t("cancel")}
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
                  {openPermissions && (
                    <Popup
                      isOpen={openPermissions}
                      setIsOpen={setOpenPermissions}
                      component={
                        <UsersRolesPermissionsTable
                          // fetchUsers_Roles={}
                          entityType="repo"
                          onDone={handlePermissionsDataChange}
                          savedData={permissionsData}
                          fetchUsers={fetchUsers}
                          fetchRoles={fetchRoles}
                          isRepository={true}
                        />
                      }
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Action Bar - Better positioned for UX */}
          <div className="bg-white border-t border-gray-200  py-3 mx-4 sm:-mx-6 lg:-mx-8">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-end gap-4">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  disabled={!isValid || showAddField}
                  className="inline-flex items-center justify-center gap-3 px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed shadow-lg hover:shadow-xl disabled:shadow-none"
                >
                  <Save className="w-5 h-5" />
                  {t("createRepository")}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Alert Components */}
      {showSuccessAlert && (
        <SuccessAlert
          show={showSuccessAlert}
          onClose={() => setShowSuccessAlert(false)}
          title={t("successfullySaved")}
          message={t("repositoryCreatedSuccessfully")}
        />
      )}

      {showErrorAlert && (
        <ErrorAlert
          show={showErrorAlert}
          onClose={() => setShowErrorAlert(false)}
          title={t("creationFailed")}
          message={t(errorMessage)}
          autoClose={true}
          duration={6000}
        />
      )}
    </div>
  );
}

export default RepoForm;
