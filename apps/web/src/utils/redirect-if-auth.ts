import { redirect } from "@tanstack/react-router";
import type { getSession } from "@/funcs/get-session";

export const redirectIfAuth = (
	session: Awaited<ReturnType<typeof getSession>>,
	search: Record<string, string>,
) => {
	if (session?.user.id) {
		throw redirect({
			href: "redirect" in search ? (search.redirect as string) || "/" : "/",
			replace: true,
		});
	}
};
