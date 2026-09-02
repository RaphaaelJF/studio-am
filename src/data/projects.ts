import type { Project } from '@/types/project';

/**
 * Projects data shell (Phase 0)
 * Content will be populated in subsequent phases.
 */
export const projects: Project[] = [];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
