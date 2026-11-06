import "react-native-url-polyfill/auto";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";

const url = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const key = process.env.EXPO_PUBLIC_SUPABASE_KEY as string;

export const supabase = createClient(url, key, {
  auth: {
    storage: AsyncStorage, // login session phone par save rehti hai
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// App foreground mein ho to token refresh chalta rahe
AppState.addEventListener("change", (state) => {
  if (state === "active") supabase.auth.startAutoRefresh();
  else supabase.auth.stopAutoRefresh();
});