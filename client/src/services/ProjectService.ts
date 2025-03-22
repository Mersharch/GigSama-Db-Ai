import axios, { AxiosError } from "axios";

const API_URL = import.meta.env.VITE_API_URL; // Replace with your actual API URL

export const createProject = async (message: string, token: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/projects`,
      { message },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": true,
        },
      }
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(axiosError.response?.data?.message || "Sign up failed");
  }
};

export const continueProjectConversation = async (
  message: string,
  projectId: string,
  token: string
) => {
  try {
    const response = await axios.patch(
      `${API_URL}/projects`,
      { message, thread_id: projectId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "ngrok-skip-browser-warning": true,
        },
      }
    );

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(axiosError.response?.data?.message || "Sign up failed");
  }
};

export const projectById = async (id: string, token: string) => {
  try {
    const response = await axios.get(`${API_URL}/projects/${id}`, {
      headers: {
        "ngrok-skip-browser-warning": true,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(axiosError.response?.data?.message || "Sign up failed");
  }
};

export const allProjects = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/projects`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "ngrok-skip-browser-warning": true,
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(axiosError.response?.data?.message || "Sign up failed");
  }
};
