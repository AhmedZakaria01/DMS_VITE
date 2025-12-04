/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Shield } from "lucide-react";
import FileCategoryForm from "./FileCategoryForm";
import Popup from "../../../globalComponents/Popup";
import UsersRolesPermissionsTable from "../../Permissions/UsersRolesPermissionsTable";
import { fetchPrinciples } from "../../Permissions/permissionsThunks";
import { setAclRules } from "../categorySlice";
import CategoryTable from "./CategoryTable";

function CreateCategory() {
  const params = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const currentRepoId = params.repoId || 1;

  // Local state to replace Redux
  const [currentDocTypeId, setCurrentDocTypeId] = useState(null);
  const [currentParentCategoryId, setCurrentParentCategoryId] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [categoryType, setCategoryType] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  // Permissions state
  const [openPermissions, setOpenPermissions] = useState(false);
  const [permissionsData, setPermissionsData] = useState({
    aclRules: [],
  });

  // Mock data for categories based on document type
  const mockCategoryData = {
    1: [
      // For document type ID 1 (Invoices)
      { id: 1, name: "Vendor Invoices", documentTypeId: 1, parentId: null },
      { id: 2, name: "Customer Invoices", documentTypeId: 1, parentId: null },
      { id: 3, name: "Tax Invoices", documentTypeId: 1, parentId: null },
    ],
    2: [
      // For document type ID 2 (Contracts)
      {
        id: 4,
        name: "Employment Contracts",
        documentTypeId: 2,
        parentId: null,
      },
      { id: 5, name: "Vendor Agreements", documentTypeId: 2, parentId: null },
    ],
    3: [
      // For document type ID 3 (Employee Records)
      { id: 6, name: "Personal Files", documentTypeId: 3, parentId: null },
      { id: 7, name: "Employment History", documentTypeId: 3, parentId: null },
    ],
  };

  // Mock child categories data
  const mockChildCategories = {
    1: [
      // Children for category ID 1
      {
        id: 101,
        name: "International Vendors",
        documentTypeId: 1,
        parentId: 1,
      },
      { id: 102, name: "Local Vendors", documentTypeId: 1, parentId: 1 },
    ],
    2: [
      // Children for category ID 2
      { id: 103, name: "Corporate Clients", documentTypeId: 1, parentId: 2 },
      { id: 104, name: "Individual Clients", documentTypeId: 1, parentId: 2 },
    ],
    4: [
      // Children for category ID 4
      { id: 105, name: "Full-time Contracts", documentTypeId: 2, parentId: 4 },
      { id: 106, name: "Part-time Contracts", documentTypeId: 2, parentId: 4 },
    ],
  };

  // Fetch principles for permissions when component mounts
  useEffect(() => {
    if (currentRepoId) {
      dispatch(fetchPrinciples(currentRepoId));
    }
  }, [dispatch, currentRepoId]);

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
  }, [params.docTypeId]);

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
        for (const [docTypeId, categories] of Object.entries(
          mockCategoryData
        )) {
          const parentCategory = categories.find((cat) => cat.id === parentId);
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
  }, [params.id, currentDocTypeId]);

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

  // Handle permissions button click
  const handlePermissions = () => {
    setOpenPermissions(true);
  };

  // Handle permissions data from UsersRolesPermissionsTable
  const handlePermissionsDataChange = (data) => {
    setPermissionsData(data);
    setOpenPermissions(false);
    dispatch(setAclRules(data.aclRules));
    console.log(data.aclRules);
  };

  // Function to handle category creation
  const handleCategoryCreated = (newCategory) => {
    console.log("New category created:", newCategory);

    // Transform ACL Rules to match backend format
    const transformedAclRules =
      permissionsData.aclRules && permissionsData.aclRules.length > 0
        ? permissionsData.aclRules.map((rule) => {
            let permissionsArray = [];
            if (Array.isArray(rule.permissions)) {
              permissionsArray = rule.permissions
                .filter((p) => p != null)
                .map((p) => {
                  if (typeof p === "object" && p.code) {
                    return p.code;
                  } else if (typeof p === "string" && p.trim() !== "") {
                    return p.trim();
                  }
                  return null;
                })
                .filter((p) => p != null);
            } else if (
              typeof rule.permissions === "string" &&
              rule.permissions.trim() !== ""
            ) {
              permissionsArray = [rule.permissions.trim()];
            }

            return {
              principalId: String(rule.principalId || ""),
              principalType: rule.principalType === "user" ? 1 : 2, // Convert to numeric: 1 = user, 2 = role
              permissions: permissionsArray,
              accessType: rule.accessType === 0 ? 0 : 1, // Keep numeric format: 0 = deny, 1 = allow
            };
          })
        : [];

    // Add the new category to our local state with permissions
    const categoryToAdd = {
      id: Date.now(), // Generate unique ID
      name: newCategory.name,
      documentTypeId: newCategory.documentTypeId,
      parentId: newCategory.parentCategoryId || null,
      aclRules: transformedAclRules,
    };

    if (categoryType === "child") {
      // Add to child categories
      const updatedChildren = [...categoryData, categoryToAdd];
      setCategoryData(updatedChildren);

      // Also update the mock data for persistence
      const parentId = currentParentCategoryId;
      if (parentId) {
        mockChildCategories[parentId] = [
          ...(mockChildCategories[parentId] || []),
          categoryToAdd,
        ];
      }
    } else {
      // Add to parent categories
      const updatedCategories = [...categoryData, categoryToAdd];
      setCategoryData(updatedCategories);

      // Also update the mock data for persistence
      const docTypeId = currentDocTypeId;
      if (docTypeId) {
        mockCategoryData[docTypeId] = [
          ...(mockCategoryData[docTypeId] || []),
          categoryToAdd,
        ];
      }
    }

    // ✅ EXACT BACKEND FORMAT - Ready to send to API
    const backendPayload = {
      name: newCategory.name,
      documentTypeId: newCategory.documentTypeId,
      parentCategoryId: newCategory.parentCategoryId || 0,
      aclRules: transformedAclRules,
    };

    console.log("=== EXACT BACKEND PAYLOAD (Ready to Send) ===");
    console.log(JSON.stringify(backendPayload, null, 2));
    console.log("=============================================");

    // Show success message
    alert(
      t("categoryCreatedSuccessAlert", { categoryName: newCategory.name }) ||
        `Category "${newCategory.name}" created successfully!`
    );

    // Reset permissions after category creation
    setPermissionsData({
      aclRules: [],
    });
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
      return (
        t("manageChildCategories") ||
        "Manage child categories for the selected parent category"
      );
    }
    if (categoryType === "parent") {
      return (
        t("manageParentCategories") ||
        "Manage parent categories for the selected document type"
      );
    }
    return (
      t("createNewCategory") || "Create a new category and manage existing ones"
    );
  };

  // Function to handle category updates from CategoryTable
  const handleCategoryUpdate = (updatedCategories) => {
    setCategoryData(updatedCategories);
  };

  return (
    <section className="p-8">
      {/* Page Header */}
      <div className="mb-1">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 ">
          {getPageTitle()}
        </h1>
        <p className="text-gray-600">{getDescription()}</p>

        {/* Show current context */}
        <div className="mt-3 flex flex-wrap gap-4">
          {currentDocTypeId && (
            <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <span className="text-sm">
                {t("documentTypeId") || "Document Type ID"}: {currentDocTypeId}
              </span>
            </div>
          )}
          {currentParentCategoryId && (
            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <span className="text-sm">
                {t("parentCategoryId") || "Parent Category ID"}:{" "}
                {currentParentCategoryId}
              </span>
            </div>
          )}
          {categoryType && (
            <div className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium capitalize">
              <span className="text-sm">
                {t("type") || "Type"}: {categoryType}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-md">
          <h4 className="font-semibold mb-1 text-sm">
            {t("error") || "Error"}:
          </h4>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <FileCategoryForm
            onDocumentTypeSelect={handleDocumentTypeSelect}
            onCategoryCreated={handleCategoryCreated}
            currentDocTypeId={currentDocTypeId}
            currentParentCategoryId={currentParentCategoryId}
          />

          {/* Permissions Card - Show when document type is selected */}

          <div className="mt-4 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Shield className="w-5 h-5 text-orange-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {t("permissions") || "Permissions"}
                </h2>
              </div>
            </div>

            <div className="p-6">
              <button
                type="button"
                onClick={handlePermissions}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors font-medium"
              >
                <Shield className="w-4 h-4" />
                {t("configurePermissions") || "Configure Permissions"}
                {permissionsData.aclRules.length > 0 && (
                  <span className="bg-orange-800 text-white px-2 py-1 rounded-full text-xs">
                    {permissionsData.aclRules.length}
                  </span>
                )}
              </button>

              {/* Show configured permissions count */}
              {permissionsData.aclRules.length > 0 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm font-semibold text-green-900">
                    {t("Permission Rules Configured ")}
                    {permissionsData.aclRules.length}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="lg:col-span-2">
          <CategoryTable
            currentDocTypeId={currentDocTypeId}
            currentParentCategoryId={currentParentCategoryId}
            onDocumentTypeChange={handleDocumentTypeSelect}
            onCategoryUpdate={handleCategoryUpdate}
            initialCategories={categoryData}
          />
        </div>
      </div>

      {/* Permissions Popup */}
      {openPermissions && (
        <Popup
          isOpen={openPermissions}
          setIsOpen={setOpenPermissions}
          component={
            <UsersRolesPermissionsTable
              entityType="category"
              onDone={handlePermissionsDataChange}
              savedData={permissionsData}
            />
          }
        />
      )}

      {/* Quick Stats */}
      {status === "succeeded" && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-1">
          {/* Stats are commented out but available if needed */}
        </div>
      )}
    </section>
  );
}

export default React.memo(CreateCategory);
