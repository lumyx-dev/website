// Variables publiques, remplacees a la compilation.
// `SITE_URL` designe lumyx.dev, `DOCS_URL` le domaine de cette doc.
export const SITE_URL: string = import.meta.env.PUBLIC_SITE_URL ?? 'https://lumyx.dev';
export const DOCS_URL: string = import.meta.env.PUBLIC_DOCS_URL ?? 'https://docs.lumyx.dev';
