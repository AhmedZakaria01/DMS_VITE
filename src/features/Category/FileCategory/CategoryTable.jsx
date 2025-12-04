// /* eslint-disable react/prop-types */
// import React, { useEffect, useState, useCallback } from "react";
// import { useTranslation } from "react-i18next";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   Plus,
//   Folder,
//   FolderOpen,
//   ChevronRight,
//   ChevronDown,
// } from "lucide-react";
// import {
//   fetchCategoryChilds,
//   getParentCategories,
//   createCategory,
// } from "../categoryThunks";

// const CategoryTable = () => {
//   const { t } = useTranslation();
//   const dispatch = useDispatch();

//   // Redux selectors
//   const {
//     categoryData: { documentTypeId },
//     parentCategories,
//     childCategories,
//     loading,
//     childLoading,
//   } = useSelector((state) => state.categoryReducer);

//   const { securityLevel, aclRules } = useSelector(
//     (state) => state.categoryReducer.categoryData
//   );

//   useEffect(() => {
//     if (securityLevel > 0) {
//       console.log(securityLevel);
//     }
//     if (aclRules.length > 0) {
//       console.log(aclRules);
//     }
//   }, [securityLevel, aclRules]);

//   // Local component state
//   const [expanded, setExpanded] = useState({});
//   const [showAddForm, setShowAddForm] = useState({});
//   const [newCategoryName, setNewCategoryName] = useState({});
//   const [createLoading, setCreateLoading] = useState(false);
//   const [createError, setCreateError] = useState(null);

//   // Effect to fetch parent categories when document type changes
//   useEffect(() => {
//     if (documentTypeId) {
//       console.log(
//         "Fetching parent categories for document type:",
//         documentTypeId
//       );
//       dispatch(getParentCategories(documentTypeId));
//     }
//   }, [documentTypeId, dispatch]);

//   // Collapse all children recursively
//   const collapseChildrenRecursively = useCallback(
//     (parentId) => {
//       const children = childCategories[parentId] || [];
//       children.forEach((child) => {
//         setExpanded((prev) => ({ ...prev, [child.id]: false }));
//         collapseChildrenRecursively(child.id);
//       });
//     },
//     [childCategories]
//   );

//   // Toggle expand/collapse and fetch children if needed
//   const toggleExpand = useCallback(
//     async (item, level = 0) => {
//       const { id } = item;
//       const isCurrentlyExpanded = expanded[id];

//       if (!isCurrentlyExpanded) {
//         // Expanding logic
//         if (level === 0) {
//           // For parent categories: collapse all others first
//           Object.keys(expanded).forEach((expandedId) => {
//             if (expanded[expandedId]) {
//               collapseChildrenRecursively(parseInt(expandedId));
//             }
//           });
//           setExpanded({ [id]: true });
//         } else {
//           // For child categories: just expand this one
//           setExpanded((prev) => ({ ...prev, [id]: true }));
//         }
//       } else {
//         // Collapsing: close this item and all its children
//         collapseChildrenRecursively(id);
//         setExpanded((prev) => ({ ...prev, [id]: false }));
//       }
//     },
//     [expanded, collapseChildrenRecursively]
//   );

//   // Toggle add form visibility
//   const toggleAddForm = useCallback(
//     (categoryId) => {
//       if (!documentTypeId) {
//         alert(
//           t("pleaseSelectDocTypeFirst") || "Please select a document type first"
//         );
//         return;
//       }

//       setShowAddForm((prev) => {
//         const allClosed = Object.keys(prev).reduce((acc, key) => {
//           acc[key] = false;
//           return acc;
//         }, {});
//         return { ...allClosed, [categoryId]: !prev[categoryId] };
//       });

//       setNewCategoryName((prev) => ({ ...prev, [categoryId]: "" }));
//       setCreateError(null);
//     },
//     [documentTypeId, t]
//   );

