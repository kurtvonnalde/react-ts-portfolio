

export function loginWithGoogle(){
    window.location.assign("/.auth/login/google?post_login_redirect_uri=/");
}
export function logout(){
    window.location.assign("/.auth/logout?post_logout_redirect_uri=/");
}

export async function getUser(){
    const res = await fetch("/.auth/me", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
    });
    if(!res.ok) return null;

    const data = await res.json();

    return data?.[0]?.clientPrincipal ?? null;
}