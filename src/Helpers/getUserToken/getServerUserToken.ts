import { decode } from "next-auth/jwt";
import { cookies } from "next/headers";

export async function getServerUserToken() {
  const cookieStore = cookies();

  const rawToken =
    cookieStore.get("next-auth.session-token")?.value ??
    cookieStore.get("__Secure-next-auth.session-token")?.value;

  if (!rawToken) return null;

  const decoded = await decode({
    token: rawToken,
    secret: process.env.NEXTAUTH_SECRET!,
  });

  return decoded?.token as string | null;
}
