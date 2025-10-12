import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import SignInForm from "@/components/sign-in-form";
import SignUpForm from "@/components/sign-up-form";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/login")({
	loader: async ({ context }) => {
		console.log(
			"Dashboard loaded",
			typeof window === "undefined" ? "server" : "client",
		);

		const time = await context.queryClient.ensureQueryData(
			orpc.serverTime.queryOptions(),
		);

		return { time };
	},
	component: RouteComponent,
});

function RouteComponent() {
	const [showSignIn, setShowSignIn] = useState(false);

	return showSignIn ? (
		<SignInForm onSwitchToSignUp={() => setShowSignIn(false)} />
	) : (
		<SignUpForm onSwitchToSignIn={() => setShowSignIn(true)} />
	);
}
