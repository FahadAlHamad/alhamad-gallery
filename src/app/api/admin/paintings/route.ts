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
  const title = formData.get("title") as string;
  const artist = formData.get("artist") as string;
  const year = formData.get("year") as string;
  const medium = formData.get("medium") as string;
  const dimensions = formData.get("dimensions") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const price = (formData.get("price") as string) || "";
  const sold = formData.get("sold") === "true";
  const featured = formData.get("featured") === "true";
  const sortOrder = parseInt(formData.get("sortOrder") as string) || 0;
  const image = formData.get("image") as File;

  if (!image) {
    return NextResponse.json({ error: "Image required" }, { status: 400 });
  }

  const ext = path.extname(image.name) || ".jpg";
  const filename = `${slugify(title)}-${Date.now()}${ext}`;
  const buffer = Buffer.from(await image.arrayBuffer());
  const uploadPath = path.join(process.cwd(), "public/images/paintings", filename);
  await writeFile(uploadPath, buffer);

  const slug = slugify(title);
  let uniqueSlug = slug;
  const existing = await prisma.painting.findUnique({ where: { slug } });
  if (existing) uniqueSlug = `${slug}-${Date.now()}`;

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
      imageUrl: `/images/paintings/${filename}`,
      sortOrder,
    },
  });

  return NextResponse.json(painting);
}
