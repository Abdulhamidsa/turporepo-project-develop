// import { z } from "zod";
// import { request } from "../api/request";

// export const swrFetcher = async <T>(url: string, schema: z.ZodType<T>, defaultValue: T): Promise<T> => {
//   try {
//     const response = await request<T>("GET", url);
//     const validationResult = schema.safeParse(response);

//     if (!validationResult.success) {
//       console.error("Validation failed:", validationResult.error);
//       return defaultValue;
//     }

//     return validationResult.data;
//   } catch (error) {
//     console.error("Fetcher error:", error);
//     return defaultValue;
//   }
// };
