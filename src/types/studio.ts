export interface StudioMember {
  name: string;
  role: string;
  bio?: string;
}

export interface StudioInfo {
  name: string;
  tagline: string;
  description: string;
  foundingYear?: number;
  location?: string;
  team?: StudioMember[];
}
