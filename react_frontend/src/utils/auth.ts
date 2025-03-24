import { jwtDecode } from "jwt-decode";

interface TokenPayload {
    userId: string;
    roles: string[];
    exp: number;
}

export function isTokenValid(): boolean {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        const decoded = jwtDecode<TokenPayload>(token);
        const currentTime = Date.now() / 1000; // Convert to seconds
        return decoded.exp > currentTime;
    } catch (error) {
        console.error("Token validation error:", error);
        return false;
    }
}

export function getTokenPayload(): TokenPayload | null {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        return jwtDecode<TokenPayload>(token);
    } catch (error) {
        console.error("Token decode error:", error);
        return null;
    }
}

export function clearAuth() {
    localStorage.removeItem("token");
    window.location.href = "/";
} 