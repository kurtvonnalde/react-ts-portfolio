// src/components/AuthButtons.tsx
import { useEffect, useState } from "react";

type ClientPrincipal = {
  identityProvider: string;
  userId: string;
  userDetails: string; // usually email
  claims: { typ: string; val: string }[];
};

type AuthMeResponse = {
  clientPrincipal?: ClientPrincipal;
};

function claim(claims: ClientPrincipal["claims"], type: string) {
  return claims?.find(c => c.typ === type)?.val;
}

export default function AuthButtons() {
  const [user, setUser] = useState<ClientPrincipal | null>(null);
  const [loading, setLoading] = useState(true);

  const login = () => window.location.assign("/.auth/login/google");
  const logout = () => window.location.assign("/.auth/logout");

  async function loadUser() {
    setLoading(true);
    try {
      const res = await fetch("/.auth/me", { credentials: "include" });
      // If not logged in, some configs return 401/403 or empty payload
      if (!res.ok) {
        setUser(null);
        return;
      }
      const data: AuthMeResponse[] = await res.json();
      const principal = data?.[0]?.clientPrincipal ?? null;
      setUser(principal);
    } finally {
      setLoading(false);
    }
  }

  // Call backend to upsert visitor
  async function syncVisitorToBackend(principal: ClientPrincipal) {
    const payload = {
      userId: principal.userId,
      email: principal.userDetails,
      name:
        claim(principal.claims, "name") ||
        claim(principal.claims, "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name") ||
        "",
      provider: principal.identityProvider || "google"
    };

    // Replace with your backend URL (recommended to use env var)
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    await fetch(`${backendUrl}/api/users/visit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
  }

  useEffect(() => {
    loadUser();
  }, []);

  useEffect(() => {
    if (user) {
      // When user becomes available, upsert to Cosmos
      syncVisitorToBackend(user).catch(console.error);
    }
  }, [user]);

  if (loading) return <button disabled>Checking sign-in…</button>;

  return user ? (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <span>Signed in as <b>{user.userDetails}</b></span>
      <button onClick={logout}>Logout</button>
    </div>
  ) : (
    <button onClick={login}>Sign in with Google</button>
  );
}