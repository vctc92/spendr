import '../global.css';

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  useFonts,
} from '@expo-google-fonts/inter';
import { QueryClientProvider } from '@tanstack/react-query';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, type Theme } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';
import { useEffect } from 'react';

import { useSession } from '@/features/auth/hooks/useSession';
import { useAccountCount, useHousehold } from '@/features/households/hooks/useHousehold';
import { queryClient } from '@/lib/query-client';
import { tokens, type ColorScheme } from '@/theme/tokens';

// Keep the splash screen up until fonts are ready, so text never flashes in the system font.
SplashScreen.preventAutoHideAsync();

function navigationTheme(scheme: ColorScheme): Theme {
  const c = tokens.color[scheme];
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      background: c.background,
      card: c.card,
      text: c.foreground,
      border: c.border,
      primary: c.primary,
      notification: c.destructive,
    },
  };
}

/** Decides which screens exist for the current auth state; Expo Router redirects when it changes. */
function AppStack({ scheme }: { scheme: ColorScheme }) {
  const { user, isLoading: sessionLoading } = useSession();
  const household = useHousehold();
  const accountCount = useAccountCount(household.data?.id);

  const loading =
    sessionLoading ||
    (!!user && household.isPending) ||
    (!!household.data && accountCount.isPending);
  if (loading) return null;

  const signedIn = !!user;
  const hasHousehold = !!household.data;
  // Only the owner who created the household needs quick setup; joiners skip it.
  const needsSetup = household.data?.role === 'owner' && accountCount.data === 0;

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: tokens.color[scheme].background },
      }}>
      <Stack.Protected guard={!signedIn}>
        <Stack.Screen name="(onboarding)/sign-in" />
      </Stack.Protected>
      <Stack.Protected guard={signedIn && !hasHousehold}>
        <Stack.Screen name="(onboarding)/household" />
      </Stack.Protected>
      <Stack.Protected guard={signedIn && hasHousehold && needsSetup}>
        <Stack.Screen name="(onboarding)/setup" />
      </Stack.Protected>
      <Stack.Protected guard={signedIn && hasHousehold && !needsSetup}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });
  const { colorScheme } = useColorScheme();
  const scheme: ColorScheme = colorScheme === 'dark' ? 'dark' : 'light';

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // If fonts fail to load, continue with the system-ui fallback instead of a blank screen.
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider value={navigationTheme(scheme)}>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <QueryClientProvider client={queryClient}>
        <AppStack scheme={scheme} />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