//   // Handle adding a new category
//   const handleAddCategory = useCallback(
//     async (parentCategoryId = null) => {
//       const categoryKey = parentCategoryId || "root";
//       const categoryName = newCategoryName[categoryKey];

//       if (!categoryName?.trim()) {
//         alert(t("pleaseEnterCategoryName") || "Please enter a category name");
//         return;
//       }

//       if (!documentTypeId) {
//         alert(
//           t("pleaseSelectDocTypeFirst") || "Please select a document type first"
//         );
//         return;
//       }

//       setCreateLoading(true);
//       setCreateError(null);

//       try {
//         const categoryData = {
//           name: categoryName.trim(),
//           documentTypeId: documentTypeId,
//           parentCategoryId: parentCategoryId,
//           securityLevel: securityLevel,
//           aclRules: aclRules,
//         };

//         await dispatch(createCategory(categoryData)).unwrap();

//         // Reset form state
//         setShowAddForm({});
//         setNewCategoryName({});

//         // Refresh parent categories or child categories as needed
//         if (parentCategoryId === null) {
//           dispatch(getParentCategories(documentTypeId));
//         } else {
//           dispatch(fetchCategoryChilds(parentCategoryId));
//         }
//       } catch (error) {
//         console.error("Error creating category:", error);
//         setCreateError(error.message || "Failed to create category");
//       } finally {
//         setCreateLoading(false);
//       }
//     },
//     [newCategoryName, documentTypeId, dispatch, t]
//   );

//   // Handle input change for category name
//   const handleInputChange = useCallback((categoryId, value) => {
//     setNewCategoryName((prev) => ({ ...prev, [categoryId]: value }));
//   }, []);

//   // Render add form
//   const renderAddForm = (categoryId) => {
//     if (!showAddForm[categoryId]) return null;

//     return (
//       <tr key={`add-form-${categoryId}`} className="bg-gray-50">
//         <td colSpan={3} className="px-6 py-4">
//           <div className="flex items-center gap-3">
//             <input
//               type="text"
//               value={newCategoryName[categoryId] || ""}
//               onChange={(e) => handleInputChange(categoryId, e.target.value)}
//               placeholder={t("enterCategoryName") || "Enter category name"}
//               className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//               onKeyPress={(e) => {
//                 if (e.key === "Enter") {
//                   handleAddCategory(categoryId === "root" ? null : categoryId);
//                 }
//               }}
//               autoFocus
//             />
//             <button
//               onClick={() =>
//                 handleAddCategory(categoryId === "root" ? null : categoryId)
//               }
//               disabled={createLoading}
//               className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
//             >
//               <Plus className="w-4 h-4" />
//               <span className="text-sm">
//                 {createLoading ? t("adding") || "Adding..." : t("add") || "Add"}
//               </span>
//             </button>
//             <button
//               onClick={() => toggleAddForm(categoryId)}
//               className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
//             >
//               <span className="text-sm">{t("cancel") || "Cancel"}</span>
//             </button>
//           </div>
//           {createError && (
//             <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
//               <div className="flex items-center gap-2">
//                 <svg
//                   className="w-4 h-4"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 <span className="text-sm">{createError}</span>
//               </div>
//             </div>
//           )}
//         </td>
//       </tr>
//     );
//   };

//   // Render category rows recursively
//   const renderRows = (items, level = 0) => {
//     return items.flatMap((item) => {
//       const { id } = item;
//       const children = childCategories[id] || [];
//       const hasChildren = item.hasChildren || children.length > 0;
//       const isOpen = expanded[id];
//       const isLoadingChildren = childLoading[id];

