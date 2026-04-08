

export function loginWithGoogle(){
    window.location.assign("/.auth/login/google")
}
export function logout(){
    window.location.assign("/.auth/logout")
}

export async function getUser(){
    const res = await fetch("/.auth/me", {
        credentials: "include",
    });
    if(!res.ok) return null;

    const data = await res.json();

    return data?.[0]?.clientPrincipal ?? null;
}