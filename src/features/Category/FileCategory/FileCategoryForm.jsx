/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { fetchAllRepos } from "../../Repos/repoThunks";
import { useDispatch, useSelector } from "react-redux";
import { fetchDocTypesByRepo } from "../../DocumentType/docTypeThunks";
import { setDocumentTypeId, setSecurityLevel } from "../categorySlice";

// Updated Zod schema with securityLevel as optional number
const schema = z.object({
  DocType: z.string().min(1, "DocType is required"),
  securityLevel: z.union([z.number().optional()]),
});

const FileCategoryForm = ({ currentParentCategoryId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { repos } = useSelector((state) => state.repoReducer);
  const { docTypes, status } = useSelector((state) => state.docTypeReducer);

  useEffect(() => {
    dispatch(fetchAllRepos());
  }, [dispatch]);

  const {
    register,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      securityLevel: "",
    },
  });

  const { documentTypeId } = useSelector((state) => state.categoryReducer);

  // Watch all form values to display them
  const watchedRepo = watch("Repo");
  const watchedDocType = watch("DocType");

  // Local state
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [selectedDocType, setSelectedDocType] = useState(null);
  const [filteredDocTypes, setFilteredDocTypes] = useState([]);

  // Dropdown states
  const [showRepoOptions, setShowRepoOptions] = useState(false);
  const [showDocTypeOptions, setShowDocTypeOptions] = useState(false);

  const repoDropdownRef = useRef(null);
  const docTypeDropdownRef = useRef(null);

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        repoDropdownRef.current &&
        !repoDropdownRef.current.contains(event.target)
      ) {
        setShowRepoOptions(false);
      }
      if (
        docTypeDropdownRef.current &&
        !docTypeDropdownRef.current.contains(event.target)
      ) {
        setShowDocTypeOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle repo selection
  const handleSelectRepo = (repo) => {
    setValue("Repo", repo.name, { shouldValidate: true });
    setSelectedRepo(repo);
    setShowRepoOptions(false);

    // Fetch document types for the selected repository
    dispatch(fetchDocTypesByRepo(repo.id));

    // Reset document type selection when repo changes
    dispatch(setDocumentTypeId(null));
    setSelectedDocType(null);
    setValue("DocType", "", { shouldValidate: false });
  };

  // Update filteredDocTypes when docTypes changes
  useEffect(() => {
    if (selectedRepo && docTypes && docTypes.length > 0) {
      setFilteredDocTypes(docTypes);
    } else if (selectedRepo && (!docTypes || docTypes.length === 0)) {
      setFilteredDocTypes([]);
    }
  }, [docTypes, selectedRepo]);

  // Handle doc type selection
  const handleSelectDocType = (docType) => {
    console.log(docType);

    dispatch(setDocumentTypeId(docType.id));
    setSelectedDocType(docType);
    setValue("DocType", docType.name, { shouldValidate: true });
    setShowDocTypeOptions(false);
  };


  return (
    <section className="p-6">
      {/* <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("fileCategoryForm") || "File Category Form"}
          </h1>
          <p className="text-gray-600">
            {t("createAndManageCategories") ||
              "Create and manage file categories for your repositories"}
          </p>
        </div>
      </div> */}

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="space-y-6">
          {/* Repository Dropdown */}
          <div className="relative" ref={repoDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("repository")} <span className="text-red-500">*</span>
            </label>
            <div
              className={`w-full px-4 py-3 border rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.Repo ? "border-red-500" : "border-gray-300"
              } ${!watchedRepo ? "text-gray-400" : "text-gray-900"}`}
              onClick={() => setShowRepoOptions(!showRepoOptions)}
            >
              {watchedRepo || t("selectRepository") || "Select repository"}
            </div>
            <input type="hidden" {...register("Repo")} />

            {showRepoOptions && (
              <ul className="absolute z-20 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-auto shadow-xl border-gray-200">
                {repos.length > 0 ? (
                  repos.map((repo) => (
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
                    <span className="text-sm">
                      {t("noRepositoriesFound") || "No repositories found"}
                    </span>
                  </li>
                )}
              </ul>
            )}
            {errors.Repo && (
              <p className="mt-2 text-sm text-red-600">{errors.Repo.message}</p>
            )}
          </div>

          {/* Selected repo display */}

          {/* Document Type Dropdown */}
          <div className="relative" ref={docTypeDropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("docTypeName") || "Document Type"}{" "}
              <span className="text-red-500">*</span>
            </label>
            <div
              className={`w-full px-4 py-3 border rounded-lg cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.DocType ? "border-red-500" : "border-gray-300"
              } ${!selectedRepo ? "bg-gray-100 cursor-not-allowed" : ""} ${
                !watchedDocType ? "text-gray-400" : "text-gray-900"
              }`}
              onClick={() => {
                if (selectedRepo) {
                  setShowDocTypeOptions(!showDocTypeOptions);
                } else {
                  alert(
                    t("selectRepositoryFirst") ||
                      "Please select a repository first"
                  );
                }
              }}
            >
              {watchedDocType ||
                t("selectDocumentType") ||
                "Select document type"}
            </div>
            <input type="hidden" {...register("DocType")} />

            {showDocTypeOptions && selectedRepo && (
              <ul className="absolute z-20 w-full bg-white border rounded-lg mt-1 max-h-48 overflow-auto shadow-xl border-gray-200">
                {filteredDocTypes.length > 0 ? (
                  filteredDocTypes.map((type) => (
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
                    <span className="text-sm">
                      {t("loading") || "Loading..."}
                    </span>
                  </li>
                ) : (
                  <li className="px-4 py-3 text-gray-500">
                    <span className="text-sm">
                      {t("noDocumentTypesFound") ||
                        "No document types found for this repository"}
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

          {/* Security Level Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("securityLevel") || "Security Level"}
            </label>
            <input
              type="number"
              {...register("securityLevel")}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                errors.securityLevel ? "border-red-500" : "border-gray-300"
              }`}
              placeholder={
                t("enterSecurityLevel") || "Enter security level (optional)"
              }
              onChange={(e) => {
                const value = e.target.value;
                // Update the form value
                setValue("securityLevel", value === "" ? "" : Number(value));
                // Dispatch to Redux store
                dispatch(setSecurityLevel(value));
              }}
            />
            {errors.securityLevel && (
              <p className="mt-2 text-sm text-red-600">
                {errors.securityLevel.message}
              </p>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default React.memo(FileCategoryForm);
