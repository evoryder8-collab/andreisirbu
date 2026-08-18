/** Prefix an internal path with the deploy base (GitHub Pages serves from a subpath). */
export const href = (path: string): string => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
};
