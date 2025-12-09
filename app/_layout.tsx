import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";
import { getToken } from "../src/utils/storage";

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();

      if (!token) {
        router.replace("/auth/login");   // <-- LOGIN FIRST
      } else {
        router.replace("/home/dashboard"); // <-- THIS MAKES DASHBOARD OPEN FIRST
      }
    };

    checkAuth();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
