/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Folder, FolderOpen } from "lucide-react";

const CategoryTable = ({ currentDocTypeId, currentParentCategoryId, onDocumentTypeChange, onCategoryUpdate, initialCategories }) => {
  const { t } = useTranslation();

  // Static data
  const staticDocumentTypes = [
    { id: 1, name: "Invoices" },
    { id: 2, name: "Contracts" },
    { id: 3, name: "Employee Records" },
    { id: 4, name: "Technical Documentation" },
  ];

  const staticCategories = [
    {
      id: 1,
      name: "Finance Categories",
      documentTypeId: 1,
      parentId: null,
      children: [
        {
          id: 11,
          name: "Vendor Invoices",
          documentTypeId: 1,
          parentId: 1,
          children: [
            {
              id: 111,
              name: "International Vendors",
              documentTypeId: 1,
              parentId: 11,
              children: [],
            },
            {
              id: 112,
              name: "Local Vendors",
              documentTypeId: 1,
              parentId: 11,
              children: [],
            },
          ],
        },
        {
          id: 12,
          name: "Customer Invoices",
          documentTypeId: 1,
          parentId: 1,
          children: [
            {
              id: 121,
              name: "Corporate Clients",
              documentTypeId: 1,
              parentId: 12,
              children: [],
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "Legal Categories",
      documentTypeId: 2,
      parentId: null,
      children: [
        {
          id: 21,
          name: "Employment Contracts",
          documentTypeId: 2,
          parentId: 2,
          children: [],
        },
        {
          id: 22,
          name: "Vendor Agreements",
          documentTypeId: 2,
          parentId: 2,
          children: [],
        },
      ],
    },
    {
      id: 3,
      name: "HR Categories",
      documentTypeId: 3,
      parentId: null,
      children: [
        {
          id: 31,
          name: "Employee Files",
          documentTypeId: 3,
          parentId: 3,
          children: [
            {
              id: 311,
              name: "Onboarding Documents",
              documentTypeId: 3,
              parentId: 31,
              children: [],
            },
          ],
        },
      ],
    },
  ];

  // Local state
  const [documentTypeId, setDocumentTypeId] = useState(currentDocTypeId || null);
  const [parentCategories, setParentCategories] = useState(initialCategories || []);
  const [childrenByParentId, setChildrenByParentId] = useState({});
  const [expanded, setExpanded] = useState({});
  const [showAddForm, setShowAddForm] = useState({});
  const [newCategoryName, setNewCategoryName] = useState({});
  const [loading, setLoading] = useState(false);
  const [childLoading, setChildLoading] = useState({});
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);

  // Update when props change
  useEffect(() => {
    if (currentDocTypeId) {
      setDocumentTypeId(currentDocTypeId);
    }
  }, [currentDocTypeId]);

  useEffect(() => {
    if (initialCategories) {
      setParentCategories(initialCategories);
    }
  }, [initialCategories]);

  // Handle document type selection
  const handleDocumentTypeChange = (selectedDocTypeId) => {
    const docTypeId = selectedDocTypeId ? parseInt(selectedDocTypeId) : null;
    setDocumentTypeId(docTypeId);
    
    // Clear previous data when changing document type
    setExpanded({});
    setShowAddForm({});
    setNewCategoryName({});
    setChildrenByParentId({});

    if (docTypeId) {
      setLoading(true);
      // Simulate API call delay
      setTimeout(() => {
        const filteredCategories = staticCategories.filter(
          category => category.documentTypeId === docTypeId
        );
        setParentCategories(filteredCategories);
        setLoading(false);
        
        // Call parent callback if provided
        if (onDocumentTypeChange) {
          onDocumentTypeChange(docTypeId);
        }
      }, 500);
    } else {
      setParentCategories([]);
    }
  };

  // Toggle Expand and fetch children if needed
  const toggleExpand = (item, level = 0) => {
    const { id } = item;
    const isCurrentlyExpanded = expanded[id];

    const collapseChildren = (parentId) => {
      const children = childrenByParentId[parentId] || [];
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
              const children = childrenByParentId[categoryIdNum] || [];
              children.forEach((child) => {
                collapseChildren(child.id);
              });
            }
          });
          setExpanded({});
        };
        collapseAll();
      }

      // Simulate fetching children with delay
      if (!childrenByParentId[id]) {
        setChildLoading(prev => ({ ...prev, [id]: true }));
        
        setTimeout(() => {
          // Find the category in our static data and get its children
          const findCategoryChildren = (categories, targetId) => {
            for (const category of categories) {
              if (category.id === targetId) {
                return category.children || [];
              }
              if (category.children && category.children.length > 0) {
                const found = findCategoryChildren(category.children, targetId);
                if (found) return found;
              }
            }
            return [];
          };

          const children = findCategoryChildren(staticCategories, id);
          setChildrenByParentId(prev => ({ ...prev, [id]: children }));
          setChildLoading(prev => ({ ...prev, [id]: false }));
        }, 300);
      }

      // Expand this category
      if (level === 0) {
        setExpanded({ [id]: true });
      } else {
        setExpanded(prev => ({ ...prev, [id]: true }));
      }
    } else {
      // When collapsing, recursively collapse all nested children
      collapseChildren(id);
      setExpanded(prev => ({ ...prev, [id]: false }));
    }
  };

  // Toggle Add Input
  const toggleAddForm = (categoryId) => {
    if (!documentTypeId) {
      alert(t("pleaseSelectDocTypeFirst") || "Please select a document type first");
      return;
    }

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

    // Reset the input for the current category
    setNewCategoryName(prev => ({ ...prev, [categoryId]: "" }));
  };

  const handleAddCategory = (parentCategoryId = null) => {
    const categoryName = newCategoryName[parentCategoryId || "root"];

    if (!categoryName?.trim()) {
      alert(t("pleaseEnterCategoryName") || "Please enter a category name");
      return;
    }

    if (!documentTypeId) {
      alert(t("pleaseSelectDocTypeFirst") || "Please select a document type first");
      return;
    }

    setCreateLoading(true);
    setCreateError(null);

    // Simulate API call
    setTimeout(() => {
      const newCategory = {
        id: Date.now(), // Generate unique ID
        name: categoryName.trim(),
        documentTypeId: documentTypeId,
        parentId: parentCategoryId,
        children: [],
      };

      // Update the appropriate state based on whether it's a root or child category
      if (parentCategoryId === null) {
        // Add to root categories
        const updatedCategories = [...parentCategories, newCategory];
        setParentCategories(updatedCategories);
        
        // Call parent callback if provided
        if (onCategoryUpdate) {
          onCategoryUpdate(updatedCategories);
        }
      } else {
        // Add to children
        const updatedChildren = {
          ...childrenByParentId,
          [parentCategoryId]: [...(childrenByParentId[parentCategoryId] || []), newCategory]
        };
        setChildrenByParentId(updatedChildren);
      }

      setCreateLoading(false);
      setShowAddForm({});
      setNewCategoryName({});
      
      console.log("Category created:", newCategory);
      alert(t("categoryCreatedSuccessAlert", { categoryName }) || `Category "${categoryName}" created successfully!`);
    }, 1000);
  };

  const handleInputChange = (categoryId, value) => {
    setNewCategoryName(prev => ({ ...prev, [categoryId]: value }));
  };

  const renderAddForm = (categoryId) => {
    if (!showAddForm[categoryId]) return null;

    return (
      <tr className="bg-gray-50">
        <td colSpan={3} className="px-6 py-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={newCategoryName[categoryId] || ""}
              onChange={(e) => handleInputChange(categoryId, e.target.value)}
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
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">
                {createLoading ? (t("adding") || "Adding...") : (t("add") || "Add")}
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
      const children = childrenByParentId[id] || [];
      const hasChildren = children.length > 0;
      const isOpen = expanded[id];
      const isLoadingChildren = childLoading[id];
      const hasBeenFetched = Object.prototype.hasOwnProperty.call(childrenByParentId, id);

      const rows = [
        <tr
          key={id}
          className={`transition-all duration-200 ${
            level === 0
              ? "bg-blue-50 border-l-4 border-blue-400"
              : "bg-white"
          } hover:bg-gray-50`}
        >
          <td
            className="py-4 px-6 whitespace-nowrap text-gray-700"
            colSpan={2}
          >
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
                  <span className="text-xs">{t("loading") || "Loading..."}</span>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              title={
                !documentTypeId ? 
                (t("selectDocTypeFirst") || "Select document type first") : 
                (t("addSubcategory") || "Add subcategory")
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
              <td
                colSpan={3}
                className="px-6 py-4 text-center text-gray-500"
              >
                <div
                  className="flex items-center justify-center gap-2"
                  style={{ paddingLeft: `${(level + 1) * 24}px` }}
                >
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm">{t("loadingChildren") || "Loading children..."}</span>
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
                  <span className="text-sm">{t("noChildCategories") || "No child categories found"}</span>
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
            {t("selectDocTypeFromDropdown") || "Please select a document type from the dropdown above to view categories"}
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
          {t("getStartedCreating") || "Get started by creating your first category"}
        </p>
        <button
          onClick={() => toggleAddForm("root")}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors flex items-center gap-2 mx-auto"
        >
          <Plus className="w-5 h-5" />
          <span className="text-base">{t("createFirstCategory") || "Create First Category"}</span>
        </button>
      </div>
    );
  };

  // Loading state
  if (loading && documentTypeId) {
    return (
      <section className="">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">{t("categories") || "Categories"}</h2>
          </div>
          <div className="px-6 py-16 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">{t("loadingCategories") || "Loading categories..."}</p>
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
              <h2 className="text-2xl font-bold text-gray-900">{t("categories") || "Categories"}</h2>
              {documentTypeId && (
                <p className="text-gray-600 text-sm mt-1">
                  {t("manageCategoriesFor") || "Manage categories for selected document type"}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              {/* Document Type Selector */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <label className="text-gray-700 text-sm font-medium whitespace-nowrap">
                  {t("documentType") || "Document Type"}:
                </label>
                <select
                  value={documentTypeId || ""}
                  onChange={(e) => handleDocumentTypeChange(e.target.value)}
                  className="px-1 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[200px] text-sm"
                >
                  <option value="" className="text-sm">{t("selectDocumentType") || "Select Document Type"}</option>
                  {staticDocumentTypes.map((docType) => (
                    <option key={docType.id} value={docType.id} className="text-sm">
                      {docType.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Add Root Category Button */}
              <button
                onClick={() => toggleAddForm("root")}
                disabled={!documentTypeId}
                className="px-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2"
                title={
                  !documentTypeId ? 
                  (t("selectDocTypeFirst") || "Select document type first") : 
                  (t("addRootCategory") || "Add root category")
                }
              >
                <Plus className="w-5 h-5" />
                <span className="text-sm">{t("addRootCategory") || "Add Root Category"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
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
              {documentTypeId && parentCategories && parentCategories.length > 0 ? (
                renderRows(parentCategories)
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

CategoryTable.defaultProps = {
  currentDocTypeId: null,
  currentParentCategoryId: null,
  onDocumentTypeChange: () => {},
  onCategoryUpdate: () => {},
  initialCategories: [],
};

export default React.memo(CategoryTable);