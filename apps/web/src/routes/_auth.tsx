import { CaretLeftIcon } from "@phosphor-icons/react";
import {
	createFileRoute,
	Link,
	Outlet,
	useRouter,
} from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

const RouteComponent = () => {
	const { history } = useRouter();

	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="flex flex-col gap-4 p-6">
				<div className="flex justify-center gap-2 md:justify-start">
					<Link to="/" className="flex items-center gap-2 font-bold text-xl">
						<div className="flex items-center justify-center rounded-md text-primary-foreground">
							<img src="/logo.svg" alt="Logo" className="h-8 w-8" />
						</div>
						Fync
					</Link>
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full max-w-md">
						<Button
							variant="ghost"
							onClick={() => history.back()}
							className="mb-2 cursor-pointer"
						>
							<CaretLeftIcon />
							Back
						</Button>
						<Outlet />
					</div>
				</div>
			</div>
			<div className="relative hidden bg-accent-foreground lg:block" />
		</div>
	);
};

export const Route = createFileRoute("/_auth")({
	component: RouteComponent,
});
