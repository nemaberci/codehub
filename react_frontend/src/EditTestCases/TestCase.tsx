import { Divider, Textarea } from "react-daisyui";
import { Field, useFormikContext } from "formik";
import FormRow from "@components/FormRow";
import Radio from "@components/Radio";
import CheckboxField from "@components/CheckboxField";

interface TestCaseType {
	name: string;
	description: string;
	score: number;
	maxRuntime: number;
	maxMemory: number;
	inputType: "raw" | "script";
	inputText?: string;
	outputType: "raw" | "script";
	outputText?: string;
}

function OutputFields({ objectPath }: { objectPath: string }) {
	const context = useFormikContext();
	console.log(context.values);
	const disabled = context.values.isOutputScript;
	console.log("OutputField", disabled);
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
				name={`${objectPath}.outputText`}
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
					<FormRow name={`testCases.${index}.score`} title="Pontszám" type="number" />
					<FormRow name={`testCases.${index}.maxRuntime`} title="Max. futásidő (ms)" type="number" />
					<FormRow name={`testCases.${index}.maxMemory`} title="Max. memória (MB)" type="number" />
					<tr>
						<td>
							<h4>Bemenet</h4>
						</td>
						<td>
							<Radio name={`testCases.${index}.inputType`} value="raw" title="Nyers adat szövegfájl" />
							<Radio name={`testCases.${index}.inputType`} value="script" title="Generáló script" />
						</td>
					</tr>
					<tr>
						<td>
							<h4>Kimenet</h4>
						</td>
						<td>
							<OutputFields objectPath={`testCases.${index}`} />
							{/*<Field name={`testCases.${index}.outputRaw`} type="checkbox" title="Nyers adat szövegfájl">
								{({ field }) => {
									const enabled = field.value?.length > 0 && field.value[0] === "on";
									console.log(field);
									return (
										<>
											<label className="label cursor-pointer justify-start gap-4">
												<input
													type="checkbox"
													className="checkbox"
													name={field.name}
													checked={enabled}
													onChange={field.onChange}
													onBlur={field.onBlur}
												/>
												<span className="label-text">Kimenet generálása scripttel</span>
											</label>
											<Field
												as={Textarea}
												name={`testCases.${index}.outputText`}
												bordered
												className="w-full h-64 font-mono"
												disabled={!enabled}
											/>
										</>
									);
								}}
							</Field>*/}
						</td>
					</tr>
				</tbody>
			</table>
		</>
	);
}
