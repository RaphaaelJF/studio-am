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

export type ProjectStatus = 'draft' | 'published';

export interface DbProject {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  description: string | null;
  category: string;
  location: string | null;
  year: number | null;
  area: string | null;
  status: ProjectStatus;
  featured: boolean;
  display_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbProjectImage {
  id: string;
  project_id: string;
  storage_path: string;
  alt: string;
  caption: string | null;
  display_order: number;
  is_cover: boolean;
  created_at: string;
  updated_at: string;
}

