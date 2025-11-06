import {
	createStandardSchemaV1,
	parseAsString,
	useQueryStates,
} from "nuqs";

const checkEmailSearchParams = {
	email: parseAsString.withDefault(""),
};

export const checkEmailSearchParamsSchema = createStandardSchemaV1(
	checkEmailSearchParams,
	{
		partialOutput: true,
	},
);

export const useCheckEmailSearchParams = () => {
  return useQueryStates(checkEmailSearchParams);
}