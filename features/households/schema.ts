import { z } from 'zod';

export const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'AED', 'SGD', 'AUD', 'CAD'] as const;

const displayName = z.string().trim().min(1).max(60);

export const createHouseholdSchema = z.object({
  name: z.string().trim().min(1).max(80),
  displayName,
});

export const joinHouseholdSchema = z.object({
  code: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-HJ-NP-Z2-9]{8}$/),
  displayName,
});

export const accountSchema = z.object({
  name: z.string().trim().min(1).max(80),
  type: z.enum(['bank', 'credit_card', 'cash', 'wallet', 'loan']),
  last4: z
    .string()
    .trim()
    .regex(/^(\d{4})?$/),
});

export type CreateHouseholdForm = z.infer<typeof createHouseholdSchema>;
export type JoinHouseholdForm = z.infer<typeof joinHouseholdSchema>;
export type AccountForm = z.infer<typeof accountSchema>;
