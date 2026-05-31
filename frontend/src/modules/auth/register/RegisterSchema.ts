import z from 'zod';

const RegisterSchema = z.object({
  email: z.email('Invalid email address'),
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters long')
    .max(128, 'Name must be at most 128 characters long'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .max(128, 'Password must be at most 128 characters long'),
});

export default RegisterSchema;
