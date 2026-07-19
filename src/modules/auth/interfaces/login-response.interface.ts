export interface LoginResponse {
  accessToken: string;
  refreshToken: string;

  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
  };
}
