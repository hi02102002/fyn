import type { OAuth2Client } from "google-auth-library";
import { google } from "googleapis";

let oAuth2Client: OAuth2Client | null = null;

export const getOAuth2Client = () => {
	if (oAuth2Client) {
		return oAuth2Client;
	}

	oAuth2Client = new google.auth.OAuth2(
		process.env.GOOGLE_CLIENT_ID,
		process.env.GOOGLE_CLIENT_SECRET,
	);

	oAuth2Client.setCredentials({
		refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
	});

	return oAuth2Client;
};