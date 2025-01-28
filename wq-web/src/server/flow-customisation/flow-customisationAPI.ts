// api.ts
import axios from "axios";

// Base API URL
const BASE_URL = "http://localhost:8085/api";

// Function to add a step
export const createStep = async (
  token: string,
  payload: { stepName: string; stepOrder: number; stepDescription: string }
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/steps/create`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiI0ZjlhYTIxOS0yMjY4LTQxYWEtYTU5MC1lZjVlM2QyMGU2NzMiLCJleHAiOjE3MzgwOTQ0NzZ9.msCIuWMtkAPvFqyXqmNWfpHM7EOXsf7NwJ41cqpwh2o`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

// Function to add a test
export const addTest = async (
  testName: string,
  testValue: string,
  testDescription: string,
  token: string
) => {
  const payload = { testName, testValue, testDescription };

  try {
    const response = await axios.post(
      `${BASE_URL}/tests/create`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiI0ZjlhYTIxOS0yMjY4LTQxYWEtYTU5MC1lZjVlM2QyMGU2NzMiLCJleHAiOjE3MzgwOTM0MTR9.7rV7sGhZFfHFw6ftpSJscZhjk5V7fqfCiYOLyDL6zhU`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};


// Function to add a chemical
export const createChemical = async (
  chemicalName: string,
  chemicalType: string,
  token: string
) => {
  const payload = { chemicalName, chemicalType };

  try {
    const response = await axios.post(
      `${BASE_URL}/chemicals/create`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiI0ZjlhYTIxOS0yMjY4LTQxYWEtYTU5MC1lZjVlM2QyMGU2NzMiLCJleHAiOjE3MzgwOTM0MTR9.7rV7sGhZFfHFw6ftpSJscZhjk5V7fqfCiYOLyDL6zhU`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};


// Function to get all chemicals
export const getChemicals = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/chemicals/get/all-chemicals`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiI0ZjlhYTIxOS0yMjY4LTQxYWEtYTU5MC1lZjVlM2QyMGU2NzMiLCJleHAiOjE3MzgwOTM0MTR9.7rV7sGhZFfHFw6ftpSJscZhjk5V7fqfCiYOLyDL6zhU`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching chemicals:", error);
    throw error;
  }
};

// Function to get all tests
export const getTests = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/tests/get/all-tests`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiI0ZjlhYTIxOS0yMjY4LTQxYWEtYTU5MC1lZjVlM2QyMGU2NzMiLCJleHAiOjE3MzgwOTM0MTR9.7rV7sGhZFfHFw6ftpSJscZhjk5V7fqfCiYOLyDL6zhU`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tests:", error);
    throw error;
  }
};

// Function to get all steps
export const getSteps = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/steps/get/all-steps`, {
      headers: {
        "Content-Type": "application/json",
          Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiI0ZjlhYTIxOS0yMjY4LTQxYWEtYTU5MC1lZjVlM2QyMGU2NzMiLCJleHAiOjE3MzgwOTQzMjJ9.wE6M5zRTjgKwhm6ZRn1sIi4JW5JpiSNhpbLltbwP8Mk`,
           },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching steps:", error);
    throw error;
  }
};
