import { z } from "zod";

export const createPasswordSchema = (config) => {
  return z.object({
    minLength: z
      .number()
      .min(config.min || 1, {
        message: `Minimum length must be at least ${config.min || 1}.`,
      })
      .max(config.max || 128, {
        message: `Minimum length must not exceed ${config.max || 128}.`,
      }),
    maxLength: z
      .number()
      .min(config.min || 1, {
        message: `Maximum length must be at least ${config.min || 1}.`,
      })
      .refine((val, ctx) => val >= ctx?.parent?.minLength, {
        message:
          "Maximum length must be greater than or equal to minimum length.",
      }),
    pattern: config.pattern
      ? z.string().regex(config.pattern, {
          message: config.patternMessage || "Invalid pattern.",
        })
      : z.string().optional(),
  });
};
