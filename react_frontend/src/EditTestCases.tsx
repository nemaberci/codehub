import { Divide } from "@phosphor-icons/react";
import { ErrorMessage, Field, Formik, Form as FormikForm } from "formik";
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
}

function Checkbox({ name, title }: { name: string; title: string }) {
	return (
		<label className="label cursor-pointer justify-start gap-4">
			<input type="checkbox" className="checkbox" name={name} />
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

function TestCase() {
	return (
		<>
			<Divider />
			<table className="table">
				<tbody>
					<FormRow name="name" title="Név (opcionális)" />
					<FormRow name="name" title="Leírás" />
					<FormRow name="name" title="Pontszám" type="number" />
					<tr>
						<td>
							<h3>Bemenet</h3>
						</td>
						<td>
							<Radio name="input" value="text" title="Nyers adat szövegfájl" />
							<Radio name="input" value="script" title="Generáló script" />
						</td>
					</tr>
					<tr>
						<td>
							<h3>Kimenet</h3>
						</td>
						<td>
							<Field as={Checkbox} type="checkbox" title="Nyers adat szövegfájl" />
							<Textarea bordered className="w-full h-64 font-mono" />
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
					initialValues={{ email: "", password: "" }}
					validate={(values) => {
						const errors: MyFormValues = {};

						if (!values.email) {
							errors.email = "Required";
						} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
							errors.email = "Invalid email address";
						}

						return errors;
					}}
					onSubmit={(values, { setSubmitting }) => {
						setTimeout(() => {
							alert(JSON.stringify(values, null, 2));

							setSubmitting(false);
						}, 400);
					}}
				>
					{({ errors, isSubmitting }) => (
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
							<TestCase />
							<TestCase />
							<TestCase />
							<TestCase />
							<TestCase />
							<TestCase />
							<div className="flex justify-evenly">
								<Button disabled={isSubmitting} className="w-1/4" onClick={() => navigate("/editor/0")}>
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
