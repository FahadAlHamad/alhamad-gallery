import nodemailer from "nodemailer";

export async function sendEnquiryEmail(data: {
  name: string;
  email: string;
  phone?: string;
  paintingTitle?: string;
  message: string;
}) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_EMAIL } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.log("SMTP not configured — skipping email notification");
    console.log("Enquiry received:", data);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT) || 587,
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });

  await transporter.sendMail({
    from: `"Alhamad Gallery" <${SMTP_USER}>`,
    to: CONTACT_EMAIL || "admin@alhamadgallery.com",
    replyTo: data.email,
    subject: `New Enquiry${data.paintingTitle ? `: ${data.paintingTitle}` : ""}`,
    text: [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      data.phone ? `Phone: ${data.phone}` : null,
      data.paintingTitle ? `Painting: ${data.paintingTitle}` : null,
      `\nMessage:\n${data.message}`,
    ]
      .filter(Boolean)
      .join("\n"),
  });
}
