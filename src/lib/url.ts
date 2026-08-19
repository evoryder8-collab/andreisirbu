/** Prefix an internal path with the deploy base (GitHub Pages serves from a subpath). */
export const href = (path: string): string => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  let p = path.startsWith("/") ? path : `/${path}`;
  // Astro builds directory-style pages, so a slashless link costs a 301 on
  // every internal navigation. Land on the canonical URL directly.
  if (!p.endsWith("/") && !p.includes("#") && !p.includes("?") && !/\.[a-z0-9]+$/i.test(p)) {
    p = `${p}/`;
  }
  return `${base}${p}`;
};
