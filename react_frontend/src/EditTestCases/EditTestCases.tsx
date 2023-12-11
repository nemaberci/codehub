import { FieldArray, Formik, Form as FormikForm } from "formik";
import { Button } from "react-daisyui";
import { useNavigate, useParams } from "react-router-dom";
import TestCase from "./TestCase";
import axios from "axios";
import { useEffect, useState } from "react";

interface TestCase {
	name: string;
	description: string;
	points: number;
	maxMemory: number;
	maxTime: number;
	inputType: "raw" | "script";
	input: string;
	inputGenerator: string;
}

export default function EditTestCases() {
	const [initialValues, setInitialValues] = useState({ testCases: [] });
	const { id } = useParams();

	async function fetchInitialValues() {
		try {
			const response = await axios.get("/api/challenge/get/" + id);
			console.log(response.data);
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
					onSubmit={async (values: { testCases: TestCase[] }, { setSubmitting }) => {
						for (const testCase of values.testCases) {
							if (testCase.inputType === "raw") {
								testCase.inputGenerator = "";
							} else {
								testCase.input = "";
							}
						}
						await axios.post("/api/challenge/add_test_cases/" + id, {
							testCases: values.testCases,
						});
						setTimeout(() => {
							alert(JSON.stringify(values, null, 2));

							setSubmitting(false);
						}, 400);
					}}
				>
					{({ values, isSubmitting }) => (
						<FormikForm className="w-full max-w-5xl">
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
								<Button
									disabled={isSubmitting}
									className="w-1/2"
									onClick={() => navigate("/editor/" + id)}
								>
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
