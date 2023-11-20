import { ErrorMessage, Field, FieldArray, Formik, Form as FormikForm } from "formik";
import { Button, Divider, Indicator, Input, Textarea } from "react-daisyui";
import { useNavigate } from "react-router-dom";

interface FormFieldProps {
	name: string;
	type?: string;
	title: string | React.ReactElement;
	error?: string | boolean;
}

interface MyFormValues {
	email?: string;
	password?: string;
	testCases: any[];
}

function Checkbox({ name, title, ...formikProps }: { name: string; title: string; checked: boolean }) {
	return (
		<label className="label cursor-pointer justify-start gap-4">
			<input type="checkbox" className="checkbox" name={name} {...formikProps} />
			<span className="label-text">{title}</span>
		</label>
	);
}

function Radio({
	name,
	title,
	value,
	checked,
	disabled = false,
}: {
	name: string;
	title: string;
	value: string;
	checked?: boolean;
	disabled?: boolean;
}) {
	return (
		<label className="label cursor-pointer justify-start gap-4">
			<input
				type="radio"
				name={name}
				className="radio"
				value={value}
				checked={checked}
				disabled={disabled}
			/>
			<span className="label-text">{title}</span>
		</label>
	);
}

function FormRow({ name, type, title, error }: FormFieldProps) {
	let input;
	if (type === "textarea") {
		input = <Textarea bordered className="w-full h-64 font-mono" />;
	} else {
		input = (
			<Field as={Input} type={type} name={name} className="w-full" color={error ? "error" : "neutral"} />
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

function TestCase({ index }: { index: number }) {
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
							<h3>Bemenet</h3>
						</td>
						<td>
							<Radio name={`testCases.${index}.inputType`} value="raw" title="Nyers adat szövegfájl" />
							<Radio name={`testCases.${index}.inputType`} value="script" title="Generáló script" />
						</td>
					</tr>
					<tr>
						<td>
							<h3>Kimenet</h3>
						</td>
						<td>
							<Field
								name={`testCases.${index}.outputType`}
								type="checkbox"
								title="Nyers adat szövegfájl"
							>
								{({ field }) => {
									console.log(field.value);
									return (
										<>
											{/*<Checkbox name={name} checked={value} onChange={onChange} onBlur={onBlur} />*/}
											<label className="label cursor-pointer justify-start gap-4">
												<input
													type="checkbox"
													className="checkbox"
													name={field.name}
													checked={field.value?.length > 0}
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
												disabled={field.value?.length > 0}
											/>
										</>
									);
								}}
							</Field>
						</td>
					</tr>
				</tbody>
			</table>
		</>
	);
}

export default function EditTestCases() {
	const navigate = useNavigate();
	return (
		<>
			<div className="w-full flex flex-col items-center">
				<h2>Tesztesetek szerkesztése</h2>
				<Formik
					initialValues={{ email: "", password: "", testCases: [] }}
					/*validate={(values) => {
						const errors: MyFormValues = {};

						if (!values.email) {
							errors.email = "Required";
						} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
							errors.email = "Invalid email address";
						}

						return errors;
					}}*/
					onSubmit={(values, { setSubmitting }) => {
						setTimeout(() => {
							alert(JSON.stringify(values, null, 2));

							setSubmitting(false);
						}, 400);
					}}
				>
					{({ values, isSubmitting }) => (
						<FormikForm className="w-full max-w-5xl">
							<table className="table">
								<tbody>
									<tr>
										<td>Tulajdonságok</td>
										<td>
											<Field
												as={Checkbox}
												type="checkbox"
												name="outputScript"
												title="Kimenet ellenőrzése scripttel"
											/>
											<Field
												as={Checkbox}
												type="checkbox"
												name="showTestNameDesc"
												title="Tesztesetek nevének és leírásának mutatása a megoldóknak"
											/>
										</td>
									</tr>
								</tbody>
							</table>
							<h3>Tesztesetek</h3>
							<FieldArray
								name="testCases"
								render={(arrayHelpers) => (
									<>
										{values.testCases.map((testCase, index) => (
											<>
												<TestCase index={index} />
												<Button
													onClick={() => {
														arrayHelpers.remove(index);
													}}
													color="error"
												>
													Törlés
												</Button>
											</>
										))}
										<div className="text-center my-4">
											<Button
												className="w-1/4 btn-outline"
												onClick={() => {
													arrayHelpers.push({});
												}}
												type="button"
											>
												Új teszteset
											</Button>
										</div>
									</>
								)}
							/>

							<div className="flex justify-evenly">
								<Button disabled={isSubmitting} className="w-1/4" type="submit">
									Mentés
								</Button>
								<Button disabled={isSubmitting} className="w-1/2" onClick={() => navigate("/editor/0")}>
									Mentés és etalon megoldás feltöltése
								</Button>
							</div>
							<br />
						</FormikForm>
					)}
				</Formik>
			</div>
		</>
	);
}
