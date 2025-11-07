import { useNavigate, useRouteContext } from "@tanstack/react-router";

export const useNavigateGetStarted = () => {
	const { session } = useRouteContext({
		strict: false,
	});

	const navigate = useNavigate();

	const handleGetStarted = () => {
		if (session?.user.id) {
			return navigate({
				to: "/app",
			});
		}

		return navigate({
			to: "/login",
		});
	};

	return {
		handleGetStarted,
	};
};
