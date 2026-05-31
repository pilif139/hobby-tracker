import z from 'zod';

const CreateHobbySessionFormSchema = z
  .object({
    hobbyId: z.string().min(1, 'Please select a hobby'),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
    notes: z.string().max(1000, 'Notes must be at most 1000 characters long'),
    images: z.array(z.instanceof(File)).max(4, 'You can upload up to 4 images'),
  })
  .refine(
    (value) => {
      const start = new Date(value.startTime).getTime();
      const end = new Date(value.endTime).getTime();

      if (Number.isNaN(start) || Number.isNaN(end)) {
        return true;
      }

      return end > start;
    },
    {
      message: 'End time must be after start time',
      path: ['endTime'],
    },
  );

export default CreateHobbySessionFormSchema;
