import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FooterNav from "./FooterNav";

export default function Dashboard() {
  /* Animations */
  const blink = useRef(new Animated.Value(1)).current;

  const wave1 = useRef(new Animated.Value(0)).current;
  const wave2 = useRef(new Animated.Value(0)).current;
  const wave3 = useRef(new Animated.Value(0)).current;

  const flash1 = useRef(new Animated.Value(1)).current;
  const flash2 = useRef(new Animated.Value(1)).current;
  const flash3 = useRef(new Animated.Value(1)).current;
  const flash4 = useRef(new Animated.Value(1)).current;

  /* Wave Animation Function */
  const animateWave = (wave: Animated.Value, delay: number) =>
    Animated.loop(
      Animated.sequence([
        Animated.timing(wave, {
          toValue: 1,
          duration: 2000,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(wave, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();

  /* Flicker Animation */
  const flicker = (anim: Animated.Value, delay: number) =>
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 0.2,
          duration: 120,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }),
      ])
    ).start();

  /* Lightning Component */
  const Lightning = ({
    anim,
    style,
  }: {
    anim: Animated.Value;
    style: any;
  }) => (
    <Animated.View style={[styles.lightWrapper, style, { opacity: anim }]}>
      <View style={styles.lightTop} />
      <View style={styles.lightMid} />
      <View style={styles.lightBottom} />
    </Animated.View>
  );

  /* Start Animations */
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blink, {
          toValue: 0.3,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(blink, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
      ])
    ).start();

    animateWave(wave1, 0);
    animateWave(wave2, 600);
    animateWave(wave3, 1200);

    flicker(flash1, 0);
    flicker(flash2, 200);
    flicker(flash3, 400);
    flicker(flash4, 600);
  }, []);

  return (
    <View style={styles.container}>
      {/* TOP BANNER */}
      <View style={styles.topBanner}>
        <View style={styles.headerRow}>
          <View style={styles.logoCircle}>
            <Image source={require("../../assets/logo.jpeg")} style={styles.logo} />
          </View>

          <View>
            <Text style={styles.title}>Kaappaan</Text>
            <Text style={styles.subTitle}>Emergency Assistant</Text>
          </View>
        </View>

        <View style={styles.statusRow}>
  <MaterialCommunityIcons name="shield-check" size={26} color="#ffdddd" />
  <Text style={styles.statusText}>Always Ready</Text>
</View>

      </View>

      {/* CENTER AREA */}
      <View style={styles.centerArea}>
        {/* Lightning */}
        <Lightning anim={flash1} style={styles.light1} />
        <Lightning anim={flash2} style={styles.light2} />
        <Lightning anim={flash3} style={styles.light3} />
        <Lightning anim={flash4} style={styles.light4} />

        {/* WAVE EFFECTS */}
        <Animated.View
          style={[
            styles.wave,
            {
              transform: [
                {
                  scale: wave1.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 3.2],
                  }),
                },
              ],
              opacity: wave1.interpolate({
                inputRange: [0, 1],
                outputRange: [0.4, 0],
              }),
            },
          ]}
        />

        <Animated.View
          style={[
            styles.wave,
            {
              transform: [
                {
                  scale: wave2.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 4],
                  }),
                },
              ],
              opacity: wave2.interpolate({
                inputRange: [0, 1],
                outputRange: [0.35, 0],
              }),
            },
          ]}
        />

        <Animated.View
          style={[
            styles.wave,
            {
              transform: [
                {
                  scale: wave3.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 5],
                  }),
                },
              ],
              opacity: wave3.interpolate({
                inputRange: [0, 1],
                outputRange: [0.3, 0],
              }),
            },
          ]}
        />

        {/* SOS BUTTON */}
        <Animated.View style={[styles.sosCircle, { opacity: blink }]}>
          <TouchableOpacity onPress={() => router.push("/home/alert-types")}>
            <Text style={styles.sosText}>SOS</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* RED ALERT BUTTON — PERFECT ABOVE NEW FOOTER */}
        <TouchableOpacity
          style={styles.redAlertBtn}
          onPress={() =>
            router.push({
              pathname: "/home/alerts/alert-confirm",
              params: { type: "Crime" },
            })
          }
        >
          <MaterialCommunityIcons name="alert" size={30} color="#fff" />
          <Text style={styles.redAlertText}>RED ALERT</Text>
        </TouchableOpacity>
      </View>

      {/* FOOTER */}
      <FooterNav />
    </View>
  );
}

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fafafa" },

  topBanner: {
    backgroundColor: "#7A0000",
    paddingBottom: 35,
    paddingTop: 60,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 10,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 22,
    gap: 12,
  },

  title: { fontSize: 32, fontWeight: "900", color: "#fff" },
  subTitle: { fontSize: 14, color: "#ffdddd" },

  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 60,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: { width: 42, height: 42, borderRadius: 10 },

  flowContainer: {
    marginTop: 18,
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },

  centerArea: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  /* Waves */
  wave: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 260,
    backgroundColor: "rgba(213,0,0,0.28)",
  },

  /* SOS Button */
  sosCircle: {
    width: 210,
    height: 210,
    borderRadius: 210,
    backgroundColor: "#D50000",
    justifyContent: "center",
    alignItems: "center",
    elevation: 15,
    zIndex: 5,
  },

  sosText: {
    fontSize: 52,
    fontWeight: "900",
    color: "#fff",
  },

  /* RED ALERT BUTTON */
  redAlertBtn: {
    position: "absolute",
    bottom: 140,   // ⭐ PERFECT ABOVE LARGE FOOTER!
    backgroundColor: "#B30000",
    paddingVertical: 14,
    paddingHorizontal: 34,
    borderRadius: 45,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    elevation: 10,
  },

  redAlertText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },

  /* Lightning Shapes */
  lightWrapper: { position: "absolute", width: 50, height: 110, alignItems: "center" },
  lightTop: { width: 8, height: 25, backgroundColor: "yellow", borderRadius: 4, transform: [{ rotate: "-28deg" }] },
  lightMid: { width: 8, height: 180, backgroundColor: "yellow", borderRadius: 4, transform: [{ rotate: "32deg" }] },
  lightBottom: { width: 8, height: 180, backgroundColor: "yellow", borderRadius: 4, transform: [{ rotate: "-22deg" }] },

  light1: { top: -120, left: -80 },
  light2: { top: -120, right: -80 },
  light3: { bottom: -120, right: -80 },
  light4: { bottom: -120, left: -80 },

  statusRow: {
  marginTop: 15,
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
},

statusText: {
  color: "#ffdddd",
  fontSize: 16,
  fontWeight: "600",
  letterSpacing: 0.5,
},

});
