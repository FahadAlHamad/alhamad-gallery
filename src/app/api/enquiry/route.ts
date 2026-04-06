import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEnquiryEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, paintingId, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const pId = paintingId ? parseInt(paintingId, 10) : null;

    let paintingTitle: string | undefined;
    if (pId) {
      const painting = await prisma.painting.findUnique({ where: { id: pId } });
      paintingTitle = painting?.title;
    }

    await prisma.enquiry.create({
      data: {
        name,
        email,
        phone: phone || "",
        message,
        paintingId: pId,
      },
    });

    try {
      await sendEnquiryEmail({ name, email, phone, paintingTitle, message });
    } catch (emailErr) {
      console.error("Email send failed:", emailErr);
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
