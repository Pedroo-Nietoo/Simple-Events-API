/**
 * Generates a URL-friendly slug from a given title.
 *
 * This function converts the title to lowercase, trims whitespace,
 * removes non-alphanumeric characters (except spaces and hyphens),
 * replaces spaces with hyphens, and collapses multiple hyphens into a single hyphen.
 *
 * @param title - The title to be converted into a slug.
 * @returns The generated slug.
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
