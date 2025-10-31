import nodemailer from "nodemailer";
import { oAuth2Client } from "./oauth";

export const getTransporter = async () => {
	const { token } = await oAuth2Client.getAccessToken();

	if (!token) {
		throw new Error("Failed to obtain access token for Gmail OAuth2");
	}

	return nodemailer.createTransport({
		service: "gmail",
		auth: {
			type: "OAuth2",
			user: process.env.GOOGLE_EMAIL_USER,
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
			accessToken: token,
		},
	});
};
