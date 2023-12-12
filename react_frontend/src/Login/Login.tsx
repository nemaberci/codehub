import FormRow from "@components/FormRow";
import axios from "axios";
import { Form as FormikForm, Formik } from "formik";
import { Button } from "react-daisyui";
import { useNavigate } from "react-router-dom";

export default function Login() {
	const navigate = useNavigate();
	return (
		<>
			<div className="w-full flex flex-col items-center">
				<h2>Bejelentkezés</h2>
				<Formik
					initialValues={{ username: "", password: "" }}
					//validate={() => {}}
					onSubmit={async (values, { setSubmitting }) => {
						try {
							const response = await axios.post(`/api/user/login/`, {
								username: values.username,
								password: values.password,
							});
							localStorage.setItem("token", response.data);
							navigate("/challenges");
						} catch (error) {
							console.error(error);
							alert((error as any).response.data[0]);
						} finally {
							setSubmitting(false);
						}
					}}
				>
					{({ errors, isSubmitting }) => (
						<FormikForm className="w-full max-w-5xl">
							<table className="table">
								<tbody>
									<FormRow name="username" title="Felhasználónév" error={errors.username} />
									<FormRow name="password" type="password" title="Jelszó" error={errors.password} />
								</tbody>
								<tfoot>
									<tr>
										<td className="text-center" colSpan={2}>
											<Button type="submit" disabled={isSubmitting} className="w-1/2">
												Bejelentkezés
											</Button>
										</td>
									</tr>
								</tfoot>
							</table>
						</FormikForm>
					)}
				</Formik>
			</div>
		</>
	);
}
