import { getTransporter } from "../transporter";

/**
 * Send a magic link email to the specified recipient.
 * @param to 
 * @param link 
 */
export const sendMagicLinkEmail = async (to: string, link: string) => {
  const transporter = await getTransporter();

  await transporter.sendMail({
    from: "Fyn Mailer <fyn@gmail.com>",
    to,
    subject: "Your Magic Link",
    html: `
      <p>Click the link below to log in:</p>
      <a href="${link}">${link}</a>
    `,
  }).catch((void 0));
}