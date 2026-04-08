// src/components/AuthButtons.tsx
import { useEffect, useState } from "react";
import { loginWithGoogle, logout, getUser } from "./auth";

type ClientPrincipal = {
  identityProvider: string;
  userId: string;
  userDetails: string; // usually email
  claims: { typ: string; val: string }[];
};

export default function AuthButtons() {
  const [user, setUser] = useState<ClientPrincipal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      const principal = await getUser();
      setUser(principal);
      setLoading(false);
    }
    loadUser();
  }, []);

  if (loading){
    return <button disabled>Loading...  </button>;
  }

  if (!user) {
    return (
      <button onClick={loginWithGoogle}>
        Sign In with Google
      </button>
    );
  }
  return (
   <div style={{display: "flex", gap: 12, alignItems: "center"}}>
    <span>Signed in as <b>{user.userDetails}</b></span>
    <button onClick={logout}>
      Sign Out
    </button>
   </div>
  );
}