import { z } from "zod";

export const SchemaAuthRegisterReq = z.object({
  name: z.string().min(3).max(100),
  email: z.string().email(),
  password: z.string().min(8),
});
export type TypeAuthRegisterReq = z.infer<typeof SchemaAuthRegisterReq>;
export type TypeAuthRegisterRes = {
  id: number;
  name: string;
  email: string;
};

export const SchemaAuthLoginReq = z.object({
  email: z.string().email(),
  password: z.string(),
});
export type TypeAuthLoginReq = z.infer<typeof SchemaAuthLoginReq>;
export type TypeAuthLoginRes = {
  jwt: string;
};

const SchemaReminder = z.object({
  id: z.string(),
  name: z.string().min(3).max(100),
  content: z.string(),
  due_at: z.number().nullable().optional(),
  completed_at: z.number().nullable().optional(),
});
type TypeReminder = z.infer<typeof SchemaReminder>;

export type TypeReminderGet = TypeReminder[];

export const SchemaReminderPostReq = SchemaReminder.omit({ id: true });
export type TypeReminderPostRes = TypeReminder;

export type TypeReminderIdGet = TypeReminder;

export const SchemaReminderPatchReq = SchemaReminder.partial();
export type TypeReminderPatchReq = z.infer<typeof SchemaReminderPatchReq>;
export type TypeReminderPatchRes = TypeReminder;
