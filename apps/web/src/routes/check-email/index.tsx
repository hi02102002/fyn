import { EnvelopeSimpleIcon, MailboxIcon } from "@phosphor-icons/react";
import {
	createFileRoute,
	useCanGoBack,
	useRouter,
} from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useGoBack } from "@/hooks/use-go-back";
import { buildEmailSearchQuery, inboxUrlFor } from "@/utils/email";
import {
	checkEmailSearchParamsSchema,
	useCheckEmailSearchParams,
} from "./_utils/search-params";

export const Route = createFileRoute("/check-email/")({
	component: RouteComponent,
	validateSearch: checkEmailSearchParamsSchema,
});

function RouteComponent() {
	const [search] = useCheckEmailSearchParams();

	const handleGoBack = useGoBack();

	return (
		<div className="flex min-h-svh items-center justify-center">
			<div className="mx-auto flex max-w-md flex-col items-center px-4">
				<div className="mb-4 flex size-12 items-center justify-center rounded-full bg-accent-foreground text-white">
					<EnvelopeSimpleIcon weight="duotone" className="size-6" />
				</div>
				<div className="mb-6 flex flex-col items-center text-center">
					<h1 className="mb-2 font-semibold text-2xl lg:text-3xl">
						Check Your Email
					</h1>
					<p className="text-muted-foreground text-sm">
						We have sent a magic link to your email address. Please check your
						inbox and click on the link to log in.
					</p>
				</div>
				<div className="w-full space-y-3">
					<Button
						className="w-full"
						onClick={() => {

							console.log(
								inboxUrlFor(
									search.email,
									buildEmailSearchQuery({
										from: "fyn.sup0210@gmail.com",
										subject: "Your Magic Link",
									}),
								),
							);

							window.open(
								inboxUrlFor(
									search.email,
									buildEmailSearchQuery({
										from: "fyn.sup0210@gmail.com",
										subject: "Your Magic Link",
									}),
								),
							);
						}}
					>
						Check email
					</Button>
					<Button className="w-full" variant="outline" onClick={handleGoBack}>
						Back to login
					</Button>
				</div>
			</div>
		</div>
	);
}
