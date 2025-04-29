import FormRow from "@components/FormRow";
import axios from "axios";
import { Form as FormikForm, Formik } from "formik";
import { Button } from "react-daisyui";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { isTokenValid, hasRole } from "../utils/auth";
import * as Yup from "yup";

export default function Register() {
	const navigate = useNavigate();
	const [isAdmin, setIsAdmin] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!isTokenValid()) {
			navigate("/");
			return;
		}

		// Check if the user has the admin role
		setIsLoading(false);
		if (hasRole("admin")) {
			setIsAdmin(true);
		} else {
			navigate("/challenges");
		}
	}, [navigate]);

	if (isLoading) {
		return <div className="flex justify-center items-center h-full">Loading...</div>;
	}

	if (!isAdmin) {
		return null;
	}

	return (
		<div className="flex justify-center items-center h-full">
			<div className="card w-full max-w-md bg-base-100 shadow-xl">
				<div className="card-body">
					<h2 className="card-title text-2xl font-bold text-center mb-6">Felhasználó regisztrálása</h2>
					<Formik
						initialValues={{ username: "", password: "", confirmPassword: "" }}
						validationSchema={Yup.object({
							username: Yup.string()
								.required("Felhasználónév kötelező")
								.min(3, "A felhasználónévnek legalább 3 karakter hosszúnak kell lennie"),
							password: Yup.string()
								.required("Jelszó kötelező")
								.min(6, "A jelszónak legalább 6 karakter hosszúnak kell lennie"),
							confirmPassword: Yup.string()
								.required("Jelszó megerősítése kötelező")
								.oneOf([Yup.ref("password")], "A jelszavak nem egyeznek")
						})}
						onSubmit={async (values, { setSubmitting, setErrors }) => {
							try {
								await axios.post(`/api/user/register/`, {
									username: values.username,
									password: values.password,
								});
								navigate("/challenges");
							} catch (error: any) {
								console.error(error);
								if (error.response?.data) {
									if (Array.isArray(error.response.data)) {
										alert(error.response.data[0]);
									} else {
										setErrors({ username: error.response.data });
									}
								}
							} finally {
								setSubmitting(false);
							}
						}}
					>
						{({ errors, isSubmitting }) => (
							<FormikForm className="space-y-4 w-full">
								<FormRow name="username" title="Felhasználónév" error={errors.username} />
								<FormRow name="password" type="password" title="Jelszó" error={errors.password} />
								<FormRow name="confirmPassword" type="password" title="Jelszó megerősítése" error={errors.confirmPassword} />
								<div className="form-control mt-6">
									<Button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
										Regisztráció
									</Button>
								</div>
							</FormikForm>
						)}
					</Formik>
				</div>
			</div>
		</div>
	);
} 