import { ZodSchema, z } from 'zod';

import { getErrorMessage } from '../utils/getErrorMessage';
import { request } from './request';

export async function swrFetcher<T>(
  url: string,
  schema?: ZodSchema<T>,
  defaultValue?: T,
): Promise<T> {
  try {
    const response = await request<unknown>('GET', url);
    console.log('Received data:', response); // Debugging API response

    // Automatically wrap the schema in z.array if the response is an array
    let validatedSchema = schema;
    if (Array.isArray(response) && schema && !(schema instanceof z.ZodArray)) {
      validatedSchema = z.array(schema) as unknown as ZodSchema<T>;
    }

    if (validatedSchema) {
      const parsed = validatedSchema.safeParse(response);
      if (!parsed.success) {
        console.error('Validation Error:', parsed.error);
        return defaultValue as T;
      }
      return parsed.data;
    }

    return response as T;
  } catch (error) {
    console.error('SWR Fetch Error:', getErrorMessage(error));
    return defaultValue as T;
  }
}
