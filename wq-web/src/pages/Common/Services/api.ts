import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const login = async <T>(
  endpoint: string,
  data: Record<string, unknown>,
  token?: string
) => {
  try {
    const response = await axios.post<T>(`${BASE_URL}${endpoint}`, data, {
      headers: {
        Authorization: token ? token : '',
        'Content-Type': 'application/json'
      }
    });

    const keepAliveValue =
      response.headers['keep-alive'] ||
      response.headers['Keep-Alive'] ||
      response.headers['KEEP-ALIVE'];

    let timeoutValue = null;
    if (keepAliveValue) {
      const timeoutString = keepAliveValue.split('=')[1];
      timeoutValue = parseInt(timeoutString, 10);
    }

    return {
      data: response.data,
      authToken: response.headers['authorization'],
      timeout: timeoutValue
    };
  } catch (error) {
    console.error(`Error in POST ${endpoint}:`, error);
    throw error;
  }
};

const resetPasswordOtp = async <T>(
  endpoint: string,
  data: Record<string, unknown>
): Promise<any> => {
  try {
    const response = await axios.post<T>(`${BASE_URL}${endpoint}`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response;
  } catch (error) {
    console.error(`Error in POST ${endpoint}:`, error);
    throw error;
  }
};

const resetPassword = async <T>(
  endpoint: string,
  data: Record<string, unknown>,
  token?: string
): Promise<any> => {
  try {
    const response = await axios.post<T>(
      `${BASE_URL}${endpoint}?token=${token}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response;
  } catch (error) {
    console.error(`Error in POST ${endpoint}:`, error);
    throw error;
  }
};

const resetPasswordToken = async <T>(
  endpoint: string,
  data: Record<string, unknown>
): Promise<any> => {
  try {
    const response = await axios.post<T>(`${BASE_URL}${endpoint}`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response;
  } catch (error) {
    console.error(`Error in POST ${endpoint}:`, error);
    throw error;
  }
};

const changePassword = async <T>(
  endpoint: string,
  data: Record<string, unknown>
): Promise<any> => {
  try {
    const response = await axios.post<T>(`${BASE_URL}${endpoint}`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return response;
  } catch (error) {
    console.error(`Error in POST ${endpoint}:`, error);
    throw error;
  }
};

const createUser = async <T>(
  endpoint: string,
  data: Record<string, unknown>,
  token: string
): Promise<any> => {
  try {
    const response = await axios.post<T>(`${BASE_URL}${endpoint}`, data, {
      headers: {
        Authorization: token
      }
    });

    return response;
  } catch (error) {
    console.error(`Error in POST ${endpoint}:`, error);
    throw error;
  }
};

const changeStatus = async <T>(
  endpoint: string,
  token: string
): Promise<any> => {
  try {
    const response = await axios.post<T>(
      `${BASE_URL}${endpoint}`,
      {},
      {
        headers: {
          Authorization: token
        }
      }
    );

    return response;
  } catch (error) {
    console.error(`Error in POST ${endpoint}:`, error);
    throw error;
  }
};

export const forgetPasswordSendOtp = async <T>(email: string) => {
  const data = {email};
  return resetPasswordOtp<T>('/user/password-reset/otp', data);
};

export const forgetPasswordToken = async <T>(serverRef: any, otp: string) => {
  const data = {serverRef, otp};
  return await resetPasswordToken<T>('/user/password-reset/token', data);
};

export const forgetPassword = async <T>(
  email: string,
  password: string,
  token: string
) => {
  const data = {email, password};
  return resetPassword<T>('/user/password-reset', data, token);
};

export const changeCurrentPass = async <T>(
  email?: string,
  password?: any,
  currentPassword?: string
) => {
  const data = {email, password, currentPassword};
  return await changePassword<T>('/user/password-change', data);
};

export const signIn = async <T>(email: string, password: string) => {
  const data = {email, password};
  return await login<T>('/user/login', data);
};

export const registerUser = async <T>(user: any, token: string) => {
  const data = user;
  return await createUser<T>('/user', data, token);
};

export const changeUserStatus = async <T>(
  id: string,
  status: string,
  token: string
) => {
  return await changeStatus<T>(`/user/status-change/${id}/${status}`, token);
};
