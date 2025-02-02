import { api, setAuthToken } from "./api";

export const loginUser = async (credentials) => {
  const response = await api.post("/users/login", credentials);
  if (response.data.token) {
    setAuthToken(response.data.token);
  }
  return response.data;
};

export const registerUser = async (userData) => {
  return await api.post("/users/register", userData);
};
