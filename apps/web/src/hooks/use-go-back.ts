import {
	type ToOptions,
	useCanGoBack,
	useNavigate,
	useRouter,
} from "@tanstack/react-router";
import { useCallback } from "react";

export const useGoBack = (opts?: { fallback?: ToOptions["to"] }) => {
	const router = useRouter();
	const canGoBack = useCanGoBack();
	const navigate = useNavigate();

	return useCallback(() => {
		if (canGoBack) {
			return router.history.back();
		}

		return navigate({
			to: opts?.fallback ?? "/",
			replace: true,
		});
	}, [canGoBack, router.history.back, navigate, opts]);
};
