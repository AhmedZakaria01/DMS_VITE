/**
 * This component sets up a pre-configured Axios instance with a base URL and default headers,
 * and provides reusable functions for handling Apis with encrypted token storage
 */

import axios from "axios";
import Cookies from "js-cookie";
import CryptoJS from "crypto-js";
import { useNavigate } from "react-router-dom";
import { useReducer, useState } from "react";
import { useSelector } from "react-redux";

const VITE_APP_BASE_URL = import.meta.env.VITE_APP_BASE_URL;
const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY;
const encryptToken = (token) => {
  try {
    return CryptoJS.AES.encrypt(token, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error("Token encryption failed:", error);
    return null;
  }
};

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
    const response = await api.post("Authenticate/login", credentials);
    const { token, id, userName } = response.data.response;
    console.log(response.data.response);

    Cookies.set("userId", id);
    Cookies.set("userName", userName);
    console.log(id);
    console.log(userName);

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
