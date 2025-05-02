import axios from "axios";
import { PredictionResult, PredictionParameter } from "../types/api";

const BASE_URL = "http://localhost:8080/api";

const getPredcitions = async <T>(
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

const getFutureAllPredictions = async <T>(
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

export const getPredictions = async (
  days: number,
  parameter: PredictionParameter,
  isPast: boolean,
  token: string
): Promise<PredictionResult> => {
  const params = {
    days,
    parameter,
    isPast,
  };

  return getPredcitions<PredictionResult>(
    "/water-quality/predictions",
    params,
    token
  );
};

export const getFuturePredictions = async (
  parameterName: PredictionParameter,
  page: number,
  size: number,
  token: string
): Promise<PredictionResult> => {
  const params = {
    parameterName,
    page,
    size,
  };

  return getFutureAllPredictions<PredictionResult>(
    "/water-quality/future-predictions",
    params,
    token
  );
};
