import {axiosClient} from "./axiosClient";
import { adminApi } from "./adminClient";
import type { StatusColumn } from "../types/board";

export async function fetchProjects(params?: {
    feature?: string;
    techStack?: string;
    includeDeleted?: boolean;

}){
    const res = await axiosClient.get("/projects/board", {params});
    return res.data;
}

export async function moveProject(projectId: string, moveData: { toFeature: string; toStatus: string; toOrder: number }) {
    const res = await adminApi.patch(`/projects/${projectId}/move`, moveData);
    return res.data;
}


export async function createProject(payload: {
  title: string;
  description?: string;
  status: StatusColumn;
  feature: string;
  techStack?: string[];
  repoUrl?: string;
  demoUrl?: string;
  pinned?: boolean;
  pinOrder?: number;
  highlights?: boolean;
  order?: number | null;
}) {
  const res = await adminApi.post("/projects", payload);
  return res.data;
}

// ✅ ADD: soft delete
export async function softDeleteProject(projectId: string) {
  const res = await adminApi.delete(`/projects/${projectId}`);
  return res.data;
}

// ✅ Optional: restore
export async function restoreProject(projectId: string) {
  const res = await adminApi.post(`/projects/${projectId}/restore`);
  return res.data;
}

