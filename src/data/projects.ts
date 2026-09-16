import type { PortfolioProject } from '@/data/home-projects';
import { portfolioProjects, getPortfolioProjectBySlug } from '@/data/home-projects';

export type { PortfolioProject };
export { portfolioProjects, getPortfolioProjectBySlug };

// Alias export for any consumer expecting `projects`
export const projects = portfolioProjects;
export const getProjectBySlug = getPortfolioProjectBySlug;
