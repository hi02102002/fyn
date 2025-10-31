import { createFileRoute } from "@tanstack/react-router";
import { LoginForm, SocialBtn } from "./_components";

export const Route = createFileRoute("/_auth/login/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="space-y-4">
			<div className="mb-2">
				<h1 className="mb-2 font-semibold text-2xl lg:text-3xl">
					Welcome Back!
				</h1>
				<p className="text-muted-foreground text-sm">
					Please log in to continue using our features.
				</p>
			</div>
			<div className="grid grid-cols-2 gap-3">
				<SocialBtn provider="google" />
				<SocialBtn provider="github" />
			</div>
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<div className="w-full border-strong border-t" />
				</div>
				<div className="relative flex justify-center text-sm">
					<span className="bg-white px-2 text-muted-foreground text-sm">
						Or
					</span>
				</div>
			</div>
			<LoginForm />
		</div>
	);
}
