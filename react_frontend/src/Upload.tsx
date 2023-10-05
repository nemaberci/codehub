import { Formik } from "formik";
import { Button, Input } from "react-daisyui";

interface MyFormValues {
  email?: string;
  password?: string;
}
export default function Upload() {
  return (
    <>
      <div className="w-full flex flex-col items-center">
        <h2>Új feladat feltöltése</h2>
        <Formik
          initialValues={{ email: "", password: "" }}
          validate={(values) => {
            const errors: MyFormValues = {};

            if (!values.email) {
              errors.email = "Required";
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
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
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            /* and other goodies */
          }) => (
            <form onSubmit={handleSubmit}>
              <label className="label">
                <span className="label-text">Email:</span>
                <span className="label-text-alt">
                  {errors.email && touched.email && errors.email}
                </span>
              </label>
              <Input
                type="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
                color={errors.email ? "error" : "neutral"}
              />
              <br />
              <label className="label">
                <span className="label-text">Password:</span>
                <span className="label-text-alt">
                  {errors.password && touched.password && errors.password}
                </span>
              </label>
              <Input
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
                color={errors.password ? "error" : "neutral"}
              />

              <br />
              <Button type="submit" disabled={isSubmitting}>
                Submit
              </Button>
            </form>
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
        Etalon megoldás (referencia a megoldásra): A feladat feltöltője által
        adott megoldás.
        <br />
        Elfogadott megoldások nyelvei: Lista azokból a nyelvekből, amikkel
        megoldást lehet fetölteni. (Olyan nyelvek, amikre van bekonfigurált
        fordító és futtatókörnyezet)
        <br />
        Checkmarkot kap, ha van etalon megoldása, ami teljesíti a limiteket
        <br />
        Tesztesetek: A tesztesetek, amikre a megoldások ellenőrizve vannak.
        Legalább 1-et meg kell adni.
        <br />
        Feltöltés időpontja: UTC timestamp, amikor a szerver megkapta a
        feltöltött feladatot.
        <br />
        Tesztesetenként:
        <br />
        A következők közül valamelyik:
        <br />
        Bemeneti fájl: Sorról sorra a bemenet
        <br />
        Bemeneti fájlt generáló szkript forráskódja: Generálja a bemeneti fájlt
        (0 paraméterű függvény)
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
        Név, leírás mutatása megoldónak: Mutassuk-e a nevet és a leírást a
        megoldó embereknek.
        <br />
        Kimeneti fájl: Sorok trimmelve megegyeznek a kimenettel. Vagy ezt, vagy
        a Kimenetet ellenőrző szkript forráskódját meg kell adni
        <br />
        Kimenetet ellenőrző szkript forráskódja: Ellenőrzi a kimenetet (2
        paraméterű függvény: bemenet, kapott kimenet). Vagy ezt, vagy minden
        tesztesetben a Kimeneti fájlt meg kell adni.
        <br />
      </div>
    </>
  );
}
