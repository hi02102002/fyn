import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/bots/")({
	component: RouteComponent,
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
	const { data: bots, isLoading } = useQuery(orpc.bot.listBots.queryOptions());

	if (isLoading) {
		return (
			<div className="container mx-auto py-8">
				<div className="mb-6 flex items-center justify-between">
					<h1 className="font-bold text-3xl">My Bots</h1>
				</div>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{[1, 2, 3].map((i) => (
						<Card key={i}>
							<CardHeader>
								<div className="h-6 animate-pulse rounded bg-gray-200" />
								<div className="mt-2 h-4 animate-pulse rounded bg-gray-100" />
							</CardHeader>
						</Card>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto py-8">
			<div className="mb-6 flex items-center justify-between">
				<h1 className="font-bold text-3xl">My Bots</h1>
				<Link to="/bots/new">
					<Button>Create New Bot</Button>
				</Link>
			</div>

			{bots && bots.length > 0 ? (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{bots.map((bot) => (
						<Link key={bot.id} to="/bots/$botId" params={{ botId: bot.id }}>
							<Card className="cursor-pointer transition-shadow hover:shadow-lg">
								<CardHeader>
									<CardTitle>{bot.name}</CardTitle>
									<CardDescription>
										{bot.description || "No description"}
									</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-gray-500 text-sm">
										Created {new Date(bot.createdAt).toLocaleDateString()}
									</p>
								</CardContent>
							</Card>
						</Link>
					))}
				</div>
			) : (
				<Card>
					<CardContent className="flex flex-col items-center justify-center py-12">
						<p className="mb-4 text-gray-500">
							You haven't created any bots yet
						</p>
						<Link to="/bots/new">
							<Button>Create Your First Bot</Button>
						</Link>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
