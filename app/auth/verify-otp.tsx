import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image
} from "react-native";
import { verifyOtpRequest } from "../../src/api/authApi";
import { saveToken, saveCitizenId } from "../../src/utils/storage";
import api from "../../src/utils/api";

export default function VerifyOtp() {
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState("");

  const verify = async () => {
    if (!otp.trim()) return Alert.alert("Enter OTP");

    try {
      const res = await verifyOtpRequest(String(email), otp);

      await saveToken(res.data.token);
      await saveCitizenId(res.data.citizenId);

      // ⭐ CHECK EMERGENCY CONTACT
      const ec = await api.get(`/citizen/emergency-contact/${res.data.citizenId}`);

      if (!ec.data.emergencyContact || ec.data.emergencyContact === "") {
        router.replace("/auth/emergency-contact");
      } else {
        router.replace("/home/dashboard");
      }
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrap}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>

          <View style={styles.topRow}>
            <Image source={require("../../assets/logo.jpeg")} style={styles.logo} />
          </View>

          <Text style={styles.header}>Verify OTP</Text>
          <Text style={styles.sub}>OTP sent to {email}</Text>

          <TextInput
            placeholder="Enter OTP"
            placeholderTextColor="#999"
            onChangeText={setOtp}
            keyboardType="numeric"
            maxLength={6}
            style={styles.input}
          />

          <TouchableOpacity style={styles.btn} onPress={verify}>
            <Text style={styles.btnText}>Verify</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#F8F5F2" },
  container: { flexGrow: 1, justifyContent: "center", padding: 20 },
  card: {
    backgroundColor: "#ffffff",
    padding: 30,
    borderRadius: 20,
    elevation: 8,
  },
  logo: { width: 75, height: 75, resizeMode: "contain" },
  topRow: { flexDirection: "row", justifyContent: "center", marginBottom: 20 },
  header: {
    fontSize: 26,
    color: "#7A0000",
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 10,
  },
  sub: { textAlign: "center", color: "#A00000", marginBottom: 20, fontSize: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 16,
    borderRadius: 12,
    textAlign: "center",
    fontSize: 22,
    backgroundColor: "#fafafa",
    color: "#333",
    letterSpacing: 5,
  },
  btn: {
    backgroundColor: "#B30000",
    padding: 18,
    borderRadius: 12,
    marginTop: 25,
  },
  btnText: { color: "#fff", fontWeight: "800", textAlign: "center", fontSize: 20 },
});
