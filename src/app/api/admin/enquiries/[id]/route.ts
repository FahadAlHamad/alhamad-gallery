import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const { read } = await req.json();

  const enquiry = await prisma.enquiry.update({
    where: { id: parseInt(id) },
    data: { read },
  });

  return NextResponse.json(enquiry);
}
