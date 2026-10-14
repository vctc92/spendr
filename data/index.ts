// The only surface the app uses to reach the backend (AGENTS §7.1).
export {
  getCurrentUser,
  onAuthChange,
  requestEmailCode,
  signInWithGoogle,
  signOut,
  verifyEmailCode,
} from './supabase/auth';
export {
  addAccount,
  countAccounts,
  createHousehold,
  createInvite,
  getCategories,
  getMyHousehold,
  joinHousehold,
  removeCategories,
  setBaseCurrency,
} from './supabase/households';
export { DataError } from './errors';
export type * from './types';
