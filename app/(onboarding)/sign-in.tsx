import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ShieldCheck } from 'lucide-react-native';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { TextField } from '@/components/ui/TextField';
import {
  useGoogleSignIn,
  useRequestCode,
  useVerifyCode,
} from '@/features/auth/hooks/useAuthActions';
import { codeSchema, emailSchema, type CodeForm, type EmailForm } from '@/features/auth/schema';
import { OnboardingScreen } from '@/features/onboarding/components/OnboardingScreen';
import { errorMessage } from '@/features/onboarding/errorMessage';
import { t } from '@/lib/i18n';

const RESEND_SECONDS = 60;

export default function SignInScreen() {
  const [email, setEmail] = React.useState<string | null>(null);
  return (
    <OnboardingScreen step={1}>
      {email ? (
        <CodeStep email={email} onChangeEmail={() => setEmail(null)} />
      ) : (
        <EmailStep onSent={setEmail} />
      )}
    </OnboardingScreen>
  );
}

function EmailStep({ onSent }: { onSent: (email: string) => void }) {
  const requestCode = useRequestCode();
  const google = useGoogleSignIn();
  const { control, handleSubmit, formState } = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });
  const failure = requestCode.error ?? google.error;
  const failureText = failure ? errorMessage(failure) : null;

  return (
    <>
      <View className="items-center gap-3 pt-4">
        <Icon icon={ShieldCheck} size={32} className="text-primary" />
        <Text variant="title" className="text-center" accessibilityRole="header">
          {t('onboarding.signIn.title')}
        </Text>
        <Text tone="muted" className="text-center">
          {t('onboarding.signIn.subtitle')}
        </Text>
      </View>

      <Button
        variant="secondary"
        label={t('onboarding.signIn.google')}
        loading={google.isPending}
        onPress={() => google.mutate()}
      />

      <Text variant="caption" tone="muted" className="text-center">
        {t('onboarding.signIn.or')}
      </Text>

      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <TextField
            label={t('onboarding.signIn.emailLabel')}
            placeholder={t('onboarding.signIn.emailPlaceholder')}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect={false}
            textContentType="emailAddress"
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={formState.errors.email ? t('onboarding.signIn.emailInvalid') : undefined}
          />
        )}
      />
      {failureText && failureText !== t('auth.error.cancelled') ? (
        <Text variant="label" tone="debit">
          {failureText}
        </Text>
      ) : null}
      <Button
        leftIcon={Mail}
        label={t('onboarding.signIn.sendCode')}
        loading={requestCode.isPending}
        onPress={handleSubmit((values) =>
          requestCode.mutate(values.email, { onSuccess: () => onSent(values.email) })
        )}
      />
    </>
  );
}

function CodeStep({ email, onChangeEmail }: { email: string; onChangeEmail: () => void }) {
  const verify = useVerifyCode();
  const resend = useRequestCode();
  const [seconds, setSeconds] = React.useState(RESEND_SECONDS);
  const { control, handleSubmit, formState } = useForm<CodeForm>({
    resolver: zodResolver(codeSchema),
    defaultValues: { code: '' },
  });

  // UI countdown only; the server enforces the real rate limit.
  React.useEffect(() => {
    if (seconds <= 0) return;
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds]);

  const failure = verify.error ?? resend.error;

  return (
    <>
      <View className="items-center gap-3 pt-4">
        <Icon icon={Mail} size={32} className="text-primary" />
        <Text variant="title" className="text-center" accessibilityRole="header">
          {t('onboarding.code.title')}
        </Text>
        <Text tone="muted" className="text-center">
          {t('onboarding.code.subtitle', { email })}
        </Text>
      </View>
      <Controller
        control={control}
        name="code"
        render={({ field }) => (
          <TextField
            label={t('onboarding.code.label')}
            keyboardType="number-pad"
            autoComplete="one-time-code"
            textContentType="oneTimeCode"
            maxLength={6}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={formState.errors.code ? t('onboarding.code.invalid') : undefined}
          />
        )}
      />
      {failure ? (
        <Text variant="label" tone="debit">
          {errorMessage(failure)}
        </Text>
      ) : null}
      <Button
        label={t('onboarding.code.verify')}
        loading={verify.isPending}
        onPress={handleSubmit((values) => verify.mutate({ email, code: values.code }))}
      />
      <Button
        variant="ghost"
        disabled={seconds > 0 || resend.isPending}
        label={
          seconds > 0 ? t('onboarding.code.resendIn', { seconds }) : t('onboarding.code.resend')
        }
        onPress={() => resend.mutate(email, { onSuccess: () => setSeconds(RESEND_SECONDS) })}
      />
      <Button variant="ghost" label={t('onboarding.code.change')} onPress={onChangeEmail} />
    </>
  );
}
