import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import * as Location from "expo-location";
import { router } from "expo-router";

import { sendSOS } from "../src/api/alertApi";
import { getCitizenId } from "../src/utils/storage"; // ✅ FIXED

export default function SOSScreen() {
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Permission Needed", "Enable location permission in settings.");
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setCoords({ lat: loc.coords.latitude, lng: loc.coords.longitude });
      console.log("Location →", loc.coords);
    })();
  }, []);

  const submitSOS = async () => {
    if (!coords) {
      Alert.alert("Error", "Location not available");
      return;
    }

    const citizenId = await getCitizenId(); // ✅ FIXED

    if (!citizenId) {
      Alert.alert("Error", "Citizen not found. Login again.");
      router.replace("/auth/login");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        citizenId: citizenId,  // ✅ FIXED
        alertTypeName: "SOS",
        latitude: coords.lat,
        longitude: coords.lng,
      };

      console.log("Sending SOS:", payload);

      await sendSOS(payload);

      Alert.alert("Success", "SOS alert sent!");
      router.push("/home/dashboard");
    } catch (e: any) {
      console.log(e.response?.data);
      Alert.alert("Error", "Failed to send SOS");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SOS Alert</Text>

      <TouchableOpacity style={styles.btn} onPress={submitSOS} disabled={loading}>
        <Text style={styles.btnText}>{loading ? "Sending..." : "SEND SOS"}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 20 },
  btn: {
    backgroundColor: "red",
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  btnText: { color: "#fff", fontSize: 20, textAlign: "center" },
});
