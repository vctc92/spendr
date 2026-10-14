import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';

import { env } from '@/lib/env';
import type { Database } from '@/types/database';

import { secureStorage } from './secureStorage';

export const supabase = createClient<Database>(
  env.EXPO_PUBLIC_SUPABASE_URL,
  env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      storage: secureStorage,
      autoRefreshToken: true,
      persistSession: true,
      // Native app: there is no URL to read a session from. Google sign-in exchanges its code by hand.
      detectSessionInUrl: false,
      flowType: 'pkce',
    },
  }
);
