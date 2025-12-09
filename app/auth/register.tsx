import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { registerRequest } from "../../src/api/authApi";

export default function RegisterScreen() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    nic: "",
    address: "",
    emergencyContact: "",
  });

  const update = (key: string, val: string) => {
    setForm({ ...form, [key]: val });
  };

  const validate = () => {
    if (!form.fullName.trim()) return "Full name is required";
    if (!form.email.includes("@")) return "Invalid email";
    if (!/^07\d{8}$/.test(form.phoneNumber))
      return "Phone must start with 07 and be 10 digits";
    if (form.password.length < 6)
      return "Password must be at least 6 characters";
    return null;
  };

  const handleRegister = async () => {
    const error = validate();
    if (error) {
      Alert.alert("Validation Error", error);
      return;
    }

    try {
      const res = await registerRequest(form);

      // SUCCESS → OTP Sent
      if (res.data.message?.includes("OTP")) {
        Alert.alert("Success", "OTP has been sent!");

        // Navigate to Verify OTP
        router.push(`/auth/verify-otp?email=${form.email}`);
      }
    } catch (err: any) {
      let msg = "Registration failed";

      const backendMsg = err.response?.data?.message;

      if (backendMsg) {
        if (typeof backendMsg === "object") {
          // Convert object errors → string
          msg = Object.values(backendMsg).flat().join("\n");
        } else {
          msg = backendMsg;
        }
      }

      Alert.alert("Error", msg);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.wrap}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.header}>Citizen Register</Text>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            onChangeText={(v) => update("fullName", v)}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={(v) => update("email", v)}
          />

          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            keyboardType="number-pad"
            onChangeText={(v) => update("phoneNumber", v)}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            onChangeText={(v) => update("password", v)}
          />

          <TextInput
            style={styles.input}
            placeholder="NIC"
            onChangeText={(v) => update("nic", v)}
          />

          <TextInput
            style={styles.input}
            placeholder="Address"
            onChangeText={(v) => update("address", v)}
          />

          <TextInput
            style={styles.input}
            placeholder="Emergency Contact"
            keyboardType="number-pad"
            onChangeText={(v) => update("emergencyContact", v)}
          />

          <TouchableOpacity style={styles.btn} onPress={handleRegister}>
            <Text style={styles.btnText}>Register</Text>
          </TouchableOpacity>

          <Text
            style={styles.link}
            onPress={() => router.replace("/auth/login")}
          >
            Already have an account? Login
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    backgroundColor: "#F8F5F2",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 25,
    borderRadius: 18,
    elevation: 6,
    shadowColor: "#B30000",
    shadowOpacity: 0.18,
    shadowRadius: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: "700",
    color: "#B30000",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 14,
    borderRadius: 10,
    marginTop: 12,
    backgroundColor: "#fafafa",
  },
  btn: {
    backgroundColor: "#B30000",
    padding: 15,
    borderRadius: 10,
    marginTop: 25,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    textAlign: "center",
    marginTop: 18,
    color: "#B30000",
    fontSize: 16,
    fontWeight: "600",
  },
});
