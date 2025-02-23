import { z } from 'zod';

export const QuestionTypeSchema = z.enum([
  'text',
  'number',
  'select',
  'email',
  'phone',
]);

export const QuestionSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Question title is required'),
  type: QuestionTypeSchema,
  required: z.boolean().default(false),
  hidden: z.boolean().default(false),
  options: z.array(z.string()).optional(),
  value: z.string().optional(),
  helperText: z.string().optional(),
  minValue: z.number().optional(),
  maxValue: z.number().optional(),
});

export const FormSchema = z.object({
  id: z.string(),
  title: z.string(),
  questions: z.array(QuestionSchema),
});

export type QuestionType = z.infer<typeof QuestionTypeSchema>;
export type Question = z.infer<typeof QuestionSchema>;
export type Form = z.infer<typeof FormSchema>;
