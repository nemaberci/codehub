import { FieldArray, Formik, Form as FormikForm } from "formik";
import { Button } from "react-daisyui";
import { useNavigate } from "react-router-dom";
import TestCase from "./TestCase";
import CheckboxField from "@components/CheckboxField";
import axios from "axios";

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
					onSubmit={async (values, { setSubmitting }) => {
						const response = await axios.post("http://localhost:3002/challenge/add_test_cases/113/", {
									"outputVerifier": {
									  "content": "CgpkZWYgdmVyaWZ5KGlucHV0X2ZpbGVfY29udGVudHMsIG91dHB1dF9maWxlX2NvbnRlbnRzKToKICAgIHByaW50KGludChvdXRwdXRfZmlsZV9jb250ZW50c1swXSksIGludChpbnB1dF9maWxlX2NvbnRlbnRzWzBdKSArIGludChpbnB1dF9maWxlX2NvbnRlbnRzWzFdKSkKICAgIHByaW50KGludChvdXRwdXRfZmlsZV9jb250ZW50c1sxXSksIGludChpbnB1dF9maWxlX2NvbnRlbnRzWzBdKSAqIGludChpbnB1dF9maWxlX2NvbnRlbnRzWzFdKSkKICAgIHJldHVybiBpbnQob3V0cHV0X2ZpbGVfY29udGVudHNbMF0pID09IGludChpbnB1dF9maWxlX2NvbnRlbnRzWzBdKSArIGludChpbnB1dF9maWxlX2NvbnRlbnRzWzFdKSBhbmQgaW50KG91dHB1dF9maWxlX2NvbnRlbnRzWzFdKSA9PSBpbnQoaW5wdXRfZmlsZV9jb250ZW50c1swXSkgKiBpbnQoaW5wdXRfZmlsZV9jb250ZW50c1sxXSkK",
									  "name": "verifier.py"
									},
									"testCases": values.testCases.map((testcase)=>{
										return {
										"input": "NTYKNDUK",
										"points": testcase.score,
										"description": testcase.description,
										"maxMemory": testcase.maxMemory,
										"maxTime": testcase.maxRuntime,
										"name": testcase.name,
									}})
									},{
									headers:{
										Authorization:`Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDIwNTM0MzYsImV4cCI6MTczMzYxMTAzNn0.WqM_eJflqKMTlkP9L3SNFYQzMK_UQAwqR30Utmwh16RjOlg1roYWAegMC619bEfp4Oh9QSDlVZtLFPRS7-O0esYeyBiLaioZ6pX25kYMXTfEdtKfRVmdlKFNIfNFJKn5P9srPNqOs-ObI8gtf2vZp8b1Ef1NanFry6zPhTtoTO3U7UkNoPAu9t7oTzji8RcprYDRg8t7NeNakK8oyHUZHqtzToONaM1de69uYGY-P8IFU5W1MK8vGB6GNYZIuxlYb0-SiiTXtwGXckHEiAup5bo0h3XhD56R2LHSsH8lDUcrgCZb5bTJehvzOp9WIC5-Y73Yoj_tjHM3bv2eZOYMMlQDxPpQxllGppRobLwnGQ9JlvotmSGC231rVmIffGIx3tK2rmLrESn1oUNy4nomhw8QvcaYC-PzBJFzL9RyveYHkJel6X3czEm-RIOchDlxbMQV5Wwkeu0BOMGo9KFVFd_lL73XW47ogtxhtbwX13pKQUv-jxT9xVjHWa0yUtxN`
									}
								  }
							);
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
