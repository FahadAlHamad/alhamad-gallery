import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> },
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { imageId } = await params;
  const body = await req.json() as { caption?: string; sortOrder?: number };

  const image = await prisma.paintingImage.update({
    where: { id: parseInt(imageId) },
    data: {
      ...(body.caption   !== undefined && { caption:   body.caption }),
      ...(body.sortOrder !== undefined && { sortOrder: body.sortOrder }),
    },
  });

  return NextResponse.json(image);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> },
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { imageId } = await params;
  await prisma.paintingImage.delete({ where: { id: parseInt(imageId) } });
  return NextResponse.json({ success: true });
}
