import api from "../utils/api";

// Citizen register
export const registerRequest = (data: any) =>
  api.post("/citizen/register", data);

// Citizen + Admin + Responder login
export const loginRequest = (email: string, password: string) =>
  api.post("/auth/login", { email, password });

// Verify OTP (Citizen only)
export const verifyOtpRequest = (email: string, otp: string) =>
  api.post("/auth/verify-otp", { email, otp });
