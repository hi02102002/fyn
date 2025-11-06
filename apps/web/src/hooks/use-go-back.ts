import { useCanGoBack, useNavigate, useRouter } from "@tanstack/react-router";
import { useCallback } from "react";

export const useGoBack = () => {
	const router = useRouter();
	const canGoBack = useCanGoBack();
	const navigate = useNavigate();

	return useCallback(() => {
		if (canGoBack) {
			return router.history.back();
		}

		return navigate({
			to: "/",
			replace: true,
		});
	}, [canGoBack, router.history.back, navigate]);
};
