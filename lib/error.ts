import type { AxiosError } from "axios";
import { showToast } from "./toast";

type ApiError =
  | AxiosError<{
      message?: string;
      error?: string;
      data?: Record<string, string>;
    }>
  | Error
  | unknown;

export const handleError = (error: ApiError, locale: string = "en") => {
  const isAxiosError = (
    err: ApiError,
  ): err is AxiosError<{
    data?: Record<string, string>;
    message?: string;
    error?: string;
  }> => typeof err === "object" && err !== null && "isAxiosError" in err;

  if (isAxiosError(error)) {
    const errorData = error.response?.data;

    // Validation errors per field
    if (errorData?.data && typeof errorData.data === "object") {
      Object.values(errorData.data).forEach((msg) => {
        if (typeof msg === "string") showToast.error(msg);
      });
      return;
    }

    const message = errorData?.message || errorData?.error;
    if (message) {
      showToast.error(message);
      return;
    }

    showToast.error(
      locale === "id"
        ? "Ada yang salah, silakan coba lagi."
        : "Something went wrong, please try again.",
    );
    return;
  }

  if (error instanceof Error) {
    showToast.error(
      error.message ||
        (locale === "id"
          ? "Terjadi kesalahan yang tidak terduga."
          : "An unexpected error occurred."),
    );
    return;
  }

  showToast.error(
    locale === "id"
      ? "Terjadi kesalahan yang tidak diketahui."
      : "Unknown error occurred.",
  );
};
