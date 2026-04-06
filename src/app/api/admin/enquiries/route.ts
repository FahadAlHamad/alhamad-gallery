import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: { painting: { select: { title: true } } },
  });

  return NextResponse.json(enquiries);
}
