import { z } from 'zod';

export const emailSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email()),
});

export const codeSchema = z.object({
  code: z
    .string()
    .trim()
    .regex(/^\d{6}$/),
});

export type EmailForm = z.infer<typeof emailSchema>;
export type CodeForm = z.infer<typeof codeSchema>;
