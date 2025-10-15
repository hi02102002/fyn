/**
 * Evaluate expression with given variables
 * @param expr  expression string
 * @param vars  variables
 * @returns   result of the expression
 * @example
 * ```ts
 * const result = evalExpr("vars.a + vars.b", { a: 1, b: 2 }); // 3
 * ```
 */
export function evalExpr(expr: string, vars: Record<string, unknown>) {
	const fn = new Function("vars", `with(vars){ return (${expr}); }`);
	return fn(vars);
}
