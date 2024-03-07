import { Field } from "formik";

export default function Radio({
	name,
	title,
	value,
	checked,
	disabled = false,
}: {
	name: string;
	title: string;
	value: string;
	checked?: boolean;
	disabled?: boolean;
}) {
	return (
		<label className="label cursor-pointer justify-start gap-4">
			<Field
				type="radio"
				name={name}
				className="radio"
				value={value}
				checked={checked}
				disabled={disabled}
			/>
			<span className="label-text">{title}</span>
		</label>
	);
}
