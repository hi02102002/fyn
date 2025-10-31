/** biome-ignore-all lint/suspicious/noExplicitAny: <hehe> */

export const getFieldIsInValid = (field: any) => {
	return field.state.meta.isTouched && !field.state.meta.isValid;
};

export const getDefaultPropsForField = (field: any) => {
	const isInValid = getFieldIsInValid(field);
	return {
		id: field.name,
		name: field.name,
		value: field.state.value,
		onBlur: field.handleBlur,
		onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
			field.handleChange(e.target.value),
		"aria-invalid": isInValid,
	};
};
