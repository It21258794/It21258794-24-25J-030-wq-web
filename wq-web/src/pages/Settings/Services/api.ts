import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getUserDetails = async <T>(
    endpoint: string,
    token: string
  ): Promise<any> => {
    try {
        const response = await axios.get<T>(
            `${BASE_URL}${endpoint}`,
            {
              headers: {
                Authorization:token
              },
            }
          );
  
      return response;
    } catch (error) {
      console.error(`Error in POST ${endpoint}:`, error);
      throw error;
    }
  };

const updateProfile = async <T>(
    endpoint: string,
    data: Record<string, unknown>,
    token: string
  ): Promise<any> => {
    try {
        const response = await axios.post<T>(
            `${BASE_URL}${endpoint}`,
            data,
            {
              headers: {
                Authorization:token
              },
            }
          );
  
      return response;
    } catch (error) {
      console.error(`Error in POST ${endpoint}:`, error);
      throw error;
    }
  };

export const getUser= async <T>(token: string) => {
    return await getUserDetails<T>("/user", token);
};

export const updateUserProfile = async <T>(user: any, token: string) => {
    const data = user;
    return await updateProfile<T>("/user/profile", data,token);
};


