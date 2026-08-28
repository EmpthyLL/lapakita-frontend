/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    pannellum: any;
  }
}

const PANNELLUM_CSS =
  "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";
const PANNELLUM_JS =
  "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";

let loadingPromise: Promise<void> | null = null;

export function loadPannellum(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Pannellum can only load in the browser"));
  }
  if (window.pannellum) return Promise.resolve();
  if (loadingPromise) return loadingPromise;

  loadingPromise = new Promise((resolve, reject) => {
    if (!document.querySelector(`link[href="${PANNELLUM_CSS}"]`)) {
      const css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = PANNELLUM_CSS;
      document.head.appendChild(css);
    }

    const script = document.createElement("script");
    script.src = PANNELLUM_JS;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () =>
      reject(new Error("Failed to load the panorama viewer"));
    document.body.appendChild(script);
  });

  return loadingPromise;
}