//       const rows = [
//         <tr
//           key={id}
//           className={`transition-all duration-200 ${
//             level === 0 ? "bg-blue-50 border-l-4 border-blue-400" : "bg-white"
//           } hover:bg-gray-50`}
//         >
//           <td className="py-4 px-6 whitespace-nowrap text-gray-700" colSpan={2}>
//             <div
//               className="flex items-center gap-3 cursor-pointer select-none"
//               style={{ paddingLeft: `${level * 24}px` }}
//               onClick={() => {
//                 // Dispatch fetchCategoryChilds when clicking on table row
//                 dispatch(fetchCategoryChilds(id));
//                 toggleExpand(item, level);
//               }}
//             >
//               {/* Expand/Collapse Icon */}
//               {hasChildren ? (
//                 isOpen ? (
//                   <ChevronDown className="w-4 h-4 text-gray-600 flex-shrink-0" />
//                 ) : (
//                   <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
//                 )
//               ) : (
//                 <div className="w-4 h-4 flex-shrink-0" />
//               )}

//               {/* Folder Icon */}
//               {isOpen ? (
//                 <FolderOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
//               ) : (
//                 <Folder className="w-5 h-5 text-gray-400 flex-shrink-0" />
//               )}

//               <span className="font-medium text-sm">{item.name}</span>

//               {/* {isLoadingChildren && (
//                 <div className="flex items-center gap-1 text-gray-500">
//                   <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-400"></div>
//                   <span className="text-xs">
//                     {t("loading") || "Loading..."}
//                   </span>
//                 </div>
//               )} */}
//             </div>
//           </td>
//           <td className="py-4 px-6 whitespace-nowrap text-right">
//             <div className="flex items-center gap-2 justify-end">
//               {/* Add Subcategory Button */}
//               <button
//                 onClick={(e) => {
//                   e.stopPropagation();
//                   toggleAddForm(id);
//                 }}
//                 disabled={!documentTypeId}
//                 className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                 title={t("addSubcategory") || "Add subcategory"}
//               >
//                 <Plus className="w-4 h-4" />
//                 <span className="text-sm">{t("add") || "Add"}</span>
//               </button>
//             </div>
//           </td>
//         </tr>,
//       ];

//       // Add form row if shown
//       if (showAddForm[id]) {
//         rows.push(renderAddForm(id));
//       }

//       // Add children rows if expanded
//       if (isOpen) {
//         if (isLoadingChildren) {
//           rows.push(
//             <tr key={`loading-${id}`} className="bg-gray-50">
//               <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
//                 <div
//                   className="flex items-center justify-center gap-2"
//                   style={{ paddingLeft: `${(level + 1) * 24}px` }}
//                 >
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
//                   <span className="text-sm">
//                     {t("loadingChildren") || "Loading children..."}
//                   </span>
//                 </div>
//               </td>
//             </tr>
//           );
//         } else if (children.length > 0) {
//           rows.push(...renderRows(children, level + 1));
//         } else {
//           rows.push(
//             <tr key={`empty-${id}`} className="bg-gray-50">
//               <td
//                 colSpan={3}
//                 className="px-6 py-4 text-center text-gray-500 italic"
//               >
//                 <div style={{ paddingLeft: `${(level + 1) * 24}px` }}>
//                   <span className="text-sm">
//                     {t("noChildCategories") || "No child categories found"}
//                   </span>
//                 </div>
//               </td>
//             </tr>
//           );
//         }
//       }

//       return rows;
//     });
//   };

//   // Render right panel with file management

//   // Render empty state
//   const renderEmptyState = () => {
//     if (!documentTypeId) {
//       return (
//         <div className="text-center py-16">
//           <div className="text-gray-400 mb-4">
//             <Folder className="w-16 h-16 mx-auto" />
//           </div>
//           <h3 className="text-lg font-medium text-gray-600 mb-2">
//             {t("No Document Type Selected")}
//           </h3>
//           <p className="text-gray-500 mb-6">
//             {t("selectDocTypeFromDropdown") ||
//               "Please select a document type from the dropdown above to view categories"}
//           </p>
//         </div>
//       );
//     }

