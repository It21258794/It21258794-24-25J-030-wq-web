import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

export const apiRequest = async <T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  endpoint: string,
  token?: string,
  data?: Record<string, unknown>
): Promise<T> => {
  try {
    const response = await axios({
      method,
      url: `${BASE_URL}${endpoint}`,
      headers: token
        ? { Authorization: token, "Content-Type": "application/json" }
        : {},
      params: method === "GET" ? data : undefined,
      data: method !== "GET" ? data : undefined,
    });
    return response.data;
  } catch (error) {
    console.error(`Error in ${method} ${endpoint}:`, error);
    throw error;
  }
};
