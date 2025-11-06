export type Provider =
	| "gmail"
	| "outlook_live"
	| "outlook_o365"
	| "yahoo"
	| "icloud"
	| "proton"
	| "yandex"
	| "zoho"
	| "unknown";

export const getEmailProvider = (email: string): Provider => {
	const domain = email.split("@")[1]?.toLowerCase() || "";

	console.log("Determining provider for domain:", domain);

	if (["gmail.com", "googlemail.com"].includes(domain)) return "gmail";
	if (["outlook.com", "hotmail.com", "live.com", "msn.com"].includes(domain))
		return "outlook_live";
	if (
		domain.endsWith(".onmicrosoft.com") ||
		domain.endsWith(".office365.com") ||
		domain.endsWith(".microsoft.com")
	)
		return "outlook_o365";
	if (["yahoo.com", "ymail.com", "rocketmail.com"].includes(domain))
		return "yahoo";
	if (["icloud.com", "me.com", "mac.com"].includes(domain)) return "icloud";
	if (["proton.me", "protonmail.com"].includes(domain)) return "proton";
	if (["yandex.com", "yandex.ru"].includes(domain)) return "yandex";
	if (["zoho.com", "zohomail.com"].includes(domain)) return "zoho";
	return "unknown";
};

export const buildEmailSearchQuery = ({
	from,
	subject,
}: {
	from: string;
	subject?: string;
}) => {
	const parts: string[] = [];

	if (from) {
		parts.push(`from:${from}`);
	}

	if (subject) {
		parts.push(`subject:"${subject}"`);
	}

	return parts.join(" ");
};

export const inboxUrlFor = (email: string, query: string) => {
	const provider = getEmailProvider(email);
	const q = encodeURIComponent(query);

	switch (provider) {
		case "gmail":
			return `https://mail.google.com/mail/u/0/#search/${q || ""}`;
		case "outlook_live":
			return `https://outlook.live.com/mail/0/search?q=${q}`;
		case "outlook_o365":
			return `https://outlook.office.com/mail/search?q=${q}`;
		case "yahoo":
			return `https://mail.yahoo.com/d/search/keyword=${q}`;
		case "icloud":
			return "https://www.icloud.com/mail";
		case "proton":
			return `https://mail.proton.me/u/0/all-mail#keyword=${q}`;
		case "yandex":
			return "https://mail.yandex.com/";
		case "zoho":
			return "https://mail.zoho.com/";
		default: {
			const domain = email.split("@")[1] || "";
			const guesses = [
				`https://mail.${domain}`,
				`https://webmail.${domain}`,
				`https://${domain}/webmail`,
			];
			return guesses[0];
		}
	}
};
