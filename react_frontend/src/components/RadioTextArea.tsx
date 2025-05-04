import {useFormikContext} from "formik";
import Radio from "./Radio";
import _ from "lodash";
import {Editor} from "@monaco-editor/react";
import { useEffect, useState } from "react";

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
	const [value, setValue] = useState(defaultValue);
	useEffect(
		() => {
			setValue(_.get(context.values, textAreaName));
		}, [context.values[textAreaName]]
	);
	return (
		<>
			<Radio name={radioName} value={radioValue} title={title} checked={_.get(context.values, radioName) === radioValue} />
			{
				!disabled &&
					<Editor
						height={"35vh"}
						language={radioValue.includes("Generator") ? "python" : "plaintext"}
						theme={"vs-light"}
						value={value}
						onChange={(value) => {
							context.setFieldValue(textAreaName, value);
						}}
						defaultValue={defaultValue}
					/>
			}
		</>
	);
}
