import { createFileRoute, redirect } from "@tanstack/react-router";


export const Route = createFileRoute("/_protected")({
	component: RouteComponent,
	beforeLoad({ context, serverContext }) {
		console.log("Protected route serverContext:", serverContext);

		if (!context.session?.user.id) {
			throw redirect({
				to: "/login",
				replace: true,
				search: {
					redirect:
						typeof window === "undefined" ? "/" : window.location.pathname,
				},
			});
		}
	},
});

function RouteComponent() {
	return <div>Hello "/_protected"!</div>;
}
