import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { put } from "@vercel/blob";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const paintings = await prisma.painting.findMany({ orderBy: { sortOrder: "asc" } });
  return NextResponse.json(paintings);
}

export async function POST(req: NextRequest) {
  const { error } = await requireAdmin();
  if (error) return error;

  const formData = await req.formData();
  const title       = formData.get("title")       as string;
  const artist      = formData.get("artist")      as string;
  const year        = formData.get("year")        as string;
  const medium      = formData.get("medium")      as string;
  const dimensions  = formData.get("dimensions")  as string;
  const description = formData.get("description") as string;
  const category    = formData.get("category")    as string;
  const price       = (formData.get("price")      as string) || "";
  const sold        = formData.get("sold")        === "true";
  const featured    = formData.get("featured")    === "true";
  const sortOrder   = parseInt(formData.get("sortOrder") as string) || 0;
  const image       = formData.get("image")       as File | null;

  if (!image || image.size === 0) {
    return NextResponse.json({ error: "Image required" }, { status: 400 });
  }

  const slug = slugify(title);
  const existing = await prisma.painting.findUnique({ where: { slug } });
  const uniqueSlug = existing ? `${slug}-${Date.now()}` : slug;

  // Upload to Vercel Blob (persists across deployments)
  const ext = image.name.split(".").pop() ?? "jpg";
  const { url: imageUrl } = await put(
    `paintings/${uniqueSlug}-${Date.now()}.${ext}`,
    image,
    { access: "public" },
  );

  const painting = await prisma.painting.create({
    data: {
      slug: uniqueSlug,
      title,
      artist,
      year,
      medium,
      dimensions,
      description,
      category,
      price,
      sold,
      featured,
      imageUrl,
      sortOrder,
    },
  });

  return NextResponse.json(painting);
}
