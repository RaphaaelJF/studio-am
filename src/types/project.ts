export type ProjectCategory = 'architecture' | 'interior' | 'urbanism' | string;

export interface ProjectScope {
  concept: boolean;
  architecture: boolean;
  engineering: boolean;
  execution: boolean;
  consulting: boolean;
}

export interface Project {
  slug: string;
  title: string;
  location: string;
  year: number;
  category: ProjectCategory;
  scope: string[];
  area: string; // e.g. "450 m²"
  description: string;
  cover: string;
  gallery: string[];
}
