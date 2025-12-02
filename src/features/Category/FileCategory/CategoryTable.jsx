/* eslint-disable react/prop-types */
import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Folder, FolderOpen } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  addCategory,
  setCategoryName,
  setParentCategoryId,
} from "../categorySlice";
import {
  createCategory,
  getParentCategories,
  fetchCategoryChilds,
} from "../categoryThunks";

const CategoryTable = ({ onCategoryUpdate, initialCategories }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  // Refs for input elements
  const inputRefs = useRef({});

  // Get category form data from Redux
  const categoryFormData = useSelector(
    (state) => state.categoryReducer.categoryData
  );

  // Local state - reduced since child categories are now in Redux
  const [parentCategories, setParentCategories] = useState(
    initialCategories || []
  );
  const [expanded, setExpanded] = useState({});
  const [showAddForm, setShowAddForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);

  // Get documentTypeId and securityLevel from Redux
  const { documentTypeId, securityLevel } = useSelector(
    (state) => state.categoryReducer.categoryData
  );

  // Get categories from Redux state
  const categories = useSelector((state) => {
    return state.categoryReducer.categories;
  });

  // Get loading state from Redux
  const categoriesLoading = useSelector(
    (state) => state.categoryReducer.loading
  );

  // Get child categories from Redux
  const childCategories = useSelector(
    (state) => state.categoryReducer.childCategories || {}
  );

  // Get child loading states from Redux
  const childLoadingStates = useSelector(
    (state) => state.categoryReducer.childLoading || {}
  );

  console.log("=== CategoryTable Debug Info ===");
  console.log("DocumentTypeId:", documentTypeId);
  console.log("SecurityLevel:", securityLevel);
  console.log("Categories from Redux:", categories);
  console.log("Categories Loading:", categoriesLoading);
  console.log("Child Categories from Redux:", childCategories);
  console.log("Child Loading States:", childLoadingStates);
  console.log("Parent Categories (local state):", parentCategories);
  console.log("Full categoryFormData:", categoryFormData);
  console.log("==============================");

  // Load categories when documentTypeId changes
  useEffect(() => {
    if (documentTypeId) {
      console.log("🚀 Loading categories for documentTypeId:", documentTypeId);
      dispatch(getParentCategories(documentTypeId))
        .then((result) => {
          console.log("✅ getParentCategories fulfilled:", result);
        })
        .catch((error) => {
          console.log("❌ getParentCategories rejected:", error);
        });
    } else {
      // Clear categories when no document type is selected
      setParentCategories([]);
      setExpanded({});
    }
  }, [documentTypeId, dispatch]);

  // Update parent categories when categories change in Redux
  useEffect(() => {
    console.log("Categories changed in Redux:", categories);
    if (categories && categories.length > 0) {
      setParentCategories(categories);
      console.log("Updated parentCategories:", categories);
    } else if (categories && categories.length === 0) {
      // API returned empty array
      setParentCategories([]);
      console.log("Set parentCategories to empty array");
    }
  }, [categories]);

  // Update when props change (keep for backwards compatibility)
  useEffect(() => {
    if (initialCategories && initialCategories.length > 0) {
      setParentCategories(initialCategories);
      console.log("Updated parentCategories from props:", initialCategories);
    }
  }, [initialCategories]);

  // Toggle Expand and fetch children if needed
  const toggleExpand = (item, level = 0) => {
    const { id } = item;
    const isCurrentlyExpanded = expanded[id];

    const collapseChildren = (parentId) => {
      const children = childCategories[parentId] || [];
      children.forEach((child) => {
        collapseChildren(child.id);
      });
    };

    if (!isCurrentlyExpanded) {
      // For level 0 (parent categories): Close all other categories (accordion behavior)
      if (level === 0) {
        const collapseAll = () => {
          Object.keys(expanded).forEach((categoryId) => {
            if (expanded[categoryId]) {
              const categoryIdNum = parseInt(categoryId);
              const children = childCategories[categoryIdNum] || [];
              children.forEach((child) => {
                collapseChildren(child.id);
              });
            }
          });
          setExpanded({});
        };
        collapseAll();
      }

      // Fetch children from API if not already loaded
      if (!childCategories[id]) {
        console.log("🚀 Fetching child categories for parentId:", id);
        dispatch(fetchCategoryChilds(id));
      }

      // Expand this category
      if (level === 0) {
        setExpanded({ [id]: true });
      } else {
        setExpanded((prev) => ({ ...prev, [id]: true }));
      }
    } else {
      // When collapsing, recursively collapse all nested children
      collapseChildren(id);
      setExpanded((prev) => ({ ...prev, [id]: false }));
    }
  };

  // Toggle Add Input
  const toggleAddForm = (categoryId) => {
    // Close all other forms first
    const newShowAddForm = Object.keys(showAddForm).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});

    // Toggle the current form
    setShowAddForm({
      ...newShowAddForm,
      [categoryId]: !showAddForm[categoryId],
    });

    // Clear the input ref for this category
    setTimeout(() => {
      const inputRef = inputRefs.current[categoryId];
      if (inputRef) {
        inputRef.value = "";
        inputRef.focus();
      }
    }, 0);
  };

  const handleAddCategory = (parentCategoryId = null) => {
    // Get the input value directly from ref
    const inputRef = inputRefs.current[parentCategoryId || "root"];
    const categoryName = inputRef?.value?.trim();

    if (!categoryName) {
      alert(t("pleaseEnterCategoryName") || "Please enter a category name");
      return;
    }

    if (!documentTypeId) {
      alert(
        t("pleaseSelectDocTypeFirst") || "Please select a document type first"
      );
      return;
    }

    setCreateLoading(true);
    setCreateError(null);

    // Update Redux store with the actual input value
    dispatch(setCategoryName(categoryName));
    dispatch(setParentCategoryId(parentCategoryId || null));

    // Create the backend payload with actual values
    const backendPayload = {
      name: categoryName,
      documentTypeId: documentTypeId,
      parentCategoryId: parentCategoryId || null,
      securityLevel: categoryFormData.securityLevel || 0,
      aclRules: categoryFormData.aclRules || [],
    };

    console.log("=== BACKEND PAYLOAD FROM CategoryTable (Redux) ===");
    console.log(JSON.stringify(backendPayload, null, 2));
    console.log("==================================================");

    // Dispatch the thunk with the complete payload
    dispatch(createCategory(backendPayload))
      .then((result) => {
        console.log("✅ Category creation successful:", result);

        // Create new category object for local state update
        const newCategory = {
          id: result.payload?.id || Date.now(), // Use API response ID or fallback
          name: categoryName,
          documentTypeId: documentTypeId,
          parentCategoryId: parentCategoryId,
          securityLevel: categoryFormData.securityLevel || 0,
          aclRules: categoryFormData.aclRules || [],
        };

        // Add to Redux store using the addCategory action
        dispatch(addCategory(newCategory));

        // Update local state for immediate UI update
        if (parentCategoryId === null) {
          // Add to root categories
          const updatedCategories = [...parentCategories, newCategory];
          setParentCategories(updatedCategories);

          // Call parent callback if provided
          if (onCategoryUpdate) {
            onCategoryUpdate(updatedCategories);
          }
        }
        // For child categories, Redux will handle the update automatically

        setCreateLoading(false);
        setShowAddForm({});

        // Clear the input
        if (inputRef) {
          inputRef.value = "";
        }

        console.log("Category created:", newCategory);
        alert(
          t("categoryCreatedSuccessAlert", { categoryName }) ||
            `Category "${categoryName}" created successfully!`
        );
      })
      .catch((error) => {
        console.error("❌ Category creation failed:", error);
        setCreateLoading(false);
        setCreateError(error.message || "Failed to create category");
      });
  };

  const renderAddForm = (categoryId) => {
    if (!showAddForm[categoryId]) return null;

    return (
      <tr className="bg-gray-50">
        <td colSpan={3} className="px-6 py-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              ref={(el) => (inputRefs.current[categoryId] = el)}
              placeholder={t("enterCategoryName") || "Enter category name"}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleAddCategory(categoryId === "root" ? null : categoryId);
                }
              }}
              autoFocus
            />
            <button
              onClick={() =>
                handleAddCategory(categoryId === "root" ? null : categoryId)
              }
              disabled={createLoading}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">
                {createLoading ? t("adding") : t("Create Category")}
              </span>
            </button>
            <button
              onClick={() => toggleAddForm(categoryId)}
              className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              <span className="text-sm">{t("cancel") || "Cancel"}</span>
            </button>
          </div>
          {createError && (
            <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
              <div className="flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-sm">{createError}</span>
              </div>
            </div>
          )}
        </td>
      </tr>
    );
  };

  const renderRows = (items, level = 0) => {
    return items.flatMap((item) => {
      const id = item.id;
      const children = childCategories[id] || [];
      const hasChildren = children.length > 0;
      const isOpen = expanded[id];
      const isLoadingChildren = childLoadingStates[id];
      const hasBeenFetched = Object.prototype.hasOwnProperty.call(
        childCategories,
        id
      );

      const rows = [
        <tr
          key={id}
          className={`transition-all duration-200 ${
            level === 0 ? "bg-blue-50 border-l-4 border-blue-400" : "bg-white"
          } hover:bg-gray-50`}
        >
          <td className="py-4 px-6 whitespace-nowrap text-gray-700" colSpan={2}>
            <div
              className="flex items-center gap-3 cursor-pointer select-none"
              style={{ paddingLeft: `${level * 24}px` }}
              onClick={() => toggleExpand(item, level)}
            >
              {isOpen ? (
                <FolderOpen className="w-5 h-5 text-blue-600" />
              ) : (
                <Folder className="w-5 h-5 text-gray-400" />
              )}
              <span className="font-medium text-sm">{item.name}</span>
              {isLoadingChildren && (
                <div className="flex items-center gap-1 text-gray-500">
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400"></div>
                  <span className="text-xs">
                    {t("loading") || "Loading..."}
                  </span>
                </div>
              )}
            </div>
          </td>
          <td className="py-4 px-6 whitespace-nowrap text-right">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleAddForm(id);
              }}
              disabled={!documentTypeId}
              className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              title={
                !documentTypeId
                  ? t("selectDocTypeFirst") || "Select document type first"
                  : t("addSubcategory") || "Add subcategory"
              }
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">{t("add") || "Add"}</span>
            </button>
          </td>
        </tr>,
      ];

      // Add form row if shown
      if (showAddForm[id]) {
        rows.push(renderAddForm(id));
      }

      // Add children rows if expanded
      if (isOpen) {
        if (isLoadingChildren) {
          rows.push(
            <tr key={`loading-${id}`} className="bg-gray-50">
              <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                <div
                  className="flex items-center justify-center gap-2"
                  style={{ paddingLeft: `${(level + 1) * 24}px` }}
                >
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm">
                    {t("loadingChildren") || "Loading children..."}
                  </span>
                </div>
              </td>
            </tr>
          );
        } else if (hasChildren) {
          rows.push(...renderRows(children, level + 1));
        } else if (hasBeenFetched) {
          rows.push(
            <tr key={`empty-${id}`} className="bg-gray-50">
              <td
                colSpan={3}
                className="px-6 py-4 text-center text-gray-500 italic"
              >
                <div style={{ paddingLeft: `${(level + 1) * 24}px` }}>
                  <span className="text-sm">
                    {t("noChildCategories") || "No child categories found"}
                  </span>
                </div>
              </td>
            </tr>
          );
        }
      }

      return rows;
    });
  };

  const renderEmptyState = () => {
    if (!documentTypeId) {
      return (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <Folder className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {t("noDocTypeSelected") || "No Document Type Selected"}
          </h3>
          <p className="text-gray-500 mb-6">
            {t("selectDocTypeFromDropdown") ||
              "Please select a document type from the dropdown above to view categories"}
          </p>
        </div>
      );
    }

    return (
      <div className="text-center py-16">
        <div className="text-gray-400 mb-4">
          <Folder className="w-16 h-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          {t("noCategoriesFound") || "No Categories Found"}
        </h3>
        <p className="text-gray-500 mb-6">
          {t("getStartedCreating") ||
            "Get started by creating your first category"}
        </p>
        <button
          onClick={() => toggleAddForm("root")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2 mx-auto"
        >
          <Plus className="w-5 h-5" />
          <span className="text-base">
            {t("createFirstCategory") || "Create First Category"}
          </span>
        </button>
      </div>
    );
  };

  // Loading state - use Redux loading state for categories
  if ((categoriesLoading || loading) && documentTypeId) {
    return (
      <section className="">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {t("categories") || "Categories"}
            </h2>
          </div>
          <div className="px-6 py-16 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">
              {t("loadingCategories") || "Loading categories..."}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-2 py-5 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t("categories") || "Categories"}
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                {t("manageCategoriesFor") ||
                  "Manage categories for selected document type"}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              {/* Add Root Category Button */}
              <button
                onClick={() => toggleAddForm("root")}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span className="text-sm">
                  {t("addRootCategory") || "Add Root Category"}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {/* DEBUG INFO - Remove this after fixing */}
          <div className="bg-yellow-100 border border-yellow-400 p-4 mb-4 rounded">
            <h3 className="font-bold text-yellow-800">DEBUG INFO:</h3>
            <p>DocumentTypeId: {JSON.stringify(documentTypeId)}</p>
            <p>Categories Loading: {JSON.stringify(categoriesLoading)}</p>
            <p>Categories from Redux: {JSON.stringify(categories)}</p>
            <p>Parent Categories (local): {JSON.stringify(parentCategories)}</p>
            <p>Child Categories: {JSON.stringify(childCategories)}</p>
            <p>Child Loading States: {JSON.stringify(childLoadingStates)}</p>
            <p>
              Categories length: {categories ? categories.length : "undefined"}
            </p>
          </div>

          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  colSpan={2}
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {t("categoryName") || "Category Name"}
                </th>
                <th
                  scope="col"
                  className="px-1 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {t("actions") || "Actions"}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Add root form */}
              {showAddForm["root"] && renderAddForm("root")}

              {/* Categories or empty state */}
              {documentTypeId ? (
                parentCategories && parentCategories.length > 0 ? (
                  renderRows(parentCategories)
                ) : (
                  // Show empty state only if not loading and no categories
                  !categoriesLoading && (
                    <tr>
                      <td colSpan={3} className="p-0">
                        {renderEmptyState()}
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr>
                  <td colSpan={3} className="p-0">
                    {renderEmptyState()}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default React.memo(CategoryTable);
