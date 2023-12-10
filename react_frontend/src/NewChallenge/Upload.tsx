import CheckboxField from "@components/CheckboxField";
import FormRow from "@components/FormRow";
import axios from "axios";
import { Form as FormikForm, Formik } from "formik";
import { Button, Steps } from "react-daisyui";
import { useNavigate } from "react-router-dom";

/*interface MyFormValues {
	name?: string;
	short_desc?: string;
	long_desc?: string;
}*/

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
					initialValues={{ name: "", short_desc: "", long_desc: "", enabled: ["java"] }}
					//validate={() => {}}
					onSubmit={async (values, { setSubmitting }) => {
						try {
							await axios.post(
								"http://localhost:3002/challenge/upload",
								{
									name: values.name,
									shortDescription: values.short_desc,
									description: values.long_desc,
									controlSolution: {
										language: "java",
										folderContents: [
											{
												content:
													"aW1wb3J0IGphdmEudXRpbC5TY2FubmVyOw0KDQpwdWJsaWMgY2xhc3MgU29sdXRpb24gew0KDQogICAgcHVibGljIHN0YXRpYyB2b2lkIG1haW4oU3RyaW5nW10gYXJncykgew0KICAgICAgICBTeXN0ZW0ub3V0LnByaW50bG4oMTAxKTsNCiAgICAgICAgU3lzdGVtLm91dC5wcmludGxuKDI1MjApOw0KICAgIH0NCg0KfQ==",
												name: "Solution.java",
											},
										],
									},
									outputVerifier: {
										content:
											"CgpkZWYgdmVyaWZ5KGlucHV0X2ZpbGVfY29udGVudHMsIG91dHB1dF9maWxlX2NvbnRlbnRzKToKICAgIHByaW50KGludChvdXRwdXRfZmlsZV9jb250ZW50c1swXSksIGludChpbnB1dF9maWxlX2NvbnRlbnRzWzBdKSArIGludChpbnB1dF9maWxlX2NvbnRlbnRzWzFdKSkKICAgIHByaW50KGludChvdXRwdXRfZmlsZV9jb250ZW50c1sxXSksIGludChpbnB1dF9maWxlX2NvbnRlbnRzWzBdKSAqIGludChpbnB1dF9maWxlX2NvbnRlbnRzWzFdKSkKICAgIHJldHVybiBpbnQob3V0cHV0X2ZpbGVfY29udGVudHNbMF0pID09IGludChpbnB1dF9maWxlX2NvbnRlbnRzWzBdKSArIGludChpbnB1dF9maWxlX2NvbnRlbnRzWzFdKSBhbmQgaW50KG91dHB1dF9maWxlX2NvbnRlbnRzWzFdKSA9PSBpbnQoaW5wdXRfZmlsZV9jb250ZW50c1swXSkgKiBpbnQoaW5wdXRfZmlsZV9jb250ZW50c1sxXSkK",
										name: "verifier.py",
									},
									testCases: [
										{
											input: "NTYKNDUK",
											points: 2,
											description: "Simple test case",
											maxMemory: 1500,
											maxTime: 2500,
											name: "test case 1",
										},
										{
											inputGenerator: {
												content:
													"aW1wb3J0IHJhbmRvbQpwcmludChyYW5kb20ucmFuZGludCgyMCwgNTApKQpwcmludChyYW5kb20ucmFuZGludCgyMCwgNTApKQ==",
												name: "qwe.py",
											},
											points: 5,
											description: "Simple generated test case",
											maxMemory: 1500,
											maxTime: 2500,
											name: "test case 2",
										},
									],
								},
								{
									headers: {
										Authorization: `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MDIwNTM0MzYsImV4cCI6MTczMzYxMTAzNn0.WqM_eJflqKMTlkP9L3SNFYQzMK_UQAwqR30Utmwh16RjOlg1roYWAegMC619bEfp4Oh9QSDlVZtLFPRS7-O0esYeyBiLaioZ6pX25kYMXTfEdtKfRVmdlKFNIfNFJKn5P9srPNqOs-ObI8gtf2vZp8b1Ef1NanFry6zPhTtoTO3U7UkNoPAu9t7oTzji8RcprYDRg8t7NeNakK8oyHUZHqtzToONaM1de69uYGY-P8IFU5W1MK8vGB6GNYZIuxlYb0-SiiTXtwGXckHEiAup5bo0h3XhD56R2LHSsH8lDUcrgCZb5bTJehvzOp9WIC5-Y73Yoj_tjHM3bv2eZOYMMlQDxPpQxllGppRobLwnGQ9JlvotmSGC231rVmIffGIx3tK2rmLrESn1oUNy4nomhw8QvcaYC-PzBJFzL9RyveYHkJel6X3czEm-RIOchDlxbMQV5Wwkeu0BOMGo9KFVFd_lL73XW47ogtxhtbwX13pKQUv-jxT9xVjHWa0yUtxN`,
									},
								}
							);
							setSubmitting(false);
							const id = 0; //response.data.id
							navigate(`/edit/${id}/testcases`);
						} catch (error) {
							console.error(error);
							setSubmitting(false);
						}
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
											<CheckboxField name="enabled" value="java" title="Java" disabled />
											{/*<CheckboxField name="enabled" value="python" title="Python" />
											<CheckboxField name="enabled" value="c++" title="C++" />*/}
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
