const CLOUDFLARE_R2_BASE_URL =
	"https://pub-738b0d8f2108d4412cc5a07654cea07b.r2.dev";

export const digitalOcean = {
	EFFECTS_ROOT_URL: `${CLOUDFLARE_R2_BASE_URL}/fyn/lofi/effects/`,
	ALARMS_ROOT_URL: `${CLOUDFLARE_R2_BASE_URL}/fyn/lofi/alarms/`,
	TRACKS_ROOT_URL: `${CLOUDFLARE_R2_BASE_URL}/fyn/lofi/ogtracks/`,
	SCENES_ROOT_URL: `${CLOUDFLARE_R2_BASE_URL}/fyn/lofi/scenes/`,
	WALLPAPERS_ROOT_URL: `${CLOUDFLARE_R2_BASE_URL}/fyn/lofi/wallpapers/`,
	CLOUDFLARE_R2_BASE_URL,
} as const;
