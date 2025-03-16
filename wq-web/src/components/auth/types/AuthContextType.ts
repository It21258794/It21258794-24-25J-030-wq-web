import { User } from "./User";

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    token: string,
    login: (userData: User, token:string, timeout:number) => void;
    logout: () => void;
    setHeader : (token:string) => void;
    isTokenExpired : () => void;
    setIsLoading:any;
  }