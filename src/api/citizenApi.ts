import api from "../utils/api";

// Get emergency contact for that citizen
export const getEmergencyContact = (citizenId: string) =>
  api.get(`/citizen/emergency-contact/${citizenId}`);

// Update emergency contact number
export const updateEmergencyContact = (citizenId: string, emergencyContact: string) =>
  api.put(`/citizen/update-emergency/${citizenId}`, {
    emergencyContact,
  });
