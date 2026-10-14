import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

import { DataError } from '@/data/errors';
import type { User } from '@/data/types';

import { supabase } from './client';
import { toDataError } from './errors';

type AuthUser = { id: string; email?: string | null };

function toUser(user: AuthUser | null | undefined): User | null {
  return user ? { id: user.id, email: user.email ?? '' } : null;
}

export async function requestEmailCode(email: string): Promise<void> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: true },
  });
  if (error) throw toDataError(error);
}

export async function verifyEmailCode(email: string, code: string): Promise<User> {
  const { data, error } = await supabase.auth.verifyOtp({ email, token: code, type: 'email' });
  const user = toUser(data.user);
  if (error || !user) throw toDataError(error ?? { status: 400 }, 'invalid_code');
  return user;
}

export async function signInWithGoogle(): Promise<User> {
  const redirectTo = Linking.createURL('auth-callback');
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo, skipBrowserRedirect: true },
  });
  if (error || !data.url) throw toDataError(error ?? {});

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  if (result.type !== 'success') throw new DataError('cancelled');

  const code = new URL(result.url).searchParams.get('code');
  if (!code) throw new DataError('unknown');
  const exchanged = await supabase.auth.exchangeCodeForSession(code);
  const user = toUser(exchanged.data.user);
  if (exchanged.error || !user) throw toDataError(exchanged.error ?? {});
  return user;
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw toDataError(error);
}

export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getSession();
  return toUser(data.session?.user);
}

/** Returns an unsubscribe function. */
export function onAuthChange(callback: (user: User | null) => void): () => void {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(toUser(session?.user));
  });
  return () => data.subscription.unsubscribe();
}
