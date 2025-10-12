import type { AppRouter } from "@fyn/api/routers/index";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { createIsomorphicFn } from "@tanstack/react-start";
import { getRequest, getRequestHeaders } from "@tanstack/react-start/server";
import { toast } from "sonner";

export const queryClient = new QueryClient({
	queryCache: new QueryCache({
		onError: (error) => {
			toast.error(`Error: ${error.message}`, {
				action: {
					label: "retry",
					onClick: () => {
						queryClient.invalidateQueries();
					},
				},
			});
		},
	}),
});

const getORPCClient = createIsomorphicFn()
	.server((): RouterClient<AppRouter> => {
		getRequest();
		const link = new RPCLink({
			url: `${import.meta.env.VITE_SERVER_URL}/rpc`,
			fetch(url, options) {
				return fetch(url, {
					...options,
					credentials: "include",
					headers: getRequestHeaders(),
				});
			},
		});

		return createORPCClient(link);
	})
	.client((): RouterClient<AppRouter> => {
		const link = new RPCLink({
			url: `${import.meta.env.VITE_SERVER_URL}/rpc`,
			fetch(url, options) {
				return fetch(url, {
					...options,
					credentials: "include",
				});
			},
		});

		return createORPCClient(link);
	});

export const client: RouterClient<AppRouter> = getORPCClient();

export const orpc = createTanstackQueryUtils(client);
