export type User = {
  id: string;
  name: string;
  email: string;
};

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface AuthScreenProps {
  onSuccess?: () => void;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export type RegisterResponse = {
  id: string;
  name: string;
  email: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
};
