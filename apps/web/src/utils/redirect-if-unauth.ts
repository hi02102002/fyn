import { redirect } from "@tanstack/react-router";
import type { getSession } from "@/funcs/get-session";

export const redirectIfUnauth = (
	session: Awaited<ReturnType<typeof getSession>>,
) => {
	if (!session?.user.id) {
		throw redirect({
			to: "/login",
			search: {
				redirect:
					typeof window === "undefined" ? "/" : window.location.pathname,
			},
		});
	}
};
