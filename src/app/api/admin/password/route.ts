import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const { error, session } = await requireAdmin();
  if (error || !session) return error;

  const { currentPassword, newPassword } = await req.json();

  const user = await prisma.adminUser.findUnique({ where: { id: session.userId } });
  if (!user || !bcrypt.compareSync(currentPassword, user.passwordHash)) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
  }

  const passwordHash = bcrypt.hashSync(newPassword, 12);
  await prisma.adminUser.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  return NextResponse.json({ success: true });
}
