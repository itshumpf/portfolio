// Structural navigation — site information architecture, not editorial
// content, so it stays out of the content collections.
//
// Hash entries are homepage section anchors. Nav.astro rewrites them to
// `/#section` when rendered on any route other than `/`, so the same list
// works from both lanes of the site.
export const navLinks = [
  { href: '#investigations', label: 'Investigations' },
  { href: '#about', label: 'Background' },
  { href: '#leadership', label: 'Leadership' },
  { href: '#work', label: 'Work' },
] as const;
