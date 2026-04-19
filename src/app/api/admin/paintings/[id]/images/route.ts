import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { put } from "@vercel/blob";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const images = await prisma.paintingImage.findMany({
    where: { paintingId: parseInt(id) },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json(images);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const paintingId = parseInt(id);
  const formData = await req.formData();

  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) {
    return NextResponse.json({ error: "Image required" }, { status: 400 });
  }

  const caption   = (formData.get("caption")   as string) || null;
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;

  const ext = file.name.split(".").pop() ?? "jpg";
  const { url } = await put(
    `paintings/extras/${paintingId}-${Date.now()}.${ext}`,
    file,
    { access: "public" },
  );

  const image = await prisma.paintingImage.create({
    data: { paintingId, url, caption, sortOrder },
  });

  return NextResponse.json(image);
}
