import { Divider, Textarea } from "react-daisyui";
import { Field, useFormikContext } from "formik";
import FormRow from "@components/FormRow";
import CheckboxField from "@components/CheckboxField";
import RadioTextArea from "@components/RadioTextArea";

function OutputFields({ objectPath }: { objectPath: string }) {
	const context: any = useFormikContext();
	const disabled = context.values.isOutputScript;
	return (
		<>
			<CheckboxField
				name={`${objectPath}.outputRaw`}
				title="Nyers adat szövegfájl"
				disabled={disabled}
			/>
			<Field
				as={Textarea}
				bordered
				disabled={disabled}
				className="w-full h-64 font-mono"
				name={`${objectPath}.output`}
			/>
		</>
	);
}

export default function TestCase({ index }: { index: number }) {
	return (
		<>
			<Divider />
			<table className="table">
				<tbody>
					<FormRow name={`testCases.${index}.name`} title="Név (opcionális)" />
					<FormRow name={`testCases.${index}.description`} title="Leírás (opcionális)" />
					<FormRow name={`testCases.${index}.points`} title="Pontszám" type="number" />
					<FormRow name={`testCases.${index}.maxTime`} title="Max. futásidő (ms)" type="number" />
					<FormRow name={`testCases.${index}.maxMemory`} title="Max. memória (MB)" type="number" />
					<tr>
						<td>
							<h4>Bemenet</h4>
						</td>
						<td>
							<RadioTextArea
								radioName={`testCases.${index}.inputType`}
								radioValue="raw"
								title="Nyers adat szövegfájl"
								textAreaName={`testCases.${index}.input`}
							/>
							<RadioTextArea
								radioName={`testCases.${index}.inputType`}
								radioValue="script"
								title="Generáló script"
								textAreaName={`testCases.${index}.inputGenerator`}
							/>
						</td>
					</tr>
					<tr>
						<td>
							<h4>Kimenet</h4>
						</td>
						<td>
							<OutputFields objectPath={`testCases.${index}`} />
						</td>
					</tr>
				</tbody>
			</table>
		</>
	);
}
