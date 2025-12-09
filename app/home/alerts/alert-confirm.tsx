import * as Location from "expo-location";
import { router, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";

import api from "../../../src/utils/api";
import { sendSOS } from "../../../src/api/alertApi";

export default function AlertConfirm() {
  const { type } = useLocalSearchParams();
  const [description, setDescription] = useState("");
  const [coords, setCoords] = useState<any>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [emergencyPhone, setEmergencyPhone] = useState("");

  // COUNTDOWN STATES
  const [countdown, setCountdown] = useState<number | null>(null);
  const timerRef = useRef<any>(null);
  const pendingActionRef = useRef<() => void>(() => {});
  const waitingForLocation = useRef(false);

  // LOAD LOCATION + EMERGENCY CONTACT
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission needed");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      setLoadingLocation(false);

      const citizenId = await SecureStore.getItemAsync("citizenId");
      if (citizenId) {
        const res = await api.get(`/citizen/emergency-contact/${citizenId}`);
        setEmergencyPhone(res.data.emergencyContact);
      }
    })();
  }, []);

  // WAIT FOR LOCATION → THEN AUTO SEND
  useEffect(() => {
    if (waitingForLocation.current && coords) {
      waitingForLocation.current = false;
      pendingActionRef.current();
    }
  }, [coords]);

  // ⭐⭐⭐ AUTO-SEND RED ALERT (CRIME) WHEN LOCATION LOADED ⭐⭐⭐
  useEffect(() => {
    if (type === "Crime" && coords && !loadingLocation) {
      // AUTO SEND ONLY ONE TIME
      setTimeout(() => {
        sendOnlineAlert();
      }, 500);
    }
  }, [coords, loadingLocation, type]);
  // ----------------------------------------------------------

  // START COUNTDOWN
  const startCountdown = (action: () => void) => {
    setCountdown(5);
    pendingActionRef.current = action;

    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev! === 1) {
          clearInterval(timerRef.current);
          setCountdown(null);

          if (!coords) {
            waitingForLocation.current = true;
            return null;
          }

          action();
          return null;
        }

        return prev! - 1;
      });
    }, 1000);
  };

  const cancelAlert = () => {
    clearInterval(timerRef.current);
    setCountdown(null);
    waitingForLocation.current = false;
  };

  // SEND METHODS (UNCHANGED)
  const sendOnlineAlert = async () => {
    if (!coords) return;

    const citizenId = await SecureStore.getItemAsync("citizenId");

    const payload = {
      CitizenId: citizenId,
      AlertTypeName: type,
      Description: description || "No description",
      Latitude: coords.lat,
      Longitude: coords.lng,
      ReportedAt: new Date().toISOString(),
    };

    await sendSOS(payload);
    Alert.alert("Success", "Alert sent!");
    router.push("/home/dashboard");
  };

  const sendSMS = () => {
    const msg = `🚨 EMERGENCY ALERT
Type: ${type}
Desc: ${description}
Location: https://maps.google.com/?q=${coords?.lat},${coords?.lng}`;

    Linking.openURL(`sms:${emergencyPhone}?body=${encodeURIComponent(msg)}`);
  };

  const sendWhatsApp = () => {
    const phone = emergencyPhone.startsWith("0")
      ? `94${emergencyPhone.slice(1)}`
      : emergencyPhone;

    const msg = `🚨 EMERGENCY ALERT
Type: ${type}
Desc: ${description}
Location: https://maps.google.com/?q=${coords?.lat},${coords?.lng}`;

    Linking.openURL(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`);
  };

  return (
    <View style={styles.container}>

      {/* LOCATION LOADING OVERLAY */}
      {loadingLocation && (
        <View style={styles.locationOverlay}>
          <Text style={styles.locationText}>Getting your location…</Text>
        </View>
      )}

      {/* COUNTDOWN OVERLAY */}
      {countdown !== null && (
        <View style={styles.overlay}>
          <Text style={styles.countText}>Sending in {countdown}...</Text>

          <TouchableOpacity style={styles.cancelBtn} onPress={cancelAlert}>
            <Text style={styles.cancelText}>Cancel Alert</Text>
          </TouchableOpacity>
        </View>
      )}

      <Text style={styles.header}>Confirm {type} Alert</Text>

      <TextInput
        placeholder="Describe the situation"
        style={styles.input}
        multiline
        numberOfLines={4}
        onChangeText={setDescription}
      />

      {/* ONLINE ALERT */}
      <TouchableOpacity
        disabled={loadingLocation}
        style={[styles.btnOnline, loadingLocation && { opacity: 0.4 }]}
        onPress={() => startCountdown(sendOnlineAlert)}
      >
        <Text style={styles.btnText}>Send Online Alert</Text>
      </TouchableOpacity>

      {/* SMS */}
      <TouchableOpacity
        disabled={loadingLocation}
        style={[styles.btnSMS, loadingLocation && { opacity: 0.4 }]}
        onPress={() => startCountdown(sendSMS)}
      >
        <Text style={styles.btnText}>Send SMS Alert</Text>
      </TouchableOpacity>

      {/* WHATSAPP */}
      <TouchableOpacity
        disabled={loadingLocation}
        style={[styles.btnWhatsApp, loadingLocation && { opacity: 0.4 }]}
        onPress={() => startCountdown(sendWhatsApp)}
      >
        <Text style={styles.btnText}>Send WhatsApp Alert</Text>
      </TouchableOpacity>
    </View>
  );
}

// --------------------------
const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#fafafa",
    height: 120,
    marginBottom: 25,
  },

  btnOnline: {
    backgroundColor: "#B30000",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  btnSMS: {
    backgroundColor: "#333",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  btnWhatsApp: {
    backgroundColor: "#25D366",
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
  },

  overlay: {
    position: "absolute",
    zIndex: 99,
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  countText: {
    fontSize: 48,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 20,
  },
  cancelBtn: {
    backgroundColor: "red",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 12,
  },
  cancelText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },

  locationOverlay: {
    position: "absolute",
    zIndex: 200,
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  locationText: {
    fontSize: 26,
    color: "white",
    fontWeight: "bold",
  },
});
