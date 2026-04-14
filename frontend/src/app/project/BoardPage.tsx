import { useEffect, useState } from "react";
import { fetchProjects } from "../../api/projectsApi";
import type { BoardResponse } from "../../types/board";
import AdminPanel from "../../components/projects/AdminPanel";
import KanbanBoard from "../../components/projects/ProjectBoards";

export default function BoardPage() {
  const [data, setData] = useState<BoardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [adminMode, setAdminMode] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const board = await fetchProjects();
      setData(board);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  if (loading) return <div>Loading board…</div>;
  if (!data) return <div>Failed to load board.</div>;

  return (
    <div style={{ padding: 16 }}>
      <h2>Project Board</h2>

      {/* Optional admin toggle (key not stored in code) */}
      <AdminPanel adminMode={adminMode} setAdminMode={setAdminMode} />

      <KanbanBoard
        data={data}
        adminMode={adminMode}
        onRefresh={load}
      />
    </div>
  );
}