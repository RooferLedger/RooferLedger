import { z } from 'zod'

export const ClientSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName: z.string().min(1, 'Last name is required').max(50),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(5, 'Address is required'),
})

export const LineItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(0.01, 'Quantity must be at least 0.01'),
  unitPrice: z.number().min(0, 'Unit price cannot be negative'),
})

export const InvoiceSchema = z.object({
  clientId: z.string().uuid('Please select a valid client'),
  status: z.enum(['draft', 'sent', 'paid', 'overdue']).default('draft'),
  customDate: z.string().optional(),
  notes: z.string().optional(),
  lineItems: z.array(LineItemSchema).min(1, 'An invoice must have at least one line item'),
  taxRate: z.number().min(0).max(100).default(0),
})
