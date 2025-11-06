import nodemailer from "nodemailer";

export const getTransporter = async () => {
	return nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.GOOGLE_EMAIL_USER,
			pass: process.env.GOOGLE_APP_PASSWORD,
		},
	});
};
