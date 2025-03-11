import {useFormikContext} from "formik";
import Radio from "./Radio";
import _ from "lodash";
import {Editor} from "@monaco-editor/react";

export default function RadioTextArea({
	radioName,
	radioValue,
	textAreaName,
	title,
	defaultValue,
}: {
	radioName: string;
	radioValue: string;
	textAreaName: string;
	title: string;
	defaultValue?: string;
}) {
	const context: any = useFormikContext();
	const disabled = _.get(context.values, radioName) !== radioValue;
	return (
		<>
			<Radio name={radioName} value={radioValue} title={title} checked={_.get(context.values, radioName) === radioValue} />
			{
				!disabled &&
					<Editor
						height={"35vh"}
						language={radioValue === "script" ? "python" : "plaintext" }
						theme={"vs-dark"}
						value={
							_.get(context.values, textAreaName)
						}
						onChange={(value) => {
							context.setFieldValue(textAreaName, value);
						}}
						defaultValue={defaultValue}
					/>
			}
		</>
	);
}
