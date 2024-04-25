import { ErrorMessage, Field } from "formik";
import { Indicator, Input, Textarea } from "react-daisyui";

interface FormFieldProps {
	name: string;
	type?: string;
	title: string | React.ReactElement;
	error?: string | boolean;
	disabled?: boolean;
}

export default function FormRow({ name, type, title, error, disabled }: FormFieldProps) {
	let input;
	if (type === "textarea") {
		input = <Field as={Textarea} bordered className="w-full h-64 font-mono" name={name} disabled={disabled} />;
	} else {
		input = (
			<Field as={Input} type={type} name={name} className="w-full" color={error ? "error" : "neutral"} disabled={disabled} />
		);
	}

	return (
		<>
			<tr>
				<td className="w-1/4">{title}</td>
				<td>
					{error ? (
						<Indicator>
							<Indicator.Item className="badge text-red-500">
								<ErrorMessage name={name} />
							</Indicator.Item>
							{input}
						</Indicator>
					) : (
						input
					)}
				</td>
			</tr>
		</>
	);
}
