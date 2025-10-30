import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { AuthProvider } from "@/contexts/AuthContext";
import { OrderProvider } from "@/contexts/OrderContext";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* Provider per i gesture handler necessari a livello root dell'app Expo/React Native */}
      {/* Provider per autenticazione utente */}
      <AuthProvider>
        {/* Provider ordini, tiene gli stati relativi agli ordini globali */}
        <OrderProvider>
          {/* ThemeProvider gestisce colore e tema (chiaro/scuro) a livello di tutto il Navigator */}
          <ThemeProvider
            value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
          >
            <Stack>
              {/* Schermate principali dell'app (menu, login, tabs, dettagli, ecc) */}
              <Stack.Screen
                name="index"
                options={{
                  headerShown: false,
                  animation: "none",
                }}
              />
              <Stack.Screen
                name="login"
                options={{
                  headerShown: false,
                  animation: "slide_from_bottom",
                }}
              />

              {/* Tab navigator */}
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                  animation: "fade",
                  animationTypeForReplace: "push",
                }}
              />

              {/* Dettagli pizza */}
              <Stack.Screen
                name="pizza-details"
                options={{ headerShown: false }}
              />

              {/* Ordini */}
              <Stack.Screen name="ordini" options={{ headerShown: false }} />

              {/* Checkout come modal */}
              <Stack.Screen
                name="checkout"
                options={{
                  presentation: "modal",
                  headerShown: false,
                  gestureEnabled: true,
                  animationTypeForReplace: "push",
                }}
              />
            </Stack>
            <StatusBar style="auto" />
          </ThemeProvider>
        </OrderProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
