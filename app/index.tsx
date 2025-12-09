import { router } from "expo-router";
import { useEffect } from "react";
import { getToken } from "../src/utils/storage";

export default function Index() {
  useEffect(() => {
    const load = async () => {
      const token = await getToken();
      if (token) router.replace("/home/dashboard");
      else router.replace("/auth/login");
    };

    load();
  }, []);

  return null; // loading screen invisible
}
