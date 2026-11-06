import { z } from 'zod';

export const emailSchema = z
  .string({ required_error: 'Enter your email address.' })
  .trim()
  .max(254, 'That address is too long.')
  .email('Enter a valid email address, for example you@example.com.')
  .transform((v) => v.toLowerCase());

export const releaseListSchema = z.object({
  email: emailSchema,
  /** Honeypot: must stay empty. Real users never see this field. */
  company: z.string().max(200).optional().default(''),
  /** Where on the site the form was submitted from; informational only. */
  source: z.string().trim().max(120).optional().default('site')
});

export type ReleaseListInput = z.infer<typeof releaseListSchema>;
