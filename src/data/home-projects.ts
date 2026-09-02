export type ProjectImageAspect = "16/10" | "3/2" | "4/5";

export interface ProjectImage {
  aspect: ProjectImageAspect;
}

export interface ProjectData {
  id: string;
  title: string;
  category: string;
  label: string; // e.g., "01 / 03"
  image: ProjectImage;
}

export interface FeaturedProjectData extends ProjectData {
  technical: {
    typology: string;
    location: string;
    area: string;
    year: string;
  };
}

export const selectedProjects: ProjectData[] = [
  {
    id: "01",
    title: "Projeto 01",
    category: "Residencial",
    label: "01 / 03",
    image: { aspect: "16/10" },
  },
  {
    id: "02",
    title: "Projeto 02",
    category: "Interiores",
    label: "02 / 03",
    image: { aspect: "4/5" },
  },
];

export const featuredProject: FeaturedProjectData = {
  id: "03",
  title: "Projeto em Evidência",
  category: "Residencial",
  label: "PROJETO EM EVIDÊNCIA",
  image: { aspect: "16/10" },
  technical: {
    typology: "Residencial",
    location: "—",
    area: "—",
    year: "—",
  },
};
