import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Image,
} from "react-native";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { loginRequest } from "../../src/api/authApi";
import { saveCitizenId, saveEmail, saveName } from "../../src/utils/storage";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = () => {
    if (!email.trim()) setEmailError("Email is required");
    else if (!email.includes("@")) setEmailError("Invalid email address");
    else setEmailError("");
  };

  const validatePassword = () => {
    if (!password.trim()) setPasswordError("Password is required");
    else if (password.length < 6)
      setPasswordError("Password must be at least 6 characters");
    else setPasswordError("");
  };

  const login = async () => {
    validateEmail();
    validatePassword();

    if (emailError || passwordError) return;

    if (!email || !password)
      return Alert.alert("Error", "Enter email & password");

    try {
      const res = await loginRequest(email, password);

      if (res.data?.citizenId) {
        await saveCitizenId(res.data.citizenId);
        await saveEmail(email);
        await saveName(res.data.fullName || res.data.name);
      }

      router.push(`/auth/verify-otp?email=${email}`);
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Login failed");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrap}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>

          {/* ⭐ Logo + Title */}
          <View style={styles.topRow}>
            <Image
              source={require("../../assets/logo.jpeg")}
              style={styles.logo}
            />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.appTitle}>Citizen App</Text>
              <Text style={styles.subText}>Emergency Protection</Text>
            </View>
          </View>

          {/* EMAIL */}
          <TextInput
            placeholder="Email"
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
            onChangeText={(v) => {
              setEmail(v);
              if (emailError) validateEmail();
            }}
            onBlur={validateEmail}
          />
          {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

          {/* PASSWORD */}
          <View style={styles.passwordWrapper}>
            <TextInput
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!show}
              style={[styles.input, { flex: 1 }]}
              onChangeText={(v) => {
                setPassword(v);
                if (passwordError) validatePassword();
              }}
              onBlur={validatePassword}
            />

            <TouchableOpacity
              onPress={() => setShow(!show)}
              style={styles.eyeBtn}
            >
              <Feather
                name={show ? "eye" : "eye-off"}
                size={28}
                color="#333333"
              />
            </TouchableOpacity>
          </View>

          {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

          {/* LOGIN BUTTON */}
          <TouchableOpacity style={styles.btn} onPress={login}>
            <Text style={styles.btnText}>Login</Text>
          </TouchableOpacity>

          {/* LINK */}
          <Text
            style={styles.link}
            onPress={() => router.replace("/auth/register")}
          >
            No account? Register
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
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 20,
    elevation: 8,
    shadowColor: "#B30000",
    shadowOpacity: 0.2,
    shadowRadius: 14,
  },

  logo: {
    width: 75,
    height: 75,
    resizeMode: "contain",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 22,
    marginLeft: -20,   // ⭐ ONLY CHANGE → Slightly more left shift
  },

  appTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: "#7A0000",
  },

  subText: {
    fontSize: 16,
    color: "#A00000",
    marginTop: 2,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 16,
    borderRadius: 10,
    marginTop: 12,
    backgroundColor: "#fafafa",
    fontSize: 18,
    color: "#333",
  },

  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },

  eyeBtn: {
    position: "absolute",
    right: 12,
    padding: 8,
  },

  error: {
    color: "#B30000",
    fontSize: 15,
    marginTop: 4,
    fontWeight: "600",
  },

  btn: {
    backgroundColor: "#B30000",
    padding: 18,
    borderRadius: 10,
    marginTop: 25,
  },

  btnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 20,
    fontWeight: "800",
  },

  link: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    color: "#B30000",
    fontWeight: "700",
  },
});
