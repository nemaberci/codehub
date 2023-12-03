import { FieldArray, Formik, Form as FormikForm } from "formik";
import { Button } from "react-daisyui";
import { useNavigate } from "react-router-dom";
import TestCase from "./TestCase";
import CheckboxField from "@components/CheckboxField";

/*function Checkbox({ name, title, ...formikProps }: { name: string; title: string; checked: boolean }) {
	return (
		<label className="label cursor-pointer justify-start gap-4">
			<input type="checkbox" className="checkbox" name={name} {...formikProps} />
			<span className="label-text">{title}</span>
		</label>
	);
}*/

export default function EditTestCases() {
	const navigate = useNavigate();
	return (
		<>
			<div className="w-full flex flex-col items-center">
				<h2>Tesztesetek szerkesztése</h2>
				<Formik
					initialValues={{ isOutputScript: false, showTestNameDesc: false, testCases: [] }}
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
							<h3>Globális beállítások</h3>
							<table className="table">
								<tbody>
									<tr>
										<td>Tulajdonságok</td>
										<td>
											<CheckboxField name="isOutputScript" title="Kimenet ellenőrzése scripttel" />
											<CheckboxField
												name="showTestNameDesc"
												title="Tesztesetek nevének és leírásának mutatása megoldáskor"
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
										{values.testCases.map((_, index) => (
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
