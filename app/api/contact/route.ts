import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  message: z.string().min(10),
});

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Nieprawidłowe dane" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Nieprawidłowe dane" }, { status: 400 });
  }

  const { name, email, message } = parsed.data;

  const { error } = await resend.emails.send({
    from: "Portfolio <onboarding@resend.dev>",
    to: "ulanantek11@gmail.com",
    subject: `Nowa wiadomość od ${name}`,
    text: `Od: ${name} <${email}>\n\n${message}`,
  });

  if (error) {
    console.error("[contact] resend error:", error.name, error.message);
    return NextResponse.json({ error: "Błąd wysyłki" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
