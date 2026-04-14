import {axiosClient} from "./axiosClient";
import { adminApi } from "./adminClient";

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

