import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب ألا تقل عن 6 أحرف'),
})

export const registrationSchema = z.object({
  fullName: z.string().min(2, 'الاسم مطلوب'),
  phone: z.string().min(8, 'رقم الهاتف غير صالح'),
  email: z.string().email('البريد الإلكتروني غير صالح').optional().or(z.literal('')),
  programRef: z.string().optional().nullable(),
  preferredContactMethod: z.enum(['whatsapp', 'form']).optional(),
  message: z.string().optional().or(z.literal('')),
})

export const contactMessageSchema = z.object({
  fullName: z.string().min(2, 'الاسم مطلوب'),
  phone: z.string().min(8, 'رقم الهاتف غير صالح'),
  email: z.string().email('البريد الإلكتروني غير صالح').optional().or(z.literal('')),
  subject: z.string().min(2, 'الموضوع مطلوب'),
  message: z.string().min(2, 'الرسالة مطلوبة'),
})
