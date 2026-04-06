import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { writeFile } from "fs/promises";
import path from "path";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const paintingId = parseInt(id);
  const formData = await req.formData();

  const data: Record<string, unknown> = {
    title: formData.get("title") as string,
    artist: formData.get("artist") as string,
    year: formData.get("year") as string,
    medium: formData.get("medium") as string,
    dimensions: formData.get("dimensions") as string,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    price: (formData.get("price") as string) || "",
    sold: formData.get("sold") === "true",
    featured: formData.get("featured") === "true",
    sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
  };

  const image = formData.get("image") as File | null;
  if (image && image.size > 0) {
    const ext = path.extname(image.name) || ".jpg";
    const filename = `${slugify(data.title as string)}-${Date.now()}${ext}`;
    const buffer = Buffer.from(await image.arrayBuffer());
    const uploadPath = path.join(process.cwd(), "public/images/paintings", filename);
    await writeFile(uploadPath, buffer);
    data.imageUrl = `/images/paintings/${filename}`;
  }

  const painting = await prisma.painting.update({
    where: { id: paintingId },
    data: data as Parameters<typeof prisma.painting.update>[0]["data"],
  });

  return NextResponse.json(painting);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  await prisma.painting.delete({ where: { id: parseInt(id) } });
  return NextResponse.json({ success: true });
}
