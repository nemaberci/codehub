import { Field } from "formik";

export default function CheckboxField({
	title,
	name,
	value,
	disabled,
}: {
	title: string;
	name: string;
	value?: string;
	disabled?: boolean;
}) {
	console.log("CheckboxField", disabled);
	return (
		<label className="label cursor-pointer justify-start gap-4">
			<Field type="checkbox" className="checkbox" name={name} value={value} disabled={disabled} />
			{/*<input type="checkbox" className="checkbox" {...formikProps} />*/}
			<span className={"label-text " + (disabled ? "text-zinc-600 cursor-not-allowed" : "")}>
				{title}
			</span>
		</label>
	);
}
