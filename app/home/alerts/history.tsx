import { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { getCitizenId } from "../../../src/utils/storage";
import { AlertItem } from "../../../src/types/alert";
import api from "../../../src/utils/api";

export default function AlertHistory() {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
  try {
    const citizenId = await getCitizenId();
    if (!citizenId) return;

    const res = await api.get(`/alert/citizen/${citizenId}`);

    // ⭐ SORT + TAKE LAST 5 ONLY
    const sorted = res.data.sort(
      (a: AlertItem, b: AlertItem) =>
        new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime()
    );

    const latestFive = sorted.slice(0, 5);

    setAlerts(latestFive);

  } catch (err) {
    console.log("❌ Failed to load alerts:", err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    loadHistory();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#D50000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Alerts</Text>

      {alerts.length === 0 ? (
        <Text style={styles.empty}>No alerts found.</Text>
      ) : (
        <FlatList
          data={alerts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.timelineRow}>

              {/* LEFT TIMELINE LINE */}
              <View style={styles.timelineLine} />

              {/* MAIN CARD */}
              <View style={styles.card}>

                {/* ICON + TYPE */}
                <View style={styles.headerRow}>

                  {/* ICON CIRCLE */}
                  {/* <View style={styles.iconCircle}>
                    <Text style={styles.iconEmoji}>
                      {item.alertTypeName === "Fire"
                        ? "🔥"
                        : item.alertTypeName === "Police"
                        ? "👮‍♂️"
                        : item.alertTypeName === "Medical"
                        ? "🚨"
                        : "⚠️"}
                    </Text>
                  </View> */}

                  {/* TYPE LABEL */}
                  {/* <Text style={styles.type}>{item.alertTypeName}</Text> */}

                </View>

                {/* DESCRIPTION */}
                <View style={styles.descBox}>
                  <Text style={styles.descText}>
                    {item.description || "No Description"}
                  </Text>
                </View>

                {/* DATE */}
                <View style={styles.dateBox}>
                  <Text style={styles.dateText}>
                    {new Date(item.reportedAt).toLocaleString()}
                  </Text>
                </View>

              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

/* ==================== STYLES ===================== */

const styles = StyleSheet.create({

  container: { 
    flex: 1, 
    padding: 28, 
    backgroundColor: "#F3F5FF",
  },

  center: { 
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: { 
    fontSize: 34, 
    fontWeight: "900",
    color: "#7A0000",
    marginBottom: 30,
    textAlign: "center",
    letterSpacing: 1.4,
  },

  empty: { 
    textAlign: "center",
    marginTop: 40,
    fontSize: 18,
    opacity: 0.6,
  },

  timelineRow: {
    flexDirection: "row",
    marginBottom: 36,
  },

  timelineLine: {
    width: 5,
    backgroundColor: "rgba(112, 0, 0, 0.25)",
    borderRadius: 10,
    marginRight: 18,
    marginLeft: 18,

    shadowColor: "#721212ff",
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },

  /* CARD */
  card: {
    flex: 1,
    padding: 26,
    borderRadius: 24,

    backgroundColor: "rgba(255,255,255,0.98)",
    borderWidth: 1,
    borderColor: "rgba(120,0,0,0.18)",

    shadowColor: "#7A0000",
    shadowOpacity: 0.22,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 8 },
    elevation: 14,

    borderTopWidth: 7,
    borderTopColor: "#750606ff",
  },

  /* HEADER */
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },

  /* CIRCLE ICON */
  // iconCircle: {
  //   width: 46,
  //   height: 46,
  //   borderRadius: 23,
  //   backgroundColor: "rgba(255,0,0,0.12)",
  //   justifyContent: "center",
  //   alignItems: "center",
  //   marginRight: 12,
  // },

  // iconEmoji: {
  //   fontSize: 26,
  // },

  // type: { 
  //   fontSize: 21,
  //   fontWeight: "800",
  //   paddingVertical: 6,
  //   paddingHorizontal: 16,
  //   backgroundColor: "rgba(255,0,0,0.15)",
  //   borderRadius: 14,
  //   color: "#A00000",
  //   letterSpacing: 0.8,

  //   shadowColor: "#FF5A5A",
  //   shadowOpacity: 0.25,
  //   shadowRadius: 10,
  // },

  /* DESCRIPTION */
  descBox: {
    backgroundColor: "rgba(198, 67, 67, 0.04)",
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },

  descText: {
    fontSize: 17,
    color: "#c11111ff",
    fontWeight: "500",
    lineHeight: 24,
  },

  /* DATE PILL */
  dateBox: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "rgba(4, 4, 4, 0.07)",
    borderRadius: 30,

    shadowColor: "#5f3838ff",
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },

  dateText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#8a0404ff",
    fontStyle: "italic",
  },

});
