import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

export type Locale = "en" | "id";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  const [common] = await Promise.all([
    import(`../locale/${locale}/common.json`).then((m) => m.default),
  ]);

  return {
    locale,
    messages: {
      common,
    },
  };
});
