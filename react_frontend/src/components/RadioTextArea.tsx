import { Field, useFormikContext } from "formik";
import Radio from "./Radio";
import { Textarea } from "react-daisyui";
import _ from "lodash";

export default function RadioTextArea({
	radioName,
	radioValue,
	textAreaName,
	title,
}: {
	radioName: string;
	radioValue: string;
	textAreaName: string;
	title: string;
}) {
	const context: any = useFormikContext();
	const disabled = _.get(context.values, radioName) !== radioValue;
	return (
		<>
			<Radio name={radioName} value={radioValue} title={title} />
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
