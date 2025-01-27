/// <reference types="vite/client" />
/// <reference types="vite/types/importMeta.d.ts" />

interface ImportMetaEnv {
  readonly VITE_PATH_TO_NS3: string
  readonly VITE_PATH_TO_ROOT: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
