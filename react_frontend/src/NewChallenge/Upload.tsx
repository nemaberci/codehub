import CheckboxField from "@components/CheckboxField";
import FormRow from "@components/FormRow";
import axios from "axios";
import { Form as FormikForm, Formik } from "formik";
import { Button, Steps } from "react-daisyui";
import { useNavigate } from "react-router-dom";

export default function Upload() {
	const navigate = useNavigate();

	return (
		<>
			<div className="w-full flex flex-col items-center">
				<h2>Új feladat feltöltése</h2>
				<Steps className="w-1/2">
					<Steps.Step color="primary">Alapadatok</Steps.Step>
					<Steps.Step>Tesztesetek létrehozása</Steps.Step>
					<Steps.Step>Etalon megoldás feltöltése</Steps.Step>
				</Steps>
				<Formik
					enableReinitialize
					initialValues={{
						name: "",
						shortDescription: "",
						description: "",
						enabledLanguages: ["java", "cpp"],
					}}
					onSubmit={async (values, { setSubmitting }) => {
						try {
							setSubmitting(true);
							const response = await axios.post("/api/challenge/upload", values);
							const resultId = response.data.id;
							navigate(`/edit/${resultId}/testcases`);
						} catch (error) {
							console.error(error);
						} finally {
							setSubmitting(false);
						}
					}}
				>
					{({ errors, isSubmitting }) => (
						<FormikForm className="w-full max-w-5xl">
							<table className="table">
								<tbody>
									<FormRow name="name" title="Feladatnév" error={errors.name} />
									<FormRow
										name="shortDescription"
										title="Rövid leírás"
										error={errors.shortDescription}
									/>
									<FormRow
										name="description"
										type="textarea"
										title={
											<>
												Feladat szövege
												<br />
												<a
													href="https://www.markdownguide.org/basic-syntax/"
													target="_blank"
													className="link link-primary text-xs"
												>
													Formázás segédlet
												</a>
											</>
										}
										error={errors.description}
									/>
									<tr>
										<td>Elfogadott programozási nyelvek</td>
										<td>
											<CheckboxField name="enabledLanguages" value="java" title="Java" />
											<CheckboxField name="enabledLanguages" value="cpp" title="C++" />
											{/*<CheckboxField name="enabledLanguages" value="python" title="Python" />*/}
										</td>
									</tr>
								</tbody>
								<tfoot>
									<tr>
										<td className="text-center" colSpan={2}>
											<Button type="submit" disabled={isSubmitting} className="w-1/2">
												Tovább
											</Button>
										</td>
									</tr>
								</tfoot>
							</table>
							<br />
						</FormikForm>
					)}
				</Formik>
			</div>
		</>
	);
}
