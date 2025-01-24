import axios from "axios";
import { ZodSchema } from "zod";
import axiosInstance from "./axiosClient";
import { AppError } from "./errors";
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export async function request<T>(method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH", url: string, data?: unknown, schema?: ZodSchema<T>): Promise<T> {
  try {
    const response = await axiosInstance.request<ApiResponse<T>>({
      method,
      url,
      data,
    });

    const { success, data: responseData, message } = response.data;
    if (!success) {
      throw new AppError(message || "Unknown error occurred", response.status);
    }
    if (schema) {
      const parseResult = schema.safeParse(responseData);
      if (!parseResult.success) {
        console.error("Zod validation error:", parseResult.error);
        throw new AppError("API response validation failed", response.status);
      }
      return parseResult.data;
    }

    return responseData;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const backendMessage = error.response?.data?.message || "Something went wrong";
      const status = error.response?.status;
      throw new AppError(backendMessage, status);
    }
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(error.message || "An unknown error occurred");
  }
}
