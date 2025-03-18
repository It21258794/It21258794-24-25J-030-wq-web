// api.ts
import axios from "axios";
import { AuthContext } from "../../components/auth/AuthProvider";
import React from "react";
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
          Authorization: token
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
          Authorization: token
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
          Authorization: token
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};


// Function to get all chemicals
export const getChemicals = async (token: string) => {
  try {

    const response = await axios.get(`${BASE_URL}/chemicals/get/all-chemicals`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching chemicals:", error);
    throw error;
  }
};

// Function to get all tests
export const getTests = async (token: string) => {
  try {

    const response = await axios.get(`${BASE_URL}/tests/get/all-tests`, {
      
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching tests:", error);
    throw error;
  }
};

// Function to get all steps
export const getSteps = async (token: string) => {
  try {

    const response = await axios.get(`${BASE_URL}/steps/get/all-steps`, {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching steps:", error);
    throw error;
  }
};

export const updateStepOrder = async (token: string, steps: { id: number; stepOrder: number }[]) => {
  try {
    const response = await fetch(`${BASE_URL}/steps/update/step-order`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,

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


// Function to add a step value
export const createStepValue = async (
  token: string,
  payload: {
    stepId: number;
    testId?: number;
    chemicalId?: number;
    testValue?: string;
    chemicalValue?: string;
    status?: string;
  }
) => {
  try {
    const response = await axios.post(
      `${BASE_URL}/step-values/create`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};



export const getStepValuesByStepId = async (token: string, stepId: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/step-values/get-by-step/${stepId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching step values:", error);
    throw error;
  }
};


export const updateStepValue = async (
  id: number | undefined | null,
  stepId: number,
  testValue: number | null,
  chemicalValue: number | null,
  token: string
) => {
  try {
    // Check if id is undefined or null
    if (id === undefined || id === null) {
      throw new Error("Step value ID is required");
    }

    console.log(`Updating step value with ID: ${id}, stepId: ${stepId}`);
    console.log(`Test value: ${testValue}, Chemical value: ${chemicalValue}`);

    const response = await axios.put(
      `${BASE_URL}/step-values/update-test-or-chemical-values/${id}/${stepId}`,
      {
        stepId: stepId,
        testId: testValue !== null ? id : null, // If testValue is provided, set testId
        chemicalId: chemicalValue !== null ? id : null, // If chemicalValue is provided, set chemicalId
        testValue: testValue,
        chemicalValue: chemicalValue,
        valueAddedDate: new Date().toISOString(), // Add the current date and time
        status: "Confirmed", // Set the status to "Confirmed"
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );
    console.log("Update successful, response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error updating step value:", error);
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data);
    }
    throw error;
  }
};

// Function to fetch all step values
export const getAllStepValues = async (token: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/step-values/get-all-step-values`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });
    console.log("Step values fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching step values:", error);
    if (axios.isAxiosError(error)) {
      console.error("Axios error details:", error.response?.data);
    }
    throw error;
  }
};

// Function to predict treated water values
export const predictTreatedWater = async (
  data: {
    raw_turbidity: number;
    raw_ph: number;
    raw_conductivity: number;
  },
  token: string // Add token as a parameter
) => {
  try {
    const response = await axios.post(`${BASE_URL}/water-treatment/predict`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: token, // Include the token in the headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error predicting treated water values:", error);
    throw error;
  }
};