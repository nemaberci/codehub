import axios from "axios";
import { ErrorMessage, Field, Form as FormikForm, Formik } from "formik";
import { Button, Indicator, Input, Steps, Textarea } from "react-daisyui";
import { useNavigate } from "react-router-dom";

/*interface MyFormValues {
	name?: string;
	short_desc?: string;
	long_desc?: string;
}*/

interface FormFieldProps {
	name: string;
	type?: string;
	title: string | React.ReactElement;
	error?: string | boolean;
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

function Checkbox({
	name,
	title,
	value,
	onChange,
	onBlur,
}: {
	name: string;
	title: string;
	value: string;
	onChange: any;
	onBlur: any;
}) {
	return (
		<label className="label cursor-pointer justify-start gap-4">
			<Field
				type="checkbox"
				className="checkbox"
				name={name}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
			/>
			<span className="label-text">{title}</span>
		</label>
	);
}

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
					initialValues={{ name: "", short_desc: "", long_desc: "", enabled: [] }}
					//validate={() => {}}
					onSubmit={(values, { setSubmitting }) => {
						axios.post("http://localhost:3000/challenge/upload", {
								name: values.name,
								shortDescription: values.short_desc,
								description: values.long_desc
						})
						/*setTimeout(() => {
							alert(JSON.stringify(values, null, 2));

							setSubmitting(false);
							navigate("/edit/0/testcases");
						}, 400);*/
					}}
				>
					{({ errors, isSubmitting }) => (
						<FormikForm className="w-full max-w-5xl">
							<table className="table">
								<tbody>
									<FormRow name="name" title="Feladatnév" error={errors.name} />
									<FormRow name="short_desc" title="Rövid leírás" error={errors.short_desc} />
									<FormRow
										name="long_desc"
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
										error={errors.long_desc}
									/>
									<tr>
										<td>Elfogadott programozási nyelvek</td>
										<td>
											<Field as={Checkbox} type="checkbox" name="enabled" value="java" title="Java" />
											<Field
												as={Checkbox}
												type="checkbox"
												name="enabled"
												value="python"
												title="Python"
											/>
											<Field as={Checkbox} type="checkbox" name="enabled" value="c++" title="C++" />
										</td>
									</tr>
								</tbody>
								<tfoot>
									<tr>
										<td className="text-center" colSpan={2}>
											<Button
												type="submit"
												disabled={isSubmitting}
												className="w-1/2"
												//onClick={() => navigate("/edit/0/testcases")}
											>
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
				{/*prettier-ignore*/}
				Feladat név: Név a feladatnak
				<br />
				Rövid leírás (összefoglalás): Rövid ismertető a feladatról
				<br />
				Leírás: Hosszabb, pontosabb feladatleírás
				<br />
				Létrehozó felhasználó: A felhasználó, aki a feladatot létrehozta
				<br />
				Etalon megoldás (referencia a megoldásra): A feladat feltöltője által adott megoldás.
				<br />
				Elfogadott megoldások nyelvei: Lista azokból a nyelvekből, amikkel megoldást lehet fetölteni.
				(Olyan nyelvek, amikre van bekonfigurált fordító és futtatókörnyezet)
				<br />
				Checkmarkot kap, ha van etalon megoldása, ami teljesíti a limiteket
				<br />
				Tesztesetek: A tesztesetek, amikre a megoldások ellenőrizve vannak. Legalább 1-et meg kell adni.
				<br />
				Feltöltés időpontja: UTC timestamp, amikor a szerver megkapta a feltöltött feladatot.
				<br />
				Tesztesetenként:
				<br />
				A következők közül valamelyik:
				<br />
				Bemeneti fájl: Sorról sorra a bemenet
				<br />
				Bemeneti fájlt generáló szkript forráskódja: Generálja a bemeneti fájlt (0 paraméterű függvény)
				<br />
				Max futási idő (ms-ben megvadva, max 10_000)
				<br />
				Max memória használat (MB-ban megadva, max 128)
				<br />
				Pontok: Mennyi pontot ér a teszteset, opcionális.
				<br />
				Név: Teszteset neve, opcionális.
				<br />
				Leírás: Teszteset leírása, opcionális.
				<br />
				Név, leírás mutatása megoldónak: Mutassuk-e a nevet és a leírást a megoldó embereknek.
				<br />
				Kimeneti fájl: Sorok trimmelve megegyeznek a kimenettel. Vagy ezt, vagy a Kimenetet ellenőrző
				szkript forráskódját meg kell adni
				<br />
				Kimenetet ellenőrző szkript forráskódja: Ellenőrzi a kimenetet (2 paraméterű függvény: bemenet,
				kapott kimenet). Vagy ezt, vagy minden tesztesetben a Kimeneti fájlt meg kell adni.
				<br />
			</div>
		</>
	);
}