//     return (
//       <div className="text-center py-16">
//         <div className="text-gray-400 mb-4">
//           <Folder className="w-16 h-16 mx-auto" />
//         </div>
//         <h3 className="text-lg font-medium text-gray-600 mb-2">
//           {t("noCategoriesFound") || "No Categories Found"}
//         </h3>
//         <p className="text-gray-500 mb-6">
//           {t("getStartedCreating") ||
//             "Get started by creating your first category"}
//         </p>
//       </div>
//     );
//   };

//   // Loading state
//   if (loading && documentTypeId) {
//     return (
//       <section className="">
//         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//           <div className="px-6 py-5 border-b border-gray-200">
//             <h2 className="text-2xl font-bold text-gray-900">
//               {t("categories") || "Categories"}
//             </h2>
//           </div>
//           <div className="px-6 py-16 text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//             <p className="mt-4 text-gray-600">
//               {t("loadingCategories") || "Loading categories..."}
//             </p>
//           </div>
//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="">
//       <div className="bg-white rounded-lg shadow-lg overflow-hidden">
//         {/* Header */}
//         <div className="px-2 py-5 border-b border-gray-200">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-3">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900">
//                 {t("categories") || "Categories"}
//               </h2>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
//               {/* Add Root Category Button */}
//               <button
//                 onClick={() => toggleAddForm("root")}
//                 disabled={!documentTypeId}
//                 className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2"
//                 title={
//                   !documentTypeId
//                     ? t("selectDocTypeFirst") || "Select document type first"
//                     : t("addRootCategory") || "Add root category"
//                 }
//               >
//                 <Plus className="w-5 h-5" />
//                 <span className="text-sm">
//                   {t("addRootCategory") || "Add Root Category"}
//                 </span>
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Content */}
//         <div className="min-h-[600px]">
//           <div className="flex">
//             {/* Left Side - Categories Table */}
//             <div
//               className={`${"w-full"} transition-all duration-300 overflow-x-auto  `}
//             >
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50 sticky top-0 z-10">
//                   <tr>
//                     <th
//                       scope="col"
//                       colSpan={2}
//                       className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       {t("categoryName") || "Category Name"}
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-1 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       {t("actions") || "Actions"}
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {showAddForm["root"] && renderAddForm("root")}

//                   {documentTypeId &&
//                   parentCategories &&
//                   parentCategories.length > 0 ? (
//                     renderRows(parentCategories)
//                   ) : (
//                     <tr>
//                       <td colSpan={3} className="p-0">
//                         {renderEmptyState()}
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// CategoryTable.defaultProps = {
//   currentDocTypeId: null,
//   docTypesList: [],
// };

// export default React.memo(CategoryTable);

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
/* eslint-disable react/prop-types */
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Folder,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Search,
  ArrowUpDown,
  MoreHorizontal,
} from "lucide-react";
import {
  fetchCategoryChilds,
  getParentCategories,
  createCategory,
} from "../categoryThunks";
import usePermission from "../../auth/usePermission";

