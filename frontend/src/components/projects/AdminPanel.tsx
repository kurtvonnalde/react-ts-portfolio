
import { useState } from "react";
import { setAdminToken } from "../../api/adminClient";

export default function AdminPanel({
  adminMode,
  setAdminMode,
}: {
  adminMode: boolean;
  setAdminMode: (v: boolean) => void;
}) {
  const [key, setKey] = useState("");

  function enable() {
    setAdminToken(key.trim() || null);
    setAdminMode(true);
  }

  function disable() {
    setAdminToken(null);
    setAdminMode(false);
  }

  return(
    
<div style={{ marginBottom: 16, display: "flex", gap: 12, alignItems: "center" }}>
      {!adminMode ? (
        <>
          <input
            type="password"
            placeholder="Enter admin key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            style={{ padding: 8, width: 280 }}
          />
          <button onClick={enable}>Enable Admin Mode</button>
        </>
      ) : (
        <>
          <span style={{ fontWeight: 600 }}>Admin Mode Enabled</span>
          <button onClick={disable}>Disable</button>
        </>
      )}
    </div>

  );
}