import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";

export default function FooterNav() {
  const path = usePathname();

  const navItems: { icon: keyof typeof Feather.glyphMap; route: string }[] = [
    { icon: "home", route: "/home/dashboard" },
    { icon: "bell", route: "/home/alerts/history" },
    { icon: "user", route: "/home/profile" },
  ];

  return (
    <View style={styles.footer}>
      {navItems.map((item, index) => {
        const active = path === item.route;

        return (
          <TouchableOpacity
            key={index}
            style={styles.btn}
            onPress={() => router.push(item.route as any)}
          >
            <Feather
              name={item.icon}
              size={28}
              color={active ? "#B30000" : "#6e6b6b"}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
    paddingBottom: 28,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 20,
  },

  btn: {
    padding: 10,
  },
});
