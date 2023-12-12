import { FieldArray, Formik, Form as FormikForm } from "formik";
import { Button } from "react-daisyui";
import { useNavigate, useParams } from "react-router-dom";
import TestCase from "./TestCase";
import axios from "axios";
import { useEffect, useState } from "react";
import _ from "lodash";
import CheckboxField from "@components/CheckboxField";
import CheckboxTextArea from "@components/CheckboxTextArea";

interface TestCase {
	name: string;
	description: string;
	points: number;
	maxMemory: number;
	maxTime: number;
	inputType: "raw" | "script";
	input?: string;
	inputGenerator?: string;
	output?: string;
}

export default function EditTestCases() {
	const [initialValues, setInitialValues] = useState({ name: "", testCases: [] });
	const { id } = useParams();

	async function fetchInitialValues() {
		try {
			const response = await axios.get("/api/challenge/get/" + id);
			setInitialValues(response.data);
		} catch (error) {
			console.error(error);
		}
	}

	useEffect(() => {
		fetchInitialValues();
	}, []);

	const navigate = useNavigate();
	return (
		<>
			<div className="w-full flex flex-col items-center">
				<h2>Tesztesetek szerkesztése</h2>
				<Formik
					enableReinitialize
					initialValues={initialValues}
					onSubmit={async (values: { name: string; testCases: TestCase[] }, { setSubmitting }) => {
						const toBeUploaded: any = _.cloneDeep(values);

						try {
							//values deepcopy és utána módosítani
							let i = 0;
							for (const testCase of toBeUploaded.testCases) {
								if (testCase.inputType === "raw") {
									delete testCase.inputGenerator;
									testCase.input = btoa(testCase.input!);
								} else {
									delete testCase.input;
									testCase.inputGenerator = {
										name: `generator_${i}.py`,
										content: btoa(testCase.inputGenerator!),
									};
								}
								if (toBeUploaded.isOutputScript) {
									delete testCase.output;
								}

								i++;
							}
							if (toBeUploaded.isOutputScript) {
								toBeUploaded.outputVerifier = {
									name: "verifier.py",
									content: btoa(toBeUploaded.outputScript),
								};
								delete toBeUploaded.outputScript;
							}
							await axios.post("/api/challenge/add_test_cases/" + id, toBeUploaded);
							alert("Tesztesetek létrehozva");
						} catch (error) {
							console.error(error);
							alert((error as any).response.data[0]);
						}
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
											<CheckboxField
												name="showTestNameDesc"
												title="Tesztesetek nevének és leírásának mutatása megoldáskor"
											/>
											<CheckboxTextArea
												checkboxName="isOutputScript"
												textAreaName="outputScript"
												title="Kimenet ellenőrzése Python scripttel"
											/>
										</td>
									</tr>
								</tbody>
							</table>
							<h3 className="text-center">{values.name}</h3>
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
							</div>
							<br />
						</FormikForm>
					)}
				</Formik>
			</div>
		</>
	);
}
