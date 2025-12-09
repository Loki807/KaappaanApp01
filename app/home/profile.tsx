import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { getName, getEmail, clearAll } from "../../src/utils/storage";
import { router } from "expo-router";

export default function Profile() {
  const [info, setInfo] = useState({ name: "", email: "" });

  useEffect(() => {
    (async () => {
      const name = await getName();
      const email = await getEmail();
      setInfo({ name: name || "", email: email || "" });
    })();
  }, []);

  const logout = async () => {
    await clearAll();
    router.replace("/auth/login");
  };

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.headerBox}>
        <Text style={styles.headerTitle}>My Profile</Text>

        <View style={styles.avatarShadow}>
          <View style={styles.avatarBox}>
            <Text style={styles.avatarText}>
              {info.name?.charAt(0)?.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>

      {/* NEW CARD DESIGN */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Personal Details</Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Full Name</Text>
          <Text style={styles.value}>{info.name}</Text>
        </View>

        <View style={styles.line} />

        <View style={styles.infoRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{info.email}</Text>
        </View>
      </View>

      {/* LOGOUT BUTTON */}
      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },

  /* HEADER SECTION */
  headerBox: {
    backgroundColor: "rgba(101, 6, 6, 1)",
    paddingVertical: 55,
    borderBottomLeftRadius: 45,
    borderBottomRightRadius: 45,
    alignItems: "center",
    shadowColor: "rgba(213, 0, 0, 0.32)",
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 12,
  },

  headerTitle: {
    fontSize: 34,
    fontWeight: "900",
    color: "#fff",
    marginBottom: 25,
    letterSpacing: 1,
  },

  /* AVATAR */
  avatarShadow: {
    shadowColor: "#ffffff",
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },

  avatarBox: {
    width: 125,
    height: 125,
    borderRadius: 80,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 60,
    fontWeight: "900",
    color: "#B30000",
  },

  /* ⭐ NEW CARD DESIGN (YOUR REQUEST) ⭐ */
  card: {
    backgroundColor: "#fff",
    padding: 30,
    borderRadius: 20,
    marginHorizontal: 25,
    marginTop: -20,

    elevation: 8,
    shadowColor: "#B30000",
    shadowOpacity: 0.2,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 15,
    color: "#222",
  },

  infoRow: {
    marginVertical: 10,
  },

  label: {
    fontSize: 14,
    opacity: 0.6,
  },

  value: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 3,
    color: "#333",
  },

  line: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.08)",
    marginVertical: 12,
  },

  /* LOGOUT BTN */
  logoutBtn: {
    backgroundColor: "#D60000",
    paddingVertical: 16,
    borderRadius: 14,
    marginHorizontal: 25,
    marginTop: 40,
    shadowColor: "#B30000",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 10,
  },

  logoutText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
  },
});
