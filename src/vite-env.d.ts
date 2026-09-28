/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MODE?: "development" | "production";
  readonly VITE_BUCKET_URL?: string;
  readonly VITE_EMAIL_SERVICE_ID: string;
  readonly VITE_EMAIL_TEMPLATE_ID: string;
  readonly VITE_EMAIL_PUBLIC_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
