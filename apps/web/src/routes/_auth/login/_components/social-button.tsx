"use client";

import { GithubLogo, GoogleLogo } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const MAP_SOCIAL = {
	google: {
		icon: GoogleLogo,
		text: "Google",
		handle: async () => {
			return authClient.signIn.social({
				provider: "google",
				callbackURL: `${window.location.origin}/app`,
				errorCallbackURL: `${window.location.origin}/login`,
			});
		},
	},
	github: {
		icon: GithubLogo,
		text: "GitHub",
		handle: async () => {
			return authClient.signIn.social({
				provider: "github",
				callbackURL: `${window.location.origin}/app`,
				errorCallbackURL: `${window.location.origin}/login`,
			});
		},
	},
} as const;

type TProps = {
	provider: keyof typeof MAP_SOCIAL;
};

export function SocialBtn({ provider }: TProps) {
	const { text, handle, icon: Icon } = MAP_SOCIAL[provider];

	const { mutateAsync, isPending } = useMutation({
		mutationFn: handle,
	});

	const handleLogin = async () => {
		try {
			await mutateAsync();
		} finally {
		}
	};

	return (
		<Button
			variant="outline"
			className="w-full gap-1"
			onClick={handleLogin}
			size="sm"
		>
			<span>Continue with {text}</span>
		</Button>
	);
}
