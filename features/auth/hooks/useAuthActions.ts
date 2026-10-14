import { useMutation } from '@tanstack/react-query';

import { requestEmailCode, signInWithGoogle, signOut, verifyEmailCode } from '@/data';

export function useRequestCode() {
  return useMutation({ mutationFn: requestEmailCode });
}

export function useVerifyCode() {
  return useMutation({
    mutationFn: ({ email, code }: { email: string; code: string }) => verifyEmailCode(email, code),
  });
}

export function useGoogleSignIn() {
  return useMutation({ mutationFn: signInWithGoogle });
}

export function useSignOut() {
  return useMutation({ mutationFn: signOut });
}
