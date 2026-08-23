import type { AxiosError } from "axios";
import { showToast } from "./toast";

import commonEn from "@/locale/en/common.json";
import commonId from "@/locale/id/common.json";

type ApiError =
  | AxiosError<{
      message?: string;
      error?: string;
      data?: Record<string, string>;
    }>
  | Error
  | unknown;

const messagesMap = {
  en: commonEn.error,
  id: commonId.error,
};

const getCurrentLocale = (): "id" | "en" => {
  if (typeof window === "undefined") return "en";

  const cookieLocale = document.cookie
    .split("; ")
    .find((row) => row.startsWith("NEXT_LOCALE="))
    ?.split("=")[1];

  return cookieLocale === "id" ? "id" : "en";
};

export const handleError = (error: ApiError) => {
  const activeLocale = getCurrentLocale();
  const msg = messagesMap[activeLocale];

  const isAxiosError = (
    err: ApiError,
  ): err is AxiosError<{
    data?: Record<string, string>;
    message?: string;
    error?: string;
  }> => typeof err === "object" && err !== null && "isAxiosError" in err;

  // 1. Respon dari Axios API Backend
  if (isAxiosError(error)) {
    const errorData = error.response?.data;

    // Validation errors per field
    if (errorData?.data && typeof errorData.data === "object") {
      Object.values(errorData.data).forEach((errMessage) => {
        if (typeof errMessage === "string") showToast.error(errMessage);
      });
      return;
    }

    const customMessage = errorData?.message || errorData?.error;
    if (customMessage) {
      showToast.error(customMessage);
      return;
    }

    showToast.error(msg.default);
    return;
  }

  // 2. Standard JS Error
  if (error instanceof Error) {
    showToast.error(error.message || msg.unexpected);
    return;
  }

  // 3. Unknown Error
  showToast.error(msg.unknown);
};
