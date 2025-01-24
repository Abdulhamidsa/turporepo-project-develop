import axios from "axios";
import { AppError } from "../api/errors";

export const getErrorMessage = (error: unknown): string => {
  // If it’s one of our custom AppErrors:
  if (error instanceof AppError) {
    return error.message;
  }

  // If it’s an Axios error (network, backend, etc.):
  if (axios.isAxiosError(error)) {
    const backendMessage = error.response?.data?.message;
    const status = error.response?.status;
    if (backendMessage) {
      return `[${status}] ${backendMessage}`;
    }
    return `HTTP Error: ${status || "Unknown status"}`;
  }

  // If it’s a normal JavaScript error (TypeError, ReferenceError, etc.):
  if (error instanceof Error) {
    return error.message;
  }

  // Fallback if we have no clue what it is:
  return "An unknown error occurred.";
};
