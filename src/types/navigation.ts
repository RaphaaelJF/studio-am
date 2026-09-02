export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface HeaderNavigation {
  items: NavItem[];
}

export interface FooterNavigation {
  items: NavItem[];
}
