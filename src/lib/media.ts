import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Build-time check for a file in `public/`.
 *
 * Image slots are declared in content frontmatter before the photos exist.
 * Rather than shipping broken <img> tags, pages call this and simply omit
 * the slot until the file is dropped into `public/`. Static build only —
 * the check runs once at build time and never in the browser.
 */
export function publicFileExists(src: string): boolean {
  if (!src) return false;
  const relative = src.replace(/^\/+/, '');
  return existsSync(join(process.cwd(), 'public', relative));
}

export interface ImageSlot {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  size?: 'default' | 'small';
}

/** Returns the slot only if its file is present, else undefined. */
export function resolveImage(slot?: ImageSlot): ImageSlot | undefined {
  return slot && publicFileExists(slot.src) ? slot : undefined;
}
