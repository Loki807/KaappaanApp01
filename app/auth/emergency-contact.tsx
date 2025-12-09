import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import api from "../../src/utils/api";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";

export default function EmergencyContact() {
  const [phone, setPhone] = useState("");

  const saveContact = async () => {
    const citizenId = await SecureStore.getItemAsync("citizenId");

    if (!citizenId) return Alert.alert("Error", "Citizen not found");

    const payload = { emergencyContact: phone };

    await api.put(`/citizen/update-emergency/${citizenId}`, payload);

    Alert.alert("Saved!", "Emergency contact added.");
    router.replace("/home/dashboard");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add Emergency Contact</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter phone number"
        keyboardType="number-pad"
        onChangeText={setPhone}
      />

      <TouchableOpacity style={styles.btn} onPress={saveContact}>
        <Text style={styles.btnText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1, justifyContent: "center" },
  header: { fontSize: 26, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 14,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#fafafa",
  },
  btn: { backgroundColor: "#B30000", padding: 16, borderRadius: 10 },
  btnText: { color: "#fff", textAlign: "center", fontSize: 18, fontWeight: "bold" },
});
