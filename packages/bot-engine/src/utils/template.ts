export function template(str: string, vars: Record<string, unknown>): string {
	return str.replace(/{{\s*([\w$.]+)\s*}}/g, (_, key) => {
		interface Vars {
			[key: string]: unknown;
		}

		const value: unknown = key
			.split(".")
			.reduce((acc: unknown, k: string) => (acc as Vars)?.[k], vars);

		return value == null ? "" : String(value);
	});
}
