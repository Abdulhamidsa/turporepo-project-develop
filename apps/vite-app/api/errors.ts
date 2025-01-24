export class AppError extends Error {
  constructor(
    public message: string,
    /** Optional HTTP status code (e.g., 400, 401, 500) */
    public statusCode?: number
  ) {
    super(message);
    this.name = "AppError";

    // Fix for extending a built-in class like Error in TS
    Object.setPrototypeOf(this, new.target.prototype);
  }
}
// export class AppError extends Error {
//   constructor(
//     public message: string,
//     public code?: string | number
//   ) {
//     super(message);
//     this.name = "AppError";
//   }
// }

// src/utils/AppError.ts

// src/utils/getErrorMessage.ts

// export const getErrorMessage = (error: unknown): string => {
//   // If it’s one of our custom AppErrors:
//   if (error instanceof AppError) {
//     return error.message;
//   }

//   // If it’s an Axios error (network, backend, etc.):
//   if (axios.isAxiosError(error)) {
//     const backendMessage = error.response?.data?.message;
//     const status = error.response?.status;
//     if (backendMessage) {
//       return `[${status}] ${backendMessage}`;
//     }
//     return `HTTP Error: ${status || "Unknown status"}`;
//   }

//   // If it’s a normal JavaScript error (TypeError, ReferenceError, etc.):
//   if (error instanceof Error) {
//     return error.message;
//   }

//   // Fallback if we have no clue what it is:
//   return "An unknown error occurred.";
// };

// export const getErrorMessage = (error: unknown): string => {
//   if (error instanceof AppError) {
//     return error.message;
//   }

//   if (axios.isAxiosError(error)) {
//     const status = error.response?.status;
//     const backendMessage = error.response?.data?.message;
//     if (backendMessage) {
//       return `[${status}] ${backendMessage}`;
//     }
//     return `HTTP Error: ${error.response?.statusText || "Unknown error"}`;
//   }

//   if (error instanceof Error) {
//     return error.message;
//   }

//   return "An unknown error occurred.";
// };
