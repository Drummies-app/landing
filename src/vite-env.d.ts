/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WAITLIST_ENDPOINT?: string;
  readonly VITE_WAITLIST_FIELD?: string
  readonly VITE_WAITLIST_FORMAT?: 'json' | 'form';
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
