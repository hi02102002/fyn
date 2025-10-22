import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { orpc, queryClient } from "@/utils/orpc";

export const Route = createFileRoute("/bots/new")({
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
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");

	const createBot = useMutation({
		...orpc.bot.createBot.mutationOptions(),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: ["bot", "listBots"] });
			navigate({ to: "/bots/$botId", params: { botId: data.id } });
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (name.trim()) {
			createBot.mutate({
				name,
				description,
			});
		}
	};

	return (
		<div className="container mx-auto max-w-2xl py-8">
			<Card>
				<CardHeader>
					<CardTitle>Create New Bot</CardTitle>
					<CardDescription>
						Give your bot a name and description to get started
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="name">Bot Name *</Label>
							<Input
								id="name"
								placeholder="My Awesome Bot"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="description">Description</Label>
							<Input
								id="description"
								placeholder="What does this bot do?"
								value={description}
								onChange={(e) => setDescription(e.target.value)}
							/>
						</div>

						<div className="flex gap-2">
							<Button
								type="submit"
								disabled={!name.trim() || createBot.isPending}
							>
								{createBot.isPending ? "Creating..." : "Create Bot"}
							</Button>
							<Button
								type="button"
								variant="outline"
								onClick={() => navigate({ to: "/bots" })}
							>
								Cancel
							</Button>
						</div>

						{createBot.isError && (
							<p className="text-red-500 text-sm">
								Error creating bot. Please try again.
							</p>
						)}
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
