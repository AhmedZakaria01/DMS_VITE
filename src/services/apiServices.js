/**
 * This component sets up a pre-configured Axios instance with a base URL and default headers,
 * and provides reusable functions for handling Apis with encrypted token storage
 */

import axios from "axios";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";

const VITE_APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL;
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;

// Encrypt Token
const encryptToken = (token) => {
  try {
    return CryptoJS.AES.encrypt(token, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error("Token encryption failed:", error);
    return null;
  }
};

// Decrypt Token
export const decryptToken = (encryptedToken) => {
  try {
    const decryptedBytes = CryptoJS.AES.decrypt(encryptedToken, ENCRYPTION_KEY);
    return decryptedBytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error("Token decryption failed:", error);
    return null;
  }
};

// API Structure
const api = axios.create({
  baseURL: VITE_APP_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "ngrok-skip-browser-warning": "true",
  },
});

// Interceptors
api.interceptors.request.use(
  (config) => {
    const encryptedToken = localStorage.getItem("token");

    if (encryptedToken) {
      const token = decryptToken(encryptedToken);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // Token decryption failed, remove invalid cookie
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        console.warn("Invalid token detected, removing cookie");
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      const navigate = useNavigate();

      // Token expired or invalid, clear cookie and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      console.warn("Token expired, redirecting to login");
      // redirect to login page
      navigate("/login");
    }
    return Promise.reject(error);
  }
);

//! Authentication
// Check if user is authenticated
export const isAuthenticated = () => {
  const encryptedToken = localStorage.getItem("token");
  if (!encryptedToken) return false;

  const token = decryptToken(encryptedToken);

  return !!token; // Returns true if token exists and can be decrypted
};

// Login Method
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("Authenticate/Login", credentials);
    const { token, id, email } = response.data.response;
    // console.log(response.data.response);
    localStorage.setItem("userId", id);
    localStorage.setItem("email", email);
    // console.log(id);
    // console.log(email);
    if (!token) {
      throw new Error("No token received from server");
    }

    // Encrypt token before storing
    const encryptedToken = encryptToken(token);

    if (encryptedToken) {
      localStorage.setItem("token", encryptedToken, {
        expires: 1, // 1 day
        secure: true, // HTTPS only
        sameSite: "Strict", // CSRF protection
      });
    } else {
      throw new Error("Token encryption failed");
    }

    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// Get decrypted token (for debugging or other use cases)
export const getToken = () => {
  const encryptedToken = localStorage.getItem("token");
  return encryptedToken ? decryptToken(encryptedToken) : null;
};

//! Audit Trail
// Fetch Audit Trail
export async function getAuditTrail() {
  try {
    const response = await api.get("AuditLog");
    return response;
  } catch (err) {
    console.error("Failed to Fetch Audit Trail", err);
    throw err;
  }
}

//! Document
export async function createNewDocument(data) {
  try {
    const response = await api.post("Document/Create", data);
    console.log(response);

    return response;
  } catch (err) {
    throw new Error("Create Document Failed", err);
  }
}

//! Document Types
// Create Document Type
export async function createDocType(DocTypeData) {
  try {
    const response = await api.post("DocumentType/Create", DocTypeData);
    return response;
  } catch (err) {
    console.error("Failed to Create Doc Type", err);
    throw err;
  }
}

// Get Document Types by Repository
export async function getDocTypesByRepo(repoId) {
  try {
    const response = await api.get(
      // `DocumentType/GetPermittedDocumentTypes/${repoId}`
      `DocumentType/GetPermittedDocumentTypes/${repoId}`
    );
    console.log(response);

    return response;
  } catch (err) {
    console.error("Failed to Fetch Doc Types", err);
    throw err;
  }
}

// Get Document Type by ID
export async function getDocTypeByAttributes(docTypeId) {
  try {
    const response = await api.get(
      `DocumentType/GetPermittedDocumentTypeDetailsById/${docTypeId}`
    );
    return response;
  } catch (err) {
    console.error("Failed to Fetch Doc Type", err);
    throw err;
  }
}

