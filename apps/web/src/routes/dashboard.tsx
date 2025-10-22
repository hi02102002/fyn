import { useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client";
import { orpc, queryClient } from "@/utils/orpc";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
	loader: async () => {
		console.log(
			"Dashboard loaded",
			typeof window === "undefined" ? "server" : "client",
		);

		const { time } = await queryClient.ensureQueryData(
			orpc.serverTime.queryOptions(),
		);

		console.log("Server time:", time);
	},
	beforeLoad: async () => {
		const session = await authClient.getSession();
		if (!session.data) {
			redirect({
				to: "/login",
				throw: true,
			});
		}
		return { session };
	},
});

function RouteComponent() {
	const { session } = Route.useRouteContext();

	const { data: bots } = useQuery(orpc.bot.listBots.queryOptions());

	return (
		<div className="container mx-auto py-8">
			<h1 className="text-3xl font-bold mb-4">Dashboard</h1>
			<p className="text-lg mb-8">Welcome {session.data?.user.name}</p>
			
			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
				<div className="border rounded-lg p-6 bg-white">
					<h2 className="text-xl font-semibold mb-2">My Bots</h2>
					<p className="text-3xl font-bold mb-2">{bots?.length || 0}</p>
					<p className="text-sm text-gray-500 mb-4">Total bots created</p>
					<a 
						href="/bots" 
						className="text-blue-500 hover:underline text-sm"
					>
						View all bots →
					</a>
				</div>

				<div className="border rounded-lg p-6 bg-white">
					<h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
					<div className="space-y-2">
						<a 
							href="/bots/new" 
							className="block text-blue-500 hover:underline text-sm"
						>
							+ Create new bot
						</a>
					</div>
				</div>
			</div>
		</div>
	);
}
