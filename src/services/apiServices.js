/**
 * This component sets up a pre-configured Axios instance with a base URL and default headers,
 * and provides reusable functions for handling Apis with encrypted token storage
 */

import axios from "axios";
import Cookies from "js-cookie";
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
  },
});

// Interceptors
api.interceptors.request.use(
  (config) => {
    const encryptedToken = Cookies.get("token");

    if (encryptedToken) {
      const token = decryptToken(encryptedToken);

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        // Token decryption failed, remove invalid cookie
        Cookies.remove("token");
        Cookies.remove("refreshToken");
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
      Cookies.remove("token");
      Cookies.remove("refreshToken");
      console.warn("Token expired, redirecting to login");
      // redirect to login page
      navigate("/login");
    }
    return Promise.reject(error);
  }
);

// Login Method
export const loginUser = async (credentials) => {
  try {
    const response = await api.post("Authenticate/Login", credentials);
    const { token, id, email } = response.data.response;
    console.log(response.data.response);

    Cookies.set("userId", id);
    Cookies.set("email", email);
    console.log(id);
    console.log(email);

    if (!token) {
      throw new Error("No token received from server");
    }

    // Encrypt token before storing
    const encryptedToken = encryptToken(token);

    if (encryptedToken) {
      Cookies.set("token", encryptedToken, {
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

// Register Method
export const registerUser = async (data) => {
  try {
    const response = await api.post("/Authenticate/signup", data);
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error;
  }
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const encryptedToken = Cookies.get("token");
  if (!encryptedToken) return false;

  const token = decryptToken(encryptedToken);

  return !!token; // Returns true if token exists and can be decrypted
};

// Get decrypted token (for debugging or other use cases)
export const getToken = () => {
  const encryptedToken = Cookies.get("token");
  return encryptedToken ? decryptToken(encryptedToken) : null;
};

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
    throw new error(error);
  }
}

// Get All Repos
export async function getAllRepos() {
  try {
    const response = await api.get(`Repository/GetAllRepositories`);
    console.log(response);
    return response;
  } catch (error) {
    throw new error(error);
  }
}

// Fetch Audit Trail
export async function getAuditTrail() {
  try {
    const response = await api.get("AuditLog");
    return response;
  } catch (err) {
    console.err("Failed to Fetch Audit Trail", err);
  }
}

// Create User
export async function createNewUser(userData) {
  try {
    const response = await api.post("Authenticate/register", userData);
    return response;
  } catch (err) {
    console.err("Failed to Create User", err);
  }
}

// Create New Role
export async function createNewRole(roleData) {
  try {
    const response = await api.post("/Roles", roleData);
    return response;
  } catch (err) {
    console.err("Failed to Create Role", err);
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

// Update New Repository
export async function updateRepositoryDetails(id, repoData) {
  try {
    const response = await api.put(
      `Repository/UpdateRepositoryDetails?id=${id}`,
      repoData
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

    // Fallback to generic error
    throw new Error("Failed to create repository. Please try again.");
  }
}
export async function getRepositoryById(id) {
  try {
    const response = await api.get(
      `Repository/GetRepositoryDetailsById?id=${id}`
    );
    return response;
  } catch (err) {
    console.error("Failed To Update Repository ", err);

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
    throw new Error("Failed to create repository. Please try again.");
  }
}
// Fetch Repo Contents
export async function getRepoContents(id) {
  try {
    const response = await api.get(
      `Repository/GetRepositoryWithFoldersAndDocumentInfos/${id}`
    );
    return response;
  } catch (err) {
    console.err("Failed to Fetch Repos Contents", err);
  }
}
// Fetch Folder Contents
export async function getFolderContents(repoId, folderId) {
  try {
    const response = await api.get(
      `Folder/GetFolderInfoById?RepositoryId=${repoId}&folderId=${folderId}`
    );
    console.log(repoId, folderId);

    return response;
  } catch (err) {
    console.err("Failed to Fetch Folder Contents", err);
  }
} // Fetch Folder Contents
export async function getDocumentFiles(repoId, folderId) {
  try {
    const response = await api.get(
      `Folder/GetFolderInfoById?RepositoryId=${repoId}&folderId=${folderId}`
    );
    console.log(repoId, folderId);

    return response;
  } catch (err) {
    console.err("Failed to Fetch Folder Contents", err);
  }
}

//create a New Category
export async function createNewCategory(categoryData) {
  try {
    const response = await api.post("Category/Create", categoryData);
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
      `Category/GetCategoriesByDocumentType/${documentTypeId}`
    );
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

// Get All Users
export async function getUsers() {
  try {
    const response = await api.get("Users/GetAllUsers/GetAllUsers");
    return response;
  } catch (err) {
    console.err("Failed to Fetch Users", err);
  }
}

// Fetch Roles
export async function getRoles() {
  try {
    const response = await api.get("Roles/GetAllRoles");
    return response;
  } catch (err) {
    console.err("Failed to Fetch Roles", err);
  }
}

// Fetch Permissions
export async function getPermissions() {
  try {
    const response = await api.get("Permissions/GetRepositoryPermissions");
    return response;
  } catch (err) {
    console.err("Failed to Fetch Roles", err);
  }
}
