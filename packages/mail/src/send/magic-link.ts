import { getTransporter } from "../transporter";

/**
 * Send a magic link email to the specified recipient.
 * @param to
 * @param link
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

	await transporter
		.sendMail({
			from,
			to,
			subject: "Your Magic Link",
			html: `
      <p>Click the link below to log in:</p>
      <a href="${url}">${url}</a>
    `,
		})
		.catch(void 0);
};
