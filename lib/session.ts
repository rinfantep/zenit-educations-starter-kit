import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.SESSION_SECRET ||
    "zenith_super_secret_jwt_key_2026_change_in_production",
);

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  schoolId: string | null;
  name?: string;
}

// Generación compatible con Edge Runtime y Node.js usando Web Crypto API
export async function createSessionToken(
  payload: SessionPayload,
): Promise<string> {
  const header = { alg: "HS256", typ: "JWT" };
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7; // Expiración en 7 días

  const encodedHeader = btoa(JSON.stringify(header))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
  const encodedPayload = btoa(JSON.stringify({ ...payload, exp }))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  const dataToSign = `${encodedHeader}.${encodedPayload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    JWT_SECRET,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(dataToSign),
  );
  const signature = btoa(
    String.fromCharCode(...new Uint8Array(signatureBuffer)),
  )
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return `${dataToSign}.${signature}`;
}

export async function verifySessionToken(
  token: string,
): Promise<SessionPayload | null> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, signature] = parts;
    const dataToSign = `${encodedHeader}.${encodedPayload}`;

    const key = await crypto.subtle.importKey(
      "raw",
      JWT_SECRET,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );

    const sigString = atob(signature.replace(/-/g, "+").replace(/_/g, "/"));
    const sigBuffer = new Uint8Array(sigString.length);
    for (let i = 0; i < sigString.length; i++) {
      sigBuffer[i] = sigString.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBuffer,
      new TextEncoder().encode(dataToSign),
    );

    if (!isValid) return null;

    const payloadJson = JSON.parse(
      atob(encodedPayload.replace(/-/g, "+").replace(/_/g, "/")),
    );
    if (payloadJson.exp && Math.floor(Date.now() / 1000) > payloadJson.exp) {
      return null;
    }

    return payloadJson as SessionPayload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(payload: SessionPayload) {
  const token = await createSessionToken(payload);
  const cookieStore = await cookies();
  cookieStore.set("zenith_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("zenith_session");
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get("zenith_session");
  if (!cookie?.value) return null;
  return await verifySessionToken(cookie.value);
}
