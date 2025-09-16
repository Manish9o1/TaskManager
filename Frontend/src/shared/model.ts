export interface User {
  username: string;
}

export interface UserData {
  id: string;
  username: string;
  email: string;
}
export interface AuthResponse {
  isSuccess: boolean;
  result: LoginAuthResponse;
  message: string;
  errors: [];
}
export interface LoginAuthResponse {
  token: string;
  user: User;
}
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  role: number;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  assigneeId?: string;
  creatorId?: number;
  createdAt?: string;
  updatedAt?: string;
}
