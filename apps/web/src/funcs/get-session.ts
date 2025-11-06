import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequest, getRequestHeaders } from "@tanstack/react-start/server";
import { authClient } from "@/lib/auth-client";

export const getSession = createIsomorphicFn()
	.client(async () => {
		const session = await authClient.getSession({
			fetchOptions: {
				credentials: "include",
			},
		});

		return session.data;
	})
	.server(async () => {
		getRequest?.();

		const session = await authClient.getSession({
			fetchOptions: {
				headers: getRequestHeaders(),
			},
		});

		return session.data;
	});
