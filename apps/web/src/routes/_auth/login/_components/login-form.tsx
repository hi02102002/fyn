"use client";

import { LoginSchema } from "@fyn/schemas/login";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { getDefaultPropsForField, getFieldIsInValid } from "@/utils/form";
import { useAuthLoading } from "../_store/use-auth-loading";

export function LoginForm() {
	const { redirect } = useSearch({
		from: "/_auth/login/",
	});
	const navigate = useNavigate();
	const { loading, setLoading } = useAuthLoading();

	const { mutateAsync: sendMagicLink } = useMutation({
		mutationFn: async (data: { email: string }) => {
			return authClient.signIn.magicLink({
				email: data.email,
				callbackURL: redirect || `${window.location.origin}/app`,
				errorCallbackURL: `${window.location.origin}/login`,
			});
		},
		onSuccess: (_, { email }) => {
			toast.success("Magic link sent! Please check your email.");

			navigate({
				to: "/check-email",
				search: {
					email,
				},
			});
		},
		onError: () => {
			toast.error("Failed to send magic link. Please try again.");
		},
	});

	const form = useForm({
		defaultValues: {
			email: "",
		},
		validators: {
			onBlur: LoginSchema,
		},
		async onSubmit({ value }) {
			await sendMagicLink({ email: value.email });
		},
	});

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		await form.handleSubmit();
		setLoading(false);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-3">
			<FieldGroup>
				<form.Field name="email">
					{(field) => {
						const isInvalid = getFieldIsInValid(field);
						return (
							<Field data-invalid={isInvalid}>
								<FieldLabel>Email</FieldLabel>
								<Input
									{...getDefaultPropsForField(field)}
									placeholder="fyn@example.com"
									autoComplete="off"
									disabled={loading}
								/>
								{isInvalid && <FieldError errors={field.state.meta.errors} />}
							</Field>
						);
					}}
				</form.Field>
			</FieldGroup>
			<Button
				type="submit"
				className="w-full"
				disabled={form.state.isSubmitting || loading}
				isLoading={form.state.isSubmitting}
			>
				Login
			</Button>
		</form>
	);
}
