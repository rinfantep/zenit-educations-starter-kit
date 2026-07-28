import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  if (!resend) {
    console.log("[DEV] Reset link (Resend no configurado):", resetUrl);
    return;
  }

  await resend.emails.send({
    from: "Zenith Education <onboarding@resend.dev>",
    to,
    subject: "Restablecé tu contraseña",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #10192E;">Zenith Education</h2>
        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
        <a href="${resetUrl}" style="display:inline-block; background:#10192E; color:#fff; padding:10px 20px; border-radius:8px; text-decoration:none;">Restablecer contraseña</a>
        <p style="color:#888; font-size:12px; margin-top:20px;">Si no solicitaste esto, ignorá este correo. El enlace expira en 1 hora.</p>
      </div>
    `,
  });
}
