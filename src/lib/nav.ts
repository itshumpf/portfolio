// Structural navigation — site information architecture, not editorial
// content, so it stays out of the content collections.
//
// Hash entries are homepage section anchors. Nav.astro rewrites them to
// `/#section` when rendered on any route other than `/`, so the same list
// works from both lanes of the site.
export const navLinks = [
  { href: '#csi-project', label: 'CSI Project' },
  { href: '/leadership', label: 'Leadership' },
  { href: '#about', label: 'Background' },
  { href: '#work', label: 'Work' },
] as const;
