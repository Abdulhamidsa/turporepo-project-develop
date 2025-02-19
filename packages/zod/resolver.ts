import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Import your schemas
import { signInSchema } from './validation/auth';
import { projectSchema } from './validation/user';

// Utility function to create a Zod resolver
export const createZodResolver = <T extends z.ZodTypeAny>(schema: T) => zodResolver(schema);

// Create and export specific resolvers
export const signInResolver = createZodResolver(signInSchema);
export const projectResolver = createZodResolver(projectSchema);
