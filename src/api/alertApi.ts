import api from "../utils/api";

// Citizen creates alert
export const sendSOS = (payload: any) =>
  api.post("/alert/create", payload);
