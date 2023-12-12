import { Field, useFormikContext } from "formik";
import { Textarea } from "react-daisyui";
import CheckboxField from "./CheckboxField";

export default function CheckboxTextArea({
	checkboxName,
	textAreaName,
	title,
}: {
	checkboxName: string;
	textAreaName: string;
	title: string;
}) {
	const context: any = useFormikContext();
	const disabled = !context.values[checkboxName];
	return (
		<>
			<CheckboxField name={checkboxName} title={title} />
			<Field
				as={Textarea}
				bordered
				disabled={disabled}
				className={"w-full h-64 font-mono " + (disabled ? "hidden" : "")}
				name={textAreaName}
			/>
		</>
	);
}
