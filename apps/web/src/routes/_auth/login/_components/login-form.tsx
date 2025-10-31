"use client";

import { LoginSchema } from "@fyn/schemas/login";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
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

export function LoginForm() {
	const { mutateAsync: sendMagicLink } = useMutation({
		mutationFn: async (data: { email: string }) => {
			return authClient.signIn.magicLink({
				email: data.email,
				callbackURL: `${window.location.origin}/app`,
				errorCallbackURL: `${window.location.origin}/login`,
			});
		},
	});

	const form = useForm({
		defaultValues: {
			email: "",
		},
		validators: {
			onBlur: LoginSchema
		},
		async onSubmit({ value }) {
			await sendMagicLink({ email: value.email });
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		form.handleSubmit();
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
				disabled={form.state.isSubmitting}
			>
				Login
			</Button>
		</form>
	);
}
