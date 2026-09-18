/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WAITLIST_ENDPOINT?: string;
  readonly VITE_WAITLIST_FIELD?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
