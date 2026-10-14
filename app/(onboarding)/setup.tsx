import { zodResolver } from '@hookform/resolvers/zod';
import { Wallet } from 'lucide-react-native';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Icon } from '@/components/ui/Icon';
import { Select } from '@/components/ui/Select';
import { Text } from '@/components/ui/Text';
import { TextField } from '@/components/ui/TextField';
import {
  useCategories,
  useCreateInvite,
  useFinishSetup,
  useHousehold,
} from '@/features/households/hooks/useHousehold';
import { accountSchema, CURRENCIES, type AccountForm } from '@/features/households/schema';
import { InviteCodeCard } from '@/features/onboarding/components/InviteCodeCard';
import { OnboardingScreen } from '@/features/onboarding/components/OnboardingScreen';
import { errorMessage } from '@/features/onboarding/errorMessage';
import { shareInvite } from '@/features/onboarding/useShareInvite';
import { t, type TranslationKey } from '@/lib/i18n';

const ACCOUNT_TYPES = ['bank', 'credit_card', 'cash', 'wallet', 'loan'] as const;
const accountTypeOptions = ACCOUNT_TYPES.map((value) => ({
  value,
  label: t(`account.type.${value}` satisfies TranslationKey),
}));
const currencyOptions = CURRENCIES.map((value) => ({ value, label: value }));

export default function SetupScreen() {
  const household = useHousehold().data;
  const categories = useCategories(household?.id).data;
  const finish = useFinishSetup();
  const invite = useCreateInvite();
  const [currency, setCurrency] = React.useState<(typeof CURRENCIES)[number]>('INR');
  const [dropped, setDropped] = React.useState<ReadonlySet<string>>(new Set());
  const { control, handleSubmit, formState } = useForm<AccountForm>({
    resolver: zodResolver(accountSchema),
    defaultValues: { name: '', type: 'bank', last4: '' },
  });

  if (!household) return null;
  const expenseCategories = (categories ?? []).filter((c) => c.kind === 'expense');

  function toggle(id: string, keep: boolean) {
    setDropped((prev) => {
      const next = new Set(prev);
      if (keep) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <OnboardingScreen step={3}>
      <View className="items-center gap-3 pt-4">
        <Icon icon={Wallet} size={32} className="text-primary" />
        <Text variant="title" className="text-center" accessibilityRole="header">
          {t('onboarding.setup.title')}
        </Text>
        <Text tone="muted" className="text-center">
          {t('onboarding.setup.subtitle')}
        </Text>
      </View>

      <Select
        label={t('onboarding.setup.currency')}
        options={currencyOptions}
        value={currency}
        onChange={setCurrency}
      />

      <View className="gap-4">
        <Text variant="heading">{t('onboarding.setup.accountSection')}</Text>
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <TextField
              label={t('onboarding.setup.accountName')}
              placeholder={t('onboarding.setup.accountNamePlaceholder')}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={formState.errors.name ? t('onboarding.household.fieldRequired') : undefined}
            />
          )}
        />
        <Controller
          control={control}
          name="type"
          render={({ field }) => (
            <Select
              label={t('onboarding.setup.accountType')}
              options={accountTypeOptions}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <Controller
          control={control}
          name="last4"
          render={({ field }) => (
            <TextField
              label={t('onboarding.setup.last4')}
              keyboardType="number-pad"
              maxLength={4}
              value={field.value}
              onChangeText={field.onChange}
              onBlur={field.onBlur}
              error={formState.errors.last4 ? t('onboarding.setup.last4Invalid') : undefined}
            />
          )}
        />
      </View>

      <View>
        <Text variant="heading">{t('onboarding.setup.categories')}</Text>
        {expenseCategories.map((c) => (
          <Checkbox
            key={c.id}
            label={c.name}
            checked={!dropped.has(c.id)}
            onChange={(keep) => toggle(c.id, keep)}
          />
        ))}
      </View>

      {household.role === 'owner' ? (
        <View className="gap-3">
          <Text variant="heading">{t('onboarding.setup.inviteTitle')}</Text>
          {invite.data ? (
            <InviteCodeCard code={invite.data} onShare={() => shareInvite(invite.data)} />
          ) : (
            <Button
              variant="secondary"
              label={t('onboarding.setup.inviteCreate')}
              loading={invite.isPending}
              onPress={() => invite.mutate({ householdId: household.id })}
            />
          )}
        </View>
      ) : null}

      {finish.error || invite.error ? (
        <Text variant="label" tone="debit">
          {errorMessage(finish.error ?? invite.error)}
        </Text>
      ) : null}
      <Button
        label={t('onboarding.setup.finish')}
        loading={finish.isPending}
        onPress={handleSubmit((values) =>
          finish.mutate({
            householdId: household.id,
            currency,
            removeCategoryIds: [...dropped],
            account: { householdId: household.id, ...values },
          })
        )}
      />
    </OnboardingScreen>
  );
}
