import { User } from './user';

// Form types for UI validation (React Hook Form, Yup, Zod)
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm extends LoginForm {
  name: string;
  confirmPassword: string;
}

// Payload types for API requests
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

// Response types for API responses
export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

// Component props
export interface AuthScreenProps {
  onSuccess?: () => void;
}