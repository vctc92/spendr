import { zodResolver } from '@hookform/resolvers/zod';
import { Home, Users } from 'lucide-react-native';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { ListRow } from '@/components/ui/ListRow';
import { Text } from '@/components/ui/Text';
import { TextField } from '@/components/ui/TextField';
import { useSignOut } from '@/features/auth/hooks/useAuthActions';
import { useCreateHousehold, useJoinHousehold } from '@/features/households/hooks/useHousehold';
import {
  createHouseholdSchema,
  joinHouseholdSchema,
  type CreateHouseholdForm,
  type JoinHouseholdForm,
} from '@/features/households/schema';
import { OnboardingScreen } from '@/features/onboarding/components/OnboardingScreen';
import { deviceSettings } from '@/features/onboarding/deviceSettings';
import { errorMessage } from '@/features/onboarding/errorMessage';
import { t } from '@/lib/i18n';

type Mode = 'choose' | 'create' | 'join';

export default function HouseholdScreen() {
  const [mode, setMode] = React.useState<Mode>('choose');
  const signOut = useSignOut();

  return (
    <OnboardingScreen step={2}>
      <View className="items-center gap-3 pt-4">
        <Icon icon={Home} size={32} className="text-primary" />
        <Text variant="title" className="text-center" accessibilityRole="header">
          {t('onboarding.household.title')}
        </Text>
        <Text tone="muted" className="text-center">
          {t('onboarding.household.subtitle')}
        </Text>
      </View>

      {mode === 'choose' ? (
        <Card padding="sm">
          <ListRow
            leading={<Icon icon={Home} className="text-primary" />}
            title={t('onboarding.household.create')}
            subtitle={t('onboarding.household.createHint')}
            showChevron
            divider
            onPress={() => setMode('create')}
          />
          <ListRow
            leading={<Icon icon={Users} className="text-primary" />}
            title={t('onboarding.household.join')}
            subtitle={t('onboarding.household.joinHint')}
            showChevron
            onPress={() => setMode('join')}
          />
        </Card>
      ) : mode === 'create' ? (
        <CreateForm onBack={() => setMode('choose')} />
      ) : (
        <JoinForm onBack={() => setMode('choose')} />
      )}

      <Button
        variant="ghost"
        label={t('auth.signOut')}
        loading={signOut.isPending}
        onPress={() => signOut.mutate()}
      />
    </OnboardingScreen>
  );
}

function CreateForm({ onBack }: { onBack: () => void }) {
  const create = useCreateHousehold();
  const { control, handleSubmit, formState } = useForm<CreateHouseholdForm>({
    resolver: zodResolver(createHouseholdSchema),
    defaultValues: { name: '', displayName: '' },
  });
  const required = t('onboarding.household.fieldRequired');

  return (
    <View className="gap-4">
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <TextField
            label={t('onboarding.household.nameLabel')}
            placeholder={t('onboarding.household.namePlaceholder')}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={formState.errors.name ? required : undefined}
          />
        )}
      />
      <Controller
        control={control}
        name="displayName"
        render={({ field }) => (
          <TextField
            label={t('onboarding.household.displayNameLabel')}
            placeholder={t('onboarding.household.displayNamePlaceholder')}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={formState.errors.displayName ? required : undefined}
          />
        )}
      />
      {create.error ? (
        <Text variant="label" tone="debit">
          {errorMessage(create.error)}
        </Text>
      ) : null}
      <Button
        label={t('onboarding.household.createAction')}
        loading={create.isPending}
        onPress={handleSubmit((values) =>
          // Currency is confirmed in quick setup (step 3); INR is the starting value.
          create.mutate({ ...values, baseCurrency: 'INR', ...deviceSettings() })
        )}
      />
      <Button variant="ghost" label={t('onboarding.household.back')} onPress={onBack} />
    </View>
  );
}

function JoinForm({ onBack }: { onBack: () => void }) {
  const join = useJoinHousehold();
  const { control, handleSubmit, formState } = useForm<JoinHouseholdForm>({
    resolver: zodResolver(joinHouseholdSchema),
    defaultValues: { code: '', displayName: '' },
  });

  return (
    <View className="gap-4">
      <Controller
        control={control}
        name="code"
        render={({ field }) => (
          <TextField
            label={t('onboarding.household.codeLabel')}
            placeholder={t('onboarding.household.codePlaceholder')}
            autoCapitalize="characters"
            autoCorrect={false}
            maxLength={8}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={formState.errors.code ? t('onboarding.household.codeInvalid') : undefined}
          />
        )}
      />
      <Controller
        control={control}
        name="displayName"
        render={({ field }) => (
          <TextField
            label={t('onboarding.household.displayNameLabel')}
            placeholder={t('onboarding.household.displayNamePlaceholder')}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            error={
              formState.errors.displayName ? t('onboarding.household.fieldRequired') : undefined
            }
          />
        )}
      />
      {join.error ? (
        <Text variant="label" tone="debit">
          {errorMessage(join.error)}
        </Text>
      ) : null}
      <Button
        label={t('onboarding.household.joinAction')}
        loading={join.isPending}
        onPress={handleSubmit((values) => join.mutate({ ...values, ...deviceSettings() }))}
      />
      <Button variant="ghost" label={t('onboarding.household.back')} onPress={onBack} />
    </View>
  );
}
