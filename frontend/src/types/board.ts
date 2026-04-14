export type StatusColumn = "Planned" | "In Progress" | "Completed" | "On Hold";

export type ProjectCard = {
  id: string;
  title: string;
  description?: string;
  status: StatusColumn;
  feature: string;
  order?: number;
  pinned?: boolean;
  pinOrder?: number;
  techStack?: string[];
};

export type BoardResponse = {
    columns: StatusColumn[];
    features: string[];
    board: Record<string, Record<string, ProjectCard[]>>;
};
