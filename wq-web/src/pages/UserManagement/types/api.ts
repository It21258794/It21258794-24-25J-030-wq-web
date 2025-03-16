export interface PredictionResult {
    dates: string[];
    values: number[];
  }
  
export type PredictionParameter = "ph" | "conductivity" | "turbidity";