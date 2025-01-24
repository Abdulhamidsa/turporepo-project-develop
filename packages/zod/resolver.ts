import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Utility function to create a Zod resolver
export const createZodResolver = <T extends z.ZodTypeAny>(schema: T) => zodResolver(schema);

// Import your schemas
import { signInSchema } from "./validation/auth";
import { projectSchema } from "./validation/user";

// Create and export specific resolvers
export const signInResolver = createZodResolver(signInSchema);
export const projectResolver = createZodResolver(projectSchema);
