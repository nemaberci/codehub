import {useFormikContext} from "formik";
import CheckboxField from "./CheckboxField";
import {Editor} from "@monaco-editor/react";
import {useEffect} from "react";

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
	const currentValue: string = context.values[textAreaName];
	useEffect(
		() => {
			if (!disabled && 
				(currentValue === "" 
					|| currentValue === undefined 
					|| currentValue === null)
			) {
				context.setFieldValue(textAreaName, `# Implement the verify function
# The function should return True if the output is correct, False otherwise
# The function receives two parameters:
# - input_file_contents: the contents of the input file
# - output_file_contents: the contents of the output file
def verify(input_file_contents, output_file_contents):
    return True`);
			}
		},
		// eslint-disable-next-line
		[disabled]
	)
	return (
		<>
			<CheckboxField name={checkboxName} title={title} />
			{
				!disabled &&
				<Editor
					height={"35vh"}
					language="python"
					theme={"vs-light"}
					value={context.values[textAreaName]}
					onChange={(value) => {
						context.setFieldValue(textAreaName, value);
					}}
				/>
			}
		</>
	);
}
