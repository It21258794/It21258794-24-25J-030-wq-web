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
          Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiI0ZjlhYTIxOS0yMjY4LTQxYWEtYTU5MC1lZjVlM2QyMGU2NzMiLCJleHAiOjE3MzgxNzEyNDB9.cGG59C6oipjGW8GBN_3wFaCVh_TkpO1ahqkKtdGv78c`,
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
          Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiI0ZjlhYTIxOS0yMjY4LTQxYWEtYTU5MC1lZjVlM2QyMGU2NzMiLCJleHAiOjE3MzgxNzEyNDB9.cGG59C6oipjGW8GBN_3wFaCVh_TkpO1ahqkKtdGv78c`,
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
          Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiI0ZjlhYTIxOS0yMjY4LTQxYWEtYTU5MC1lZjVlM2QyMGU2NzMiLCJleHAiOjE3MzgxNzEyNDB9.cGG59C6oipjGW8GBN_3wFaCVh_TkpO1ahqkKtdGv78c`,
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
        Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiI0ZjlhYTIxOS0yMjY4LTQxYWEtYTU5MC1lZjVlM2QyMGU2NzMiLCJleHAiOjE3MzgxNzEyNDB9.cGG59C6oipjGW8GBN_3wFaCVh_TkpO1ahqkKtdGv78c`,
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
        Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiI0ZjlhYTIxOS0yMjY4LTQxYWEtYTU5MC1lZjVlM2QyMGU2NzMiLCJleHAiOjE3MzgxNzEyNDB9.cGG59C6oipjGW8GBN_3wFaCVh_TkpO1ahqkKtdGv78c`,
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
        Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiI0ZjlhYTIxOS0yMjY4LTQxYWEtYTU5MC1lZjVlM2QyMGU2NzMiLCJleHAiOjE3MzgxNzEyNDB9.cGG59C6oipjGW8GBN_3wFaCVh_TkpO1ahqkKtdGv78c`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching steps:", error);
    throw error;
  }
};

export const updateStepOrder = async (steps: { id: number; stepOrder: number }[]) => {
  try {
    const response = await fetch(`${BASE_URL}/steps/update/step-order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiI0ZjlhYTIxOS0yMjY4LTQxYWEtYTU5MC1lZjVlM2QyMGU2NzMiLCJleHAiOjE3MzgxNzEyNDB9.cGG59C6oipjGW8GBN_3wFaCVh_TkpO1ahqkKtdGv78c`,

      },
      body: JSON.stringify(steps),
    });

    if (!response.ok) {
      throw new Error("Failed to update step order");
    }

    console.log("Step order updated successfully!");
  } catch (error) {
    console.error("Error updating step order:", error);
  }
};