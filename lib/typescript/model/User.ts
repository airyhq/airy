export interface User {
  id: string;
  firstName: string;
  lastName: string;
  displayName: string;
  token: string;
  email?: string;
  isAuthSuccess?: boolean;
  onboarded?: boolean;
  error?: string;
}
