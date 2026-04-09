// src/components/AuthButtons.tsx
import { useEffect, useState } from "react";
import { getUser } from "./auth";
import { axiosClient } from "../../api/axiosClient";

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

  // ✅ 1) Load signed-in user
  useEffect(() => {
    getUser().then(u => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  // ✅ 2) AFTER user is confirmed → save to DB using Axios
  useEffect(() => {
    if (!user) return;

    async function saveUserToDb() {
      try {
        await axiosClient.post("/api/users/visit");
        console.log("✅ User saved to Cosmos DB");
      } catch (err) {
        console.error("❌ Failed to save user", err);
      }
    }

    saveUserToDb();
  }, [user]); // 👈 THIS is the key

  if (loading) {
    return <button disabled>Loading...</button>;
  }

  if (!user) {
    return (
      <button
        onClick={() =>
          window.location.assign(
            "/.auth/login/google?post_login_redirect_uri=/"
          )
        }
      >
        Sign In with Google
      </button>
    );
  }

  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <span>
        Signed in as <b>{user.name}</b>
      </span>
      <button
        onClick={() =>
          window.location.assign(
            "/.auth/logout?post_logout_redirect_uri=/"
          )
        }
      >
        Sign Out
      </button>
    </div>
  );
}