// Update Document Type Details
export async function updateDocType(docTypeId, docTypeData) {
  try {
    const response = await api.put(
      `DocumentType/UpdateDocumentTypeDetails/${docTypeId}`,
      docTypeData
    );
    return response;
  } catch (err) {
    console.error("Failed to Update Doc Type", err);
    throw err;
  }
}

// Delete Document Type
export async function deleteDocType(docTypeId) {
  try {
    const response = await api.delete(`DocumentType/Delete/${docTypeId}`);
    return response;
  } catch (err) {
    console.error("Failed to Delete Doc Type", err);
    throw err;
  }
}

//! Repository
// Create New Repository
export async function createNewRepository(repoData) {
  try {
    const response = await api.post("Repository/CreateRepository", repoData);
    return response;
  } catch (err) {
    console.error("Failed To Create Repository ", err);

    // Extract the actual error message from the response
    if (err.response?.data) {
      const errorData = err.response.data;

      // Check if there are specific error messages in the errors array
      if (errorData.errors && errorData.errors.length > 0) {
        const errorMessage = errorData.errors[0].message;
        throw new Error(errorMessage);
      }

      // Fallback to general message if available
      if (errorData.message) {
        throw new Error(errorData.message);
      }
    }

    // Fallback to generic error
    throw new Error("Failed to create repository. Please try again.");
  }
}

