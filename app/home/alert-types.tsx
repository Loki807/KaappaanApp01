import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const alertTypes = [
  { name: "Fire", icon: "fire", color: "#D50000" },
  { name: "Crime", icon: "shield-alert", color: "#B00000" },
  { name: "Medical", icon: "hospital-box", color: "#00796B" },
  { name: "Accident", icon: "car-emergency", color: "#FF6F00" },
  { name: "StudentSOS", icon: "school", color: "#303F9F" },
  { name: "WomenSafety", icon: "human-female", color: "#C2185B" },
];

export default function AlertTypeList() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Alert Type</Text>

      {alertTypes.map((a) => (
        <TouchableOpacity
          key={a.name}
          style={[styles.card, { borderLeftColor: a.color }]}
          onPress={() =>
            router.push(`/home/alerts/alert-confirm?type=${a.name}`)
          }
        >
          {/* ✅ FIXED LINE (ONLY THIS CHANGED) */}
          <MaterialCommunityIcons name={a.icon as any} size={30} color={a.color} />

          <Text style={[styles.cardText, { color: a.color }]}>{a.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
//chnaged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#FAFAFA",
  },

  title: {
    fontSize: 30,
    fontWeight: "900",
    color: "#7A0000",
    textAlign: "center",
    marginBottom: 30,
    letterSpacing: 1.3,
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    marginBottom: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderLeftWidth: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },

  cardText: {
    marginLeft: 18,
    fontSize: 20,
    fontWeight: "800",
  },
});
