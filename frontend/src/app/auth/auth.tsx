

export function loginWithGoogle(){
    window.location.assign("/.auth/login/google?post_login_redirect_uri=/");
}
export function logout(){
    window.location.assign("/.auth/logout?post_logout_redirect_uri=/");
}

export async function getUser(){
    const res = await fetch("/.auth/me", {
        credentials: "include",
        cache: "no-store",
    });
    if(!res.ok) return null;

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) return null;

    const auth = data[0];

    return{
        userId: auth.user_id,
        provider: auth.provider_name,
        claims: auth.user_claims,
        email: auth.user_claims.find((c: any) => c.typ === "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress")?.val ?? null,
        name: auth.user_claims.find((c: any) => c.typ === "name")?.val ?? null,
    };
}