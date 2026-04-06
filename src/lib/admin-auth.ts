import { getSession } from "./session";
import { NextResponse } from "next/server";

export async function requireAdmin() {
  const session = await getSession();
  if (!session.isLoggedIn) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }), session: null };
  }
  return { error: null, session };
}
