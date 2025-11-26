/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import FileCategoryForm from "./FileCategoryForm";
import CategoryTable from "./CategoryTable";

function CreateCategory() {
  const params = useParams();
  const { t } = useTranslation();

  // Local state to replace Redux
  const [currentDocTypeId, setCurrentDocTypeId] = useState(null);
  const [currentParentCategoryId, setCurrentParentCategoryId] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [categoryType, setCategoryType] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  // Mock data for categories based on document type
  const mockCategoryData = {
    1: [ // For document type ID 1 (Invoices)
      { id: 1, name: "Vendor Invoices", documentTypeId: 1, parentId: null },
      { id: 2, name: "Customer Invoices", documentTypeId: 1, parentId: null },
      { id: 3, name: "Tax Invoices", documentTypeId: 1, parentId: null },
    ],
    2: [ // For document type ID 2 (Contracts)
      { id: 4, name: "Employment Contracts", documentTypeId: 2, parentId: null },
      { id: 5, name: "Vendor Agreements", documentTypeId: 2, parentId: null },
    ],
    3: [ // For document type ID 3 (Employee Records)
      { id: 6, name: "Personal Files", documentTypeId: 3, parentId: null },
      { id: 7, name: "Employment History", documentTypeId: 3, parentId: null },
    ]
  };

  // Mock child categories data
  const mockChildCategories = {
    1: [ // Children for category ID 1
      { id: 101, name: "International Vendors", documentTypeId: 1, parentId: 1 },
      { id: 102, name: "Local Vendors", documentTypeId: 1, parentId: 1 },
    ],
    2: [ // Children for category ID 2
      { id: 103, name: "Corporate Clients", documentTypeId: 1, parentId: 2 },
      { id: 104, name: "Individual Clients", documentTypeId: 1, parentId: 2 },
    ],
    4: [ // Children for category ID 4
      { id: 105, name: "Full-time Contracts", documentTypeId: 2, parentId: 4 },
      { id: 106, name: "Part-time Contracts", documentTypeId: 2, parentId: 4 },
    ]
  };

  // If URL has docTypeId, set the current document type
  useEffect(() => {
    if (params.docTypeId) {
      const docTypeId = parseInt(params.docTypeId);
      setCurrentDocTypeId(docTypeId);
      setCategoryType("parent");
      setCurrentParentCategoryId(null);
      
      // Simulate API call to fetch categories
      setStatus("loading");
      setTimeout(() => {
        const categories = mockCategoryData[docTypeId] || [];
        setCategoryData(categories);
        setStatus("succeeded");
        setError(null);
      }, 500);
    }
  }, [params.docTypeId, mockCategoryData]);

  // If URL has parent category ID, set the current parent category
  useEffect(() => {
    if (params.id) {
      const parentId = parseInt(params.id);
      setCurrentParentCategoryId(parentId);
      setCategoryType("child");
      
      // Find the parent category to get its document type
      let parentDocTypeId = currentDocTypeId;
      if (!parentDocTypeId) {
        // Search for parent in mock data to get document type
        for (const [docTypeId, categories] of Object.entries(mockCategoryData)) {
          const parentCategory = categories.find(cat => cat.id === parentId);
          if (parentCategory) {
            parentDocTypeId = parseInt(docTypeId);
            setCurrentDocTypeId(parentDocTypeId);
            break;
          }
        }
      }
      
      // Simulate fetching child categories
      setStatus("loading");
      setTimeout(() => {
        const childCategories = mockChildCategories[parentId] || [];
        setCategoryData(childCategories);
        setStatus("succeeded");
        setError(null);
      }, 500);
    }
  }, [params.id, currentDocTypeId, mockCategoryData, mockChildCategories]);

  // Function to handle document type selection from FileCategoryForm
  const handleDocumentTypeSelect = (docTypeId) => {
    setCurrentDocTypeId(docTypeId);
    setCategoryType("parent");
    setCurrentParentCategoryId(null);
    
    // Simulate fetching categories for the selected document type
    setStatus("loading");
    setTimeout(() => {
      const categories = mockCategoryData[docTypeId] || [];
      setCategoryData(categories);
      setStatus("succeeded");
      setError(null);
    }, 500);
  };

  // Function to handle category creation
  const handleCategoryCreated = (newCategory) => {
    console.log("New category created:", newCategory);
    
    // Add the new category to our local state
    const categoryToAdd = {
      id: Date.now(), // Generate unique ID
      name: newCategory.name,
      documentTypeId: newCategory.documentTypeId,
      parentId: newCategory.parentCategoryId || null,
    };
    
    if (categoryType === "child") {
      // Add to child categories
      const updatedChildren = [...categoryData, categoryToAdd];
      setCategoryData(updatedChildren);
      
      // Also update the mock data for persistence
      const parentId = currentParentCategoryId;
      if (parentId) {
        mockChildCategories[parentId] = [...(mockChildCategories[parentId] || []), categoryToAdd];
      }
    } else {
      // Add to parent categories
      const updatedCategories = [...categoryData, categoryToAdd];
      setCategoryData(updatedCategories);
      
      // Also update the mock data for persistence
      const docTypeId = currentDocTypeId;
      if (docTypeId) {
        mockCategoryData[docTypeId] = [...(mockCategoryData[docTypeId] || []), categoryToAdd];
      }
    }
    
    // Show success message
    alert(`Category "${newCategory.name}" created successfully!`);
  };

  const getPageTitle = () => {
    if (params.id) {
      return t("childCategories") || "Child Categories";
    }
    if (params.docTypeId) {
      return t("categoriesForDocType") || "Categories for Document Type";
    }
    return t("createCategory") || "Create Category";
  };

  const getDescription = () => {
    if (categoryType === "child") {
      return t("manageChildCategories") || "Manage child categories for the selected parent category";
    }
    if (categoryType === "parent") {
      return t("manageParentCategories") || "Manage parent categories for the selected document type";
    }
    return t("createNewCategory") || "Create a new category and manage existing ones";
  };

  // Function to handle category updates from CategoryTable
  const handleCategoryUpdate = (updatedCategories) => {
    setCategoryData(updatedCategories);
  };

  return (
    <section className="p-1">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {getPageTitle()}
        </h1>
        <p className="text-gray-600">
          {getDescription()}
        </p>
        
        {/* Show current context */}
        <div className="mt-3 flex flex-wrap gap-4">
          {currentDocTypeId && (
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <span className="text-sm">Document Type ID: {currentDocTypeId}</span>
            </div>
          )}
          {currentParentCategoryId && (
            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <span className="text-sm">Parent Category ID: {currentParentCategoryId}</span>
            </div>
          )}
          {categoryType && (
            <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium capitalize">
              <span className="text-sm">Type: {categoryType}</span>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-md">
          <h4 className="font-semibold mb-1 text-sm">Error:</h4>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <FileCategoryForm
            onDocumentTypeSelect={handleDocumentTypeSelect}
            onCategoryCreated={handleCategoryCreated}
            currentDocTypeId={currentDocTypeId}
            currentParentCategoryId={currentParentCategoryId}
          />
        </div>

        {/* Table Section */}
        <div className="lg:col-span-1">
          <CategoryTable
            currentDocTypeId={currentDocTypeId}
            currentParentCategoryId={currentParentCategoryId}
            onDocumentTypeChange={handleDocumentTypeSelect}
            onCategoryUpdate={handleCategoryUpdate}
            initialCategories={categoryData}
          />
        </div>
      </div>

      {/* Quick Stats */}
      {status === "succeeded" && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-1">
          {/* 
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="text-2xl font-bold text-blue-600">
              {categoryData.length}
            </div>
            <div className="text-sm text-blue-800">
              Total Categories
            </div>
          </div> */}
          
          {/* <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="text-2xl font-bold text-green-600 capitalize">
              {categoryType || "N/A"}
            </div>
            <div className="text-sm text-green-800">
              Category Type
            </div>
          </div> */}
          
          {/* <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="text-2xl font-bold text-purple-600">
              {currentDocTypeId || "N/A"}
            </div>
            <div className="text-sm text-purple-800">
              Document Type ID
            </div>
          </div> */}
          
          {/* <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <div className="text-2xl font-bold text-orange-600">
              {status === "loading" ? "..." : "Ready"}
            </div>
            <div className="text-sm text-orange-800">
              Status
            </div>
          </div> */}
        </div>
      )}

      {/* Loading State */}
      {/* {status === "loading" && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 text-sm">
              {categoryType === "child" ? "Loading child categories..." : "Loading categories..."}
            </p>
          </div>
        </div>
      )} */}

      {/* Debug Information (remove in production) */}
      {/* {import.meta.env.DEV && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2 text-sm">Debug Info:</h3>
          <pre className="text-xs">
            {JSON.stringify({
              params,
              currentDocTypeId,
              currentParentCategoryId,
              categoryType,
              status,
              categoryCount: categoryData.length
            }, null, 2)}
          </pre>
        </div>
      )} */}
    </section>
  );
}

export default React.memo(CreateCategory);