// src/components/AuthButtons.tsx
import { useEffect, useState } from "react";
import { getUser } from "./auth";

type ClientPrincipal = {
  userId: any;
  provider: any;
  claims: any;
  email: any;
  name: any;
};

export default function AuthButtons() {
  const [user, setUser] = useState<ClientPrincipal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser().then(u => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (loading){
    return <button disabled>Loading...  </button>;
  }

  if (!user) {
    return (
      <button onClick={() => window.location.assign("/.auth/login/google?post_login_redirect_uri=/")}>
        Sign In with Google
      </button>
    );
  }
  return (
   <div style={{display: "flex", gap: 12, alignItems: "center"}}>
    <span>Signed in as <b>{user.name}</b></span>
    <button onClick={() => window.location.assign("/.auth/logout?post_logout_redirect_uri=/")}>
      Sign Out
    </button>
   </div>
  );
}