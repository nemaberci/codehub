import {useFormikContext} from "formik";
import Radio from "./Radio";
import _ from "lodash";
import {Editor} from "@monaco-editor/react";
import {useEffect, useState} from "react";

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
	const [disabled, setDisabled] = useState(false);
	useEffect(
		() => {
			setDisabled(_.get(context.values, radioName) !== radioValue);
		},
		[context.values]
	);
	return (
		<>
			<Radio name={radioName} value={radioValue} title={title} />
			{
				!disabled &&
					<Editor
						height={"35vh"}
						language={radioValue === "script" ? "python" : "plaintext" }
						theme={"vs-dark"}
						value={
							context.values[textAreaName]
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
