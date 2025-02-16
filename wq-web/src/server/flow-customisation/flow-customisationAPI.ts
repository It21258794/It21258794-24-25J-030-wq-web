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
          Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiI0ZjlhYTIxOS0yMjY4LTQxYWEtYTU5MC1lZjVlM2QyMGU2NzMiLCJleHAiOjE3Mzk3MjE5NDJ9.tiglE-V_R3yl930QOhdtTEejAzGLndY2g3tEaCZHthU`,
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
          Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiI0ZjlhYTIxOS0yMjY4LTQxYWEtYTU5MC1lZjVlM2QyMGU2NzMiLCJleHAiOjE3Mzk3MjE5NDJ9.tiglE-V_R3yl930QOhdtTEejAzGLndY2g3tEaCZHthU`,
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
          Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiI0ZjlhYTIxOS0yMjY4LTQxYWEtYTU5MC1lZjVlM2QyMGU2NzMiLCJleHAiOjE3Mzk3MjE5NDJ9.tiglE-V_R3yl930QOhdtTEejAzGLndY2g3tEaCZHthU`,
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
        Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiI0ZjlhYTIxOS0yMjY4LTQxYWEtYTU5MC1lZjVlM2QyMGU2NzMiLCJleHAiOjE3Mzk3MjE5NDJ9.tiglE-V_R3yl930QOhdtTEejAzGLndY2g3tEaCZHthU`,
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
        Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiI0ZjlhYTIxOS0yMjY4LTQxYWEtYTU5MC1lZjVlM2QyMGU2NzMiLCJleHAiOjE3Mzk3MjE5NDJ9.tiglE-V_R3yl930QOhdtTEejAzGLndY2g3tEaCZHthU`,
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
        Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiI0ZjlhYTIxOS0yMjY4LTQxYWEtYTU5MC1lZjVlM2QyMGU2NzMiLCJleHAiOjE3Mzk3MjE5NDJ9.tiglE-V_R3yl930QOhdtTEejAzGLndY2g3tEaCZHthU`,
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
        Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiI0ZjlhYTIxOS0yMjY4LTQxYWEtYTU5MC1lZjVlM2QyMGU2NzMiLCJleHAiOjE3Mzk3MjE5NDJ9.tiglE-V_R3yl930QOhdtTEejAzGLndY2g3tEaCZHthU`,

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
          Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiI0ZjlhYTIxOS0yMjY4LTQxYWEtYTU5MC1lZjVlM2QyMGU2NzMiLCJleHAiOjE3Mzk3MjE5NDJ9.tiglE-V_R3yl930QOhdtTEejAzGLndY2g3tEaCZHthU`,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};



export const getStepValuesByStepId = async (stepId: number, token: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/step-values/get-by-step/${stepId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiI0ZjlhYTIxOS0yMjY4LTQxYWEtYTU5MC1lZjVlM2QyMGU2NzMiLCJleHAiOjE3Mzk3MjE5NDJ9.tiglE-V_R3yl930QOhdtTEejAzGLndY2g3tEaCZHthU`,
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
          Authorization: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VQRVJfQURNSU4iLCJzdWIiOiI0ZjlhYTIxOS0yMjY4LTQxYWEtYTU5MC1lZjVlM2QyMGU2NzMiLCJleHAiOjE3Mzk3MjE5NDJ9.tiglE-V_R3yl930QOhdtTEejAzGLndY2g3tEaCZHthU`,
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