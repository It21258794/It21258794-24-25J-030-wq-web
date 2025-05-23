import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const searchUsers = async <T>(
  endpoint: string,
  params: Record<string, unknown>,
  token: string
): Promise<T> => {
  try {
    const response = await axios.get<T>(`${BASE_URL}${endpoint}`, {
      headers: {
        Authorization: token,
      },
      params: params,
    });
    return response.data;
  } catch (error) {
    console.error(`Error in GET ${endpoint}:`, error);
    throw error;
  }
};

export const getUsers = async (
  page: number,
  size: number,
  query: string,
  startDate: any,
  endDate: any,
  userStatus: string,
  token: string
): Promise<any> => {
  const params: Record<string, any> = { page, size, startDate, endDate };

  if (query) {
    params.query = query;
  }
  if (userStatus) {
    params.status = userStatus;
  }

  return searchUsers<any>("/user/users", params, token);
};
