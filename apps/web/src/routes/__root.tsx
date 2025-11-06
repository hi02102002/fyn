import type { QueryClient } from "@tanstack/react-query";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { NuqsAdapter } from "nuqs/adapters/tanstack-router";
import { Toaster } from "@/components/ui/sonner";
import { getSession } from "@/funcs/get-session";
import appCss from "@/styles/index.css?url";
import type { orpc } from "@/utils/orpc";

export interface RouterAppContext {
	orpc: typeof orpc;
	queryClient: QueryClient;
	session?: Awaited<ReturnType<typeof getSession>>;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Fyn - Chatbot flows made easy",
			},
			{
				name: "description",
				content:
					"Fyn is a powerful platform that enables you to create, manage, and deploy chatbot flows with ease.",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "icon",
				href: "/logo.svg",
			},
		],
	}),
	async beforeLoad() {
		const session = await getSession();

		return {
			session,
		};
	},
	component: RootDocument,
});

function RootDocument() {
	return (
		<html lang="en" className="light">
			<head>
				<HeadContent />
			</head>
			<body>
				<NuqsAdapter>
					<Outlet />
					<Toaster position="top-center" />
					<TanStackRouterDevtools position="bottom-left" />
					<ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
					<Scripts />
				</NuqsAdapter>
			</body>
		</html>
	);
}
