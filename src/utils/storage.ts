import * as SecureStore from "expo-secure-store";

export const saveToken = (token: string) =>
  SecureStore.setItemAsync("token", token);

export const saveCitizenId = (id: string) =>
  SecureStore.setItemAsync("citizenId", id);

export const saveName = (name: string) =>
  SecureStore.setItemAsync("name", name);

export const saveEmail = (email: string) =>
  SecureStore.setItemAsync("email", email);

// GETTERS
export const getToken = () => SecureStore.getItemAsync("token");
export const getCitizenId = () => SecureStore.getItemAsync("citizenId");
export const getName = () => SecureStore.getItemAsync("name");
export const getEmail = () => SecureStore.getItemAsync("email");

// LOGOUT
export const clearAll = async () => {
  await SecureStore.deleteItemAsync("token");
  await SecureStore.deleteItemAsync("citizenId");
  await SecureStore.deleteItemAsync("name");
  await SecureStore.deleteItemAsync("email");
};