const CategoryTable = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const canCreateCategory = usePermission("screens.categories.create");

  // Redux selectors
  const {
    categoryData: { documentTypeId },
    parentCategories,
    childCategories,
    loading,
    childLoading,
  } = useSelector((state) => state.categoryReducer);

  const { securityLevel, aclRules } = useSelector(
    (state) => state.categoryReducer.categoryData
  );

  // Local component state
  const [expanded, setExpanded] = useState({});
  const [showAddForm, setShowAddForm] = useState({});
  const [newCategoryName, setNewCategoryName] = useState({});
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);

  // Pagination and sorting state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (securityLevel > 0) {
      console.log(securityLevel);
    }
    if (aclRules.length > 0) {
      console.log(aclRules);
    }
  }, [securityLevel, aclRules]);

  // Effect to fetch parent categories when document type changes
  useEffect(() => {
    if (documentTypeId) {
      console.log(
        "Fetching parent categories for document type:",
        documentTypeId
      );
      dispatch(getParentCategories(documentTypeId));
      // Reset pagination when document type changes
      setCurrentPage(1);
      setSearchTerm("");
    }
  }, [documentTypeId, dispatch]);

  // Reset pagination when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Filter and sort categories
  const processedCategories = useMemo(() => {
    if (!parentCategories) return [];

    let filtered = parentCategories;

    // Apply search filter
    if (searchTerm.trim()) {
      filtered = parentCategories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle different data types
      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });

    return sorted;
  }, [parentCategories, searchTerm, sortBy, sortDirection]);

  // Pagination calculations
  const totalPages = Math.ceil(processedCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = processedCategories.slice(startIndex, endIndex);

  // Pagination info
  const paginationInfo = useMemo(() => {
    const start = processedCategories.length === 0 ? 0 : startIndex + 1;
    const end = Math.min(endIndex, processedCategories.length);
    const total = processedCategories.length;
    return { start, end, total };
  }, [startIndex, endIndex, processedCategories.length]);

  // Collapse all children recursively
  const collapseChildrenRecursively = useCallback(
    (parentId) => {
      const children = childCategories[parentId] || [];
      children.forEach((child) => {
        setExpanded((prev) => ({ ...prev, [child.id]: false }));
        collapseChildrenRecursively(child.id);
      });
    },
    [childCategories]
  );

  // Toggle expand/collapse and fetch children if needed
  const toggleExpand = useCallback(
    async (item, level = 0) => {
      const { id } = item;
      const isCurrentlyExpanded = expanded[id];

      if (!isCurrentlyExpanded) {
        // Expanding logic
        if (level === 0) {
          // For parent categories: collapse all others first
          Object.keys(expanded).forEach((expandedId) => {
            if (expanded[expandedId]) {
              collapseChildrenRecursively(parseInt(expandedId));
            }
          });
          setExpanded({ [id]: true });
        } else {
          // For child categories: just expand this one
          setExpanded((prev) => ({ ...prev, [id]: true }));
        }
      } else {
        // Collapsing: close this item and all its children
        collapseChildrenRecursively(id);
        setExpanded((prev) => ({ ...prev, [id]: false }));
      }
    },
    [expanded, collapseChildrenRecursively]
  );

  // Handle sorting
  const handleSort = useCallback((field) => {
    setSortBy((prevField) => {
      if (prevField === field) {
        setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortDirection("asc");
      }
      return field;
    });
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // Handle items per page change
  const handleItemsPerPageChange = useCallback((value) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  }, []);

  // Toggle add form visibility
  const toggleAddForm = useCallback(
    (categoryId) => {
      if (!documentTypeId) {
        alert(
          t("pleaseSelectDocTypeFirst") || "Please select a document type first"
        );
        return;
      }

      setShowAddForm((prev) => {
        const allClosed = Object.keys(prev).reduce((acc, key) => {
          acc[key] = false;
          return acc;
        }, {});
        return { ...allClosed, [categoryId]: !prev[categoryId] };
      });

      setNewCategoryName((prev) => ({ ...prev, [categoryId]: "" }));
      setCreateError(null);
    },
    [documentTypeId, t]
  );

  // Handle adding a new category
  const handleAddCategory = useCallback(
    async (parentCategoryId = null) => {
      const categoryKey = parentCategoryId || "root";
      const categoryName = newCategoryName[categoryKey];

      if (!categoryName?.trim()) {
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

      try {
        const categoryData = {
          name: categoryName.trim(),
          documentTypeId: documentTypeId,
          parentCategoryId: parentCategoryId,
          securityLevel: securityLevel,
          aclRules: aclRules,
        };

        await dispatch(createCategory(categoryData)).unwrap();

        // Reset form state
        setShowAddForm({});
        setNewCategoryName({});

        // Refresh parent categories or child categories as needed
        if (parentCategoryId === null) {
          dispatch(getParentCategories(documentTypeId));
        } else {
          dispatch(fetchCategoryChilds(parentCategoryId));
        }
      } catch (error) {
        console.error("Error creating category:", error);
        setCreateError(error.message || "Failed to create category");
      } finally {
        setCreateLoading(false);
      }
    },
    [newCategoryName, documentTypeId, securityLevel, aclRules, dispatch, t]
  );

  // Handle input change for category name
  const handleInputChange = useCallback((categoryId, value) => {
    setNewCategoryName((prev) => ({ ...prev, [categoryId]: value }));
  }, []);

  // Render pagination component
  const renderPagination = () => {
    // Standard behavior: Hide pagination when all items fit on one page
    if (totalPages <= 1) return null;

    // Alternative: Always show pagination when there are items (uncomment line below and comment line above)
    // if (processedCategories.length === 0) return null;

    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 mx-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition-colors"
      >
        {"<"}
      </button>
    );

    // First page + ellipsis if needed
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-3 py-2 mx-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          1
        </button>
      );
    }

    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 mx-1 text-sm font-medium rounded-lg transition-colors ${
            i === currentPage
              ? "text-white bg-blue-600 border border-blue-600"
              : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }

    // Last page + ellipsis if needed
    if (endPage < totalPages) {
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-2 mx-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 mx-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-500 transition-colors"
      >
        {">"}
      </button>
    );

    return (
      <div className="flex items-center justify-between px-6 py-4 bg-white border-t border-gray-200">
        <div className="text-sm text-gray-700">
          {t("showing") || "Showing"} {paginationInfo.start} {t("to") || "to"}{" "}
          {paginationInfo.end} {t("of") || "of"} {paginationInfo.total}{" "}
          {t("results") || "results"}
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-700">
              {t("itemsPerPage") || "Items per page"}:
            </label>
            <select
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className="px-8 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>

          <div className="flex">{pages}</div>
        </div>
      </div>
    );
  };

  // Render table header with sorting
  const renderTableHeader = () => (
    <thead className="bg-gray-50 sticky top-0 z-10">
      <tr>
        <th
          scope="col"
          className="px-6 py-4 text-left cursor-pointer hover:bg-gray-100 transition-colors group"
          onClick={() => handleSort("name")}
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t("categoryName") || "Category Name"}
            </span>
            <div className="flex flex-col">
              {sortBy === "name" ? (
                sortDirection === "asc" ? (
                  <ChevronUp className="w-3 h-3 text-blue-600" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-blue-600" />
                )
              ) : (
                <ArrowUpDown className="w-3 h-3 text-gray-400 group-hover:text-gray-600" />
              )}
            </div>
          </div>
        </th>
        <th
          scope="col"
          className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
        >
          {t("actions") || "Actions"}
        </th>
      </tr>
    </thead>
  );

  // Render search controls
  const renderSearchControls = () => (
    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder={t("searchCategories") || "Search categories..."}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <span className="text-gray-400 hover:text-gray-600 text-lg">
                ×
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  // Render add form
  const renderAddForm = (categoryId) => {
    if (!showAddForm[categoryId]) return null;

    return (
      <tr
        key={`add-form-${categoryId}`}
        className="bg-blue-50 border-l-4 border-blue-400"
      >
        <td colSpan={2} className="px-6 py-4">
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
           {canCreateCategory && ( 
            <button
              onClick={() =>
                handleAddCategory(categoryId === "root" ? null : categoryId)
              }
              disabled={createLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">
                {createLoading ? t("adding") || "Adding..." : t("add") || "Add"}
              </span>
            </button>)}
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

  // Render category rows recursively
  const renderRows = (items, level = 0) => {
    return items.flatMap((item) => {
      const { id } = item;
      const children = childCategories[id] || [];
      const hasChildren = item.hasChildren || children.length > 0;
      const isOpen = expanded[id];
      const isLoadingChildren = childLoading[id];

      const rows = [
        <tr
          key={id}
          className={`transition-all duration-200 ${
            level === 0
              ? "bg-white hover:bg-gray-50"
              : "bg-gray-50 hover:bg-gray-100"
          } border-b border-gray-200`}
        >
          <td className="py-4 px-6 whitespace-nowrap text-gray-900">
            <div
              className="flex items-center gap-3 cursor-pointer select-none"
              style={{ paddingLeft: `${level * 24}px` }}
              onClick={() => {
                dispatch(fetchCategoryChilds(id));
                toggleExpand(item, level);
              }}
            >
              {/* Expand/Collapse Icon - Show for all rows */}
              {hasChildren ? (
                isOpen ? (
                  <ChevronDown className="w-4 h-4 text-gray-600 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-600 flex-shrink-0" />
                )
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
              )}

              {/* Folder Icon */}
              {isOpen ? (
                <FolderOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
              ) : (
                <Folder className="w-5 h-5 text-gray-400 flex-shrink-0" />
              )}

              <span className="font-medium text-sm">{item.name}</span>
            </div>
          </td>

          <td className="py-4 px-6 whitespace-nowrap text-right">
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAddForm(id);
                }}
                disabled={!documentTypeId}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                title={t("addSubcategory") || "Add subcategory"}
              >
                <Plus className="w-4 h-4" />
                <span className="text-sm">{t("add") || "Add"}</span>
              </button>
            </div>
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
              <td colSpan={2} className="px-6 py-4 text-center text-gray-500">
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
        } else if (children.length > 0) {
          rows.push(...renderRows(children, level + 1));
        } else {
          rows.push(
            <tr key={`empty-${id}`} className="bg-gray-50">
              <td
                colSpan={2}
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

  // Render empty state
  const renderEmptyState = () => {
    if (!documentTypeId) {
      return (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <Folder className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {t("No Document Type Selected")}
          </h3>
          <p className="text-gray-500 mb-6">
            {t("selectDocTypeFromDropdown") ||
              "Please select a document type from the dropdown above to view categories"}
          </p>
        </div>
      );
    }

    if (searchTerm.trim() && processedCategories.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {t("noSearchResults") || "No Search Results"}
          </h3>
          <p className="text-gray-500 mb-6">
            {t("tryDifferentSearch") ||
              "Try adjusting your search terms or clearing filters"}
          </p>
          <button
            onClick={() => setSearchTerm("")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {t("clearSearch") || "Clear Search"}
          </button>
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
      </div>
    );
  };

  // Loading state
  if (loading && documentTypeId) {
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
     {canCreateCategory ? 
     ( <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t("categories") || "Categories"}
              </h2>
              {processedCategories.length > 0 && (
                <p className="mt-1 text-sm text-gray-600">
                  {t("totalCategories") || "Total"}:{" "}
                  {processedCategories.length}{" "}
                  {processedCategories.length === 1
                    ? t("category") || "category"
                    : t("categories") || "categories"}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            { canCreateCategory && (<button
                onClick={() => toggleAddForm("root")}
                disabled={!documentTypeId}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap flex items-center gap-2"
                title={
                  !documentTypeId
                    ? t("selectDocTypeFirst") || "Select document type first"
                    : t("addRootCategory") || "Add root category"
                }
              >
                <Plus className="w-5 h-5" />
                <span className="text-sm">
                  {t("addRootCategory") || "Add Root Category"}
                </span>
              </button>)}
            </div>
          </div>
        </div>

        {/* Search Controls */}
        {documentTypeId && renderSearchControls()}

        {/* Content */}
        <div className="min-h-[400px]">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              {renderTableHeader()}
              <tbody className="bg-white divide-y divide-gray-200">
                {showAddForm["root"] && renderAddForm("root")}

                {documentTypeId && currentCategories.length > 0 ? (
                  renderRows(currentCategories)
                ) : (
                  <tr>
                    <td colSpan={2} className="p-0">
                      {renderEmptyState()}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {renderPagination()}
      </div>) : <div>can not create category 
        {/* , your premission not access for you */}
         </div>}
    </section>
  );
};

CategoryTable.defaultProps = {
  currentDocTypeId: null,
  docTypesList: [],
};

export default React.memo(CategoryTable);