// Get All Repositories
export async function getAllRepos() {
  try {
    const response = await api.get(`Repository/GetAllRepositories`);
    console.log(response);
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

// Update Repository
export async function updateRepositoryDetails(repoId, backendData) {
  try {
    const response = await api.put(
      `Repository/UpdateRepositoryDetails?id=${repoId}`,
      backendData
    );
    return response;
  } catch (err) {
    console.error("Failed To Update Repository Details ", err);

    if (err.response?.data) {
      const errorData = err.response.data;

      if (errorData.errors && errorData.errors.length > 0) {
        const errorMessage = errorData.errors[0].message;
        throw new Error(errorMessage);
      }

      // Fallback to general message if available
      if (errorData.message) {
        throw new Error(errorData.message);
      }
    }

    throw new Error("Failed to update repository. Please try again.");
  }
}

// Get Repository by ID
export async function getRepositoryById(id) {
  try {
    const response = await api.get(
      `Repository/GetRepositoryDetailsById?id=${id}`
    );
    return response;
  } catch (err) {
    console.error("Failed To Get Repository ", err);

    if (err.response?.data) {
      const errorData = err.response.data;

      if (errorData.errors && errorData.errors.length > 0) {
        const errorMessage = errorData.errors[0].message;
        throw new Error(errorMessage);
      }

      // Fallback to general message if available
      if (errorData.message) {
        throw new Error(errorData.message);
      }
    }

    // Fallback to generic error
    throw new Error("Failed to get repository. Please try again.");
  }
}

// Get User Repos
export async function getUserRepos(userId) {
  try {
    if (!userId) return;

    const response = await api.get(
      `Repository/GetRepositoriesByUser/${userId}`
    );
    console.log(response);
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

//! Folder
// Create Folder
export async function createFolder(data) {
  try {
    const response = await api.post("Folder/CreateFolder", data);
    console.log(response);
    return response;
  } catch (error) {
    throw new Error(error);
  }
}

// Fetch Folder Contents
export async function getFolderContents(folderId) {
  try {
    const response = await api.get(
      `Folder/GetFolderContentsById?id=${folderId}`
    );
    console.log(folderId);
    return response;
  } catch (err) {
    console.error("Failed to Fetch Folder Contents", err);
    throw err;
  }
}

//! Files
// Upload Single File
export async function upload_Single_File(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post(`temp-files/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(response);
    return response.data;
  } catch (err) {
    console.error("Failed to Upload File", err);
    throw err;
  }
} // Delete Single File
export async function delete_Single_File(id) {
  try {
    const response = await api.delete(`temp-files/${id}`);
    console.log(response);
    return response.data;
  } catch (err) {
    console.error("delete to Upload File", err);
    throw err;
  }
}

//! Category
// Create a New Category
export async function createNewCategory(categoryData) {
  try {
    const response = await api.post("Category/Create", categoryData);
    console.log(response);

    return response.data;
  } catch (err) {
    console.error("Failed To Create a New Category ", err);
    throw err;
  }
}
// Get Parent Categories
export async function fetchParentCategories(documentTypeId) {
  try {
    const response = await api.get(
      `Category/GetParentCategoriesByDocumentType/${documentTypeId}`
    );
    console.log(response);

    const data = response.data;

    if (data.statusCode === 200) {
      return data.response;
    } else {
      throw new Error(data.message || "Failed to fetch parent categories");
    }
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}

// Get Childs From Parent
export async function getChildCategories(parentCategoryId) {
  try {
    const data = await api.get(
      `Category/GetChildCategories/${parentCategoryId}`
    );
    console.log(parentCategoryId);

    console.log(data.data.response);
    return data.data.response;
  } catch (error) {
    throw new Error(error);
  }
}

//! Principles
export async function getPrinciples(id) {
  try {
    const response = await api.get(
      `Principles/availablePrincipals?repoId=${id}`
    );
    return response;
  } catch (err) {
    console.err("Failed to Fetch  Principles ", err);
  }
}

//! Users
// Get All Users
export async function getAllUsers() {
  try {
    const response = await api.get(`Users/GetAllUsers/GetAllUsers`);
    return response;
  } catch (err) {
    console.err("Failed to Fetch All Users", err);
  }
}

// Create User
export async function createNewUser(userData) {
  try {
    const response = await api.post("Users/AddUser/AddUser", userData);
    return response;
  } catch (err) {
    console.error("Failed to Create User", err);
    throw err;
  }
}
// Update User
export async function updateNewUser(userData) {
  try {
    const response = await api.put(
      `Users/UpdateUser/UpdateUser/${userData.id}`,
      userData
    );
    return response;
  } catch (err) {
    console.error("Failed to Update User", err);
    throw err;
  }
}

//! Roles
// Fetch Roles
export async function getRoles() {
  try {
    const response = await api.get("Roles/GetAllRoles");
    return response;
  } catch (err) {
    console.error("Failed to Fetch Roles", err);
    throw err;
  }
}

// Create New Role
export async function createNewRole(roleData) {
  try {
    const response = await api.post("Roles/CreateRolePermissions", roleData);
    return response;
  } catch (err) {
    console.error("Failed to Create Role", err);
    throw err;
  }
}

// Update Role
export async function updateRole(roleData) {
  try {
    const { id, ...updateData } = roleData;
    const response = await api.put(`/Roles/${id}`, updateData);
    return response;
  } catch (err) {
    console.error("Failed to Update Role", err);
    throw err;
  }
}

//! Permissions
// Fetch Permissions for Repository
export async function getPermissions() {
  try {
    const response = await api.get("Permissions/GetRepositoryPermissions");
    return response;
  } catch (err) {
    console.error("Failed to Fetch Repository Permissions", err);
    throw err;
  }
}

// available Permissions for Entity Type
export async function getAvailablePermission(type) {
  try {
    const response = await api.get(
      `Permissions/GetAvailablePermissionsForEntityType?entityType=${type}`
    );
    console.log(response);

    return response;
  } catch (err) {
    console.err("Failed to Repository Permissions", err);
  }
}

// fetch all External Permissions
export async function getScreensPermissions() {
  try {
    const response = await api.get("Permissions/GetScreensPermissions");
    return response;
  } catch (err) {
    console.error("Failed to Fetch Screen Permissions", err);
    throw err;
  }
}

//! Scan
// fetch Scanners
export async function getScanners() {
  try {
    const response = await axios.get("http://localhost:5000/scan/scanners");
    console.log(response);

    return response;
  } catch (err) {
    console.error("Failed to Fetch Scanners", err);
    throw err;
  }
}

//! Scan
// Scan Document
export async function scan(scanData) {
  try {
    const response = await axios.post(
      "http://localhost:5000/scan/scan",
      scanData
    );
    console.log(response);

    return response;
  } catch (err) {
    console.error("Failed to scan ", err);
    throw err;
  }
}

//! Folders & Documents
// Move Items (Folders/Documents)
export async function fetchRepoContents(repoid) {
  try {
    const response = await api.get(
      `Repository/GetRepositoryContentById?id=${repoid}`
    );
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.error("Failed to Fetch Folders and Documents", err);
    throw err;
  }
}
