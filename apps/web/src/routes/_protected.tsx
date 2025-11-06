import { createFileRoute } from "@tanstack/react-router";
import { redirectIfUnauth } from "@/utils/redirect-if-unauth";

export const Route = createFileRoute("/_protected")({
	component: RouteComponent,
	beforeLoad({ context }) {
		redirectIfUnauth(context.session);
	},
});

function RouteComponent() {
	return <div>Hello "/_protected"!</div>;
}
