/// <reference types="vite/client" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ACCESS_KEY: string;
  readonly VITE_SECRET_KEY_KEY: string;
  // add more vars here if needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
