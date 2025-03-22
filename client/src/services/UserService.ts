/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const signUp = async (userData: {
  email: string;
  password: string;
  name: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData, {
      headers: { "ngrok-skip-browser-warning": true },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Sign up failed");
  }
};

export const login = async (credentials: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, credentials, {
      headers: { "ngrok-skip-browser-warning": true },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const getUserDetails = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": true,
      },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Failed to fetch user details"
    );
  }
};
