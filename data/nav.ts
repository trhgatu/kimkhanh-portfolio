export type NavLink = {
  label: string;
  href: string;
};

export const NAV_LINKS: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Archive", href: "#work" },
  { label: "Notes", href: "#notes" },
  { label: "Contact", href: "#contact" },
];

export const SOCIAL_LINKS: NavLink[] = [
  { label: "Email", href: "mailto:hello@kimkhanh.me" },
];
