import { getTransporter } from "../transporter";

/**
 * Send a magic link email to the specified recipient.
 * @param to - The recipient's email address.
 * @param url - The magic link URL.
 * @param from - The sender's email address
 */
export const sendMagicLinkEmail = async ({
	to,
	url,
	from = "Fyn Mailer <fyn@gmail.com>",
}: {
	to: string;
	url: string;
	from?: string;
}) => {
	const transporter = await getTransporter();

	const res = await transporter.sendMail({
		from,
		to,
		subject: "Your Magic Link",
		html: `
      <p>Click the link below to log in:</p>
      <a href="${url}">${url}</a>
    `,
	});

	return res;
};
