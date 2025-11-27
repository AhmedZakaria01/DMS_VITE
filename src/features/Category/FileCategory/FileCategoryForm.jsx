/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Plus } from "lucide-react";
import { fetchAllRepos } from "../../Repos/repoThunks";
import { useDispatch, useSelector } from "react-redux";
import { fetchDocTypesByRepo } from "../../DocumentType/DocTypeThunks";

// Updated Zod schema with securityLevel as optional number
const schema = z.object({
  name: z.string().min(1, "Category Name is required"),
  DocType: z.string().min(1, "DocType is required"),
  Repo: z.string().min(1, "Repository is required"),
  securityLevel: z.union([z.number(), z.string().transform(val => val === '' ? undefined : Number(val))]).optional(),
});

const FileCategoryForm = ({ onDocumentTypeSelect, onCategoryCreated, currentDocTypeId, currentParentCategoryId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { repos } = useSelector((state) => state.repoReducer);
  const { docTypes, status, error } = useSelector(
    (state) => state.docTypeReducer
  );
  
  useEffect(() => {
    dispatch(fetchAllRepos());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      securityLevel: ""
    }
  });

  // Watch securityLevel to handle empty values
  const securityLevelValue = watch("securityLevel");

  // Local state
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [filteredDocTypes, setFilteredDocTypes] = useState([]);
  const [currentRepoId, setCurrentRepoId] = useState(null);

  // Dropdown states
  const [repoSearchTerm, setRepoSearchTerm] = useState("");
  const [showRepoOptions, setShowRepoOptions] = useState(false);
  const repoDropdownRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const dropdownRef = useRef(null);

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        repoDropdownRef.current &&
        !repoDropdownRef.current.contains(event.target)
      ) {
        setShowRepoOptions(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter repos for dropdown
  const filteredRepos = repos.filter((repo) =>
    repo.name.toLowerCase().includes(repoSearchTerm.toLowerCase())
  );

  // Handle repo selection
  const handleSelectRepo = (repo) => {
    setValue("Repo", repo.name, { shouldValidate: true });
    setRepoSearchTerm(repo.name);
    setSelectedRepo(repo);
    setCurrentRepoId(repo.id);
    setShowRepoOptions(false);
    
    // Fetch document types for the selected repository
    dispatch(fetchDocTypesByRepo(repo.id));
    console.log("Selected repo ID:", repo.id);
    
    // Reset document type selection when repo changes
    setValue("DocType", "");
    setSearchTerm("");
    setSelectedDocType(null);
    setFilteredDocTypes([]);
  };

  // Update filteredDocTypes when docTypes changes
  useEffect(() => {
    console.log("docTypes updated:", docTypes);
    console.log("currentRepoId:", currentRepoId);
    
    if (currentRepoId && docTypes && docTypes.length > 0) {
      // Since your API returns all docTypes for the selected repo, we don't need to filter
      // Just use all the docTypes that were fetched for this repo
      setFilteredDocTypes(docTypes);
      console.log("Setting filteredDocTypes:", docTypes);
    } else if (currentRepoId && (!docTypes || docTypes.length === 0)) {
      setFilteredDocTypes([]);
    }
  }, [docTypes, currentRepoId]);

  // Filter doc types based on search term
  const displayDocTypes = filteredDocTypes.filter((type) =>
    type.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Debug logs
  useEffect(() => {
    console.log("filteredDocTypes:", filteredDocTypes);
    console.log("displayDocTypes:", displayDocTypes);
    console.log("searchTerm:", searchTerm);
    console.log("showOptions:", showOptions);
    console.log("selectedRepo:", selectedRepo);
  }, [filteredDocTypes, displayDocTypes, searchTerm, showOptions, selectedRepo]);

  // Handle doc type selection
  const handleSelectDocType = (docType) => {
    setValue("DocType", docType.name, { shouldValidate: true });
    setSearchTerm(docType.name);
    setSelectedDocType(docType);
    setShowOptions(false);
    
    // Call parent callback if provided
    if (onDocumentTypeSelect) {
      onDocumentTypeSelect(docType.id);
    }
    
    console.log("Selected Document Type ID:", docType.id);
    
    // Simulate fetching categories for this doc type
    const mockCategories = [
      { id: 1, name: "Main Category", parentId: null },
      { id: 2, name: "Sub Category 1", parentId: 1 },
      { id: 3, name: "Sub Category 2", parentId: 1 },
    ];
    console.log("Categories for document type:", mockCategories);
    
    // Simulate fetching parent categories
    const mockParentCategories = [
      { id: 1, name: "Main Category", parentId: null },
    ];
    console.log("Parent categories:", mockParentCategories);
  };

  // Handle security level input change
  const handleSecurityLevelChange = (e) => {
    const value = e.target.value;
    // Allow empty string or numbers
    if (value === "" || !isNaN(value)) {
      setValue("securityLevel", value === "" ? "" : Number(value), { shouldValidate: true });
    }
  };

  // Submit form
  const onSubmit = (data) => {
    if (!selectedDocType) {
      console.error("No document type selected");
      return;
    }
    if (!selectedRepo) {
      console.error("No repository selected");
      return;
    }
    
    // Prepare form data according to your backend requirements
    const formData = {
      name: data.name,
      documentTypeId: selectedDocType.id,
      parentCategoryId: currentParentCategoryId || 0,
      securityLevel: data.securityLevel === "" ? 0 : Number(data.securityLevel) || 0, 
      repositoryId: selectedRepo.id, 
    };
    
    console.log("Form Data Submitted:", formData);
    
    // Call parent callback if provided
    if (onCategoryCreated) {
      onCategoryCreated(formData);
    }
    
    // Here you would typically send the data to your API
    alert(t("categoryCreatedSuccess", { categoryName: data.name, docType: data.DocType, repo: data.Repo }) || `Category "${data.name}" created successfully for ${data.DocType} in ${data.Repo}`);
    
    // Reset form
    setValue("name", "");
    setValue("Repo", "");
    setValue("DocType", "");
    setValue("securityLevel", "");
    setRepoSearchTerm("");
    setSearchTerm("");
    setSelectedRepo(null);
    setSelectedDocType(null);
    setFilteredDocTypes([]);
    setCurrentRepoId(null);
  };

  return (
    <section className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("fileCategoryForm") || "File Category Form"}
          </h1>
          <p className="text-gray-600">
            {t("createAndManageCategories") || "Create and manage file categories for your repositories"}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Category Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("categoryName")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={t("enterCategoryName") || "Enter category name"}
              {...register("name")}
            />
            {errors.name && (
              <p className="mt-2 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Security Level Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("securityLevel") || "Security Level"}
            </label>
            <input
              type="number"
              min="0"
              step="1"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.securityLevel ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={t("enterSecurityLevel") || "Enter security level (optional)"}
              value={securityLevelValue}
              onChange={handleSecurityLevelChange}
            />
            {errors.securityLevel && (
              <p className="mt-2 text-sm text-red-600">{errors.securityLevel.message}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
              {t("securityLevelHint") || "Higher numbers indicate higher security levels"}
            </p>
          </div>

          {/* Searchable Dropdown for repos */}
          <div className="relative" ref={repoDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("repository")} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 ${
                errors.Repo ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={t("searchOrSelectRepo") || "Search or select repository"}
              value={repoSearchTerm}
              onChange={(e) => {
                setRepoSearchTerm(e.target.value);
                setShowRepoOptions(true);
              }}
              onFocus={() => setShowRepoOptions(true)}
            />
            <input
              type="hidden"
              {...register("Repo")}
              value={getValues("Repo") || ""}
            />
            {showRepoOptions && (
              <ul className="absolute z-20 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-auto shadow-xl border-gray-200">
                {filteredRepos.length > 0 ? (
                  filteredRepos.map((repo) => (
                    <li
                      key={repo.id}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                      onClick={() => handleSelectRepo(repo)}
                    >
                      <span className="text-sm">{repo.name}</span>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-3 text-gray-500">
                    <span className="text-sm">{t("noMatchesFound") || "No matches found"}</span>
                  </li>
                )}
              </ul>
            )}
            {errors.Repo && (
              <p className="mt-2 text-sm text-red-600">{errors.Repo.message}</p>
            )}
          </div>

          {/* Selected repo display */}
          {selectedRepo && (
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-800">
                  {t("selectedRepository") || "Selected Repository"}
                </span>
              </div>
              <p className="text-green-700 font-semibold mt-1 text-sm">
                {selectedRepo.name} (ID: {selectedRepo.id})
              </p>
            </div>
          )}

          {/* Searchable Dropdown for DocumentType */}
          <div className="relative" ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("docTypeName") || "Document Type"} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.DocType ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={t("searchOrSelectDocType") || "Search or select document type"}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowOptions(true);
              }}
              onFocus={() => {
                if (selectedRepo) {
                  setShowOptions(true);
                } else {
                  alert(t("selectRepositoryFirst") || "Please select a repository first");
                }
              }}
              disabled={!selectedRepo}
            />
            <input
              type="hidden"
              {...register("DocType")}
              value={getValues("DocType") || ""}
            />
            {showOptions && selectedRepo && (
              <ul className="absolute z-20 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-auto shadow-xl border-gray-200">
                {displayDocTypes.length > 0 ? (
                  displayDocTypes.map((type) => (
                    <li
                      key={type.id}
                      className="px-4 py-3 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                      onClick={() => handleSelectDocType(type)}
                    >
                      <span className="text-sm">{type.name}</span>
                    </li>
                  ))
                ) : status === "loading" ? (
                  <li className="px-4 py-3 text-gray-500">
                    <span className="text-sm">{t("loading") || "Loading..."}</span>
                  </li>
                ) : (
                  <li className="px-4 py-3 text-gray-500">
                    <span className="text-sm">
                      {filteredDocTypes.length === 0 
                        ? (t("noDocumentTypesFound") || "No document types found for this repository")
                        : (t("noMatchesFound") || "No matches found")
                      }
                    </span>
                  </li>
                )}
              </ul>
            )}
            {errors.DocType && (
              <p className="mt-2 text-sm text-red-600">
                {errors.DocType.message}
              </p>
            )}
          </div>

          {/* Selected DocumentType display */}
          {selectedDocType && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-blue-800">
                  {t("selectedDocumentType") || "Selected Document Type"}
                </span>
              </div>
              <p className="text-blue-700 font-semibold mt-1 text-sm">
                {selectedDocType.name} (ID: {selectedDocType.id})
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
            disabled={!selectedRepo || !selectedDocType}
          >
            <Plus className="w-5 h-5 mr-2" />
            <span className="text-base">{t("createCategory") || "Create Category"}</span>
          </button>

          {/* Instructions */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              {t("instructions") || "Instructions"}
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• {t("instructionSelectRepo") || "Select a repository first to see available document types"}</li>
              <li>• {t("instructionChooseDocType") || "Choose a document type to create categories for"}</li>
              <li>• {t("instructionEnterName") || "Enter a name for your new category"}</li>
              <li>• {t("instructionSecurityLevel") || "Set security level (optional) - higher numbers mean more security"}</li>
              <li>• {t("instructionSubmit") || "Submit the form to create the category"}</li>
            </ul>
          </div>
        </form>
      </div>
    </section>
  );
};

FileCategoryForm.defaultProps = {
  onDocumentTypeSelect: () => {},
  onCategoryCreated: () => {},
  currentDocTypeId: null,
  currentParentCategoryId: null,
};

export default React.memo(FileCategoryForm);