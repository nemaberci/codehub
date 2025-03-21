import {Checkbox, Divider} from "react-daisyui";
import {useFormikContext} from "formik";
import FormRow from "@components/FormRow";
import RadioTextArea from "@components/RadioTextArea";
import {Editor} from "@monaco-editor/react";
import {useEffect, useState} from "react";

function OutputFields({objectPath}: { objectPath: string }) {
    const context: any = useFormikContext();
    const [disabled, setDisabled] = useState(context.values.isOutputScript);
    useEffect(
        () => {
            setDisabled(context.values.isOutputScript);
        },
        [context.values]
    )
    return (
        <>
            <label className="label cursor-pointer justify-start gap-4">
                <Checkbox checked={!disabled} disabled/>{" "}
                <span className={"label-text text-zinc-600 cursor-not-allowed"}>Nyers adat szövegfájl</span>
            </label>
            <Editor
                height={"35vh"}
                language="plaintext"
                theme={"vs-dark"}
                value={context.values.testCases[0].output}
                options={{
                    readOnly: disabled,
                    readOnlyMessage: {
                        value: "Kimenet ellenőrző script esetén a kimenet nem szerkeszthető"
                    },
                }}
                onChange={(value) => {
                    context.setFieldValue(`${objectPath}.output`, value);
                }}

            />
        </>
    );
}

export default function TestCase({index}: { index: number }) {
    const context: any = useFormikContext();
    const [selectedLanguage, setSelectedLanguage] = useState(context.values.testCases[index].limits[0]?.language ?? "java");
    return (
        <>
            <Divider/>
            <table className="table">
                <tbody>
                <FormRow name={`testCases.${index}.name`} title="Név"/>
                <tr>
                    <td className="w-1/4">Leírás</td>
                    <td>
                        <Editor
                            height={"20vh"}
                            language="markdown"
                            theme={"vs-dark"}
                            value={context.values.testCases[index].description}
                            onChange={(value) => {
                                context.setFieldValue(`testCases.${index}.description`, value);
                            }}
                        />
                    </td>
                </tr>
                <FormRow name={`testCases.${index}.points`} title="Pontszám" type="number"/>
                <FormRow name={`testCases.${index}.overheadMultiplier`} title="Tolerancia szorzó" type="number"
                         tooltip={"Az etalon megoldáshoz képest hányszoros maximális memóriahasználat és futásidő megengedett."}/>
                <tr>
                    <td>KJiválasztott nyelv</td>
                    <td>
                        <select className="select w-full max-w-xs"
                                onChange={(e) => setSelectedLanguage(e.target.value)}>
                            {
                                context.values.testCases[index].limits.map(
                                    (limit: any) => <option>{limit.language}</option>
                                )
                            }
                        </select>
                    </td>
                </tr>
                <tr>
                    <td>Max. futásidő (ms)</td>
                    <td>
                        <input value={context.values.testCases[index].limits.find((l: { memory: number; time: number; language: string; }) => l.language === selectedLanguage)?.time ?? "N/A"}
                               className={"input w-full input-bordered focus:outline-offset-0"}
                               disabled={true} />
                    </td>
                </tr>
                <tr>
                    <td>Max. memória (kB)</td>
                    <td>
                        <input value={context.values.testCases[index].limits.find((l: { memory: number; time: number; language: string; }) => l.language === selectedLanguage)?.memory ?? "N/A"}
                               className={"input w-full input-bordered focus:outline-offset-0"}
                               disabled={true}/>
                    </td>
                </tr>
                <tr>
                    <td>
                        <h4>Bemenet</h4>
                    </td>
                    <td>
                        <RadioTextArea
                            radioName={`testCases.${index}.inputType`}
                            radioValue="raw"
                            title="Nyers adat szövegfájl"
                            textAreaName={`testCases.${index}.input`}
                        />
                        <RadioTextArea
                            radioName={`testCases.${index}.inputType`}
                            radioValue="script"
                            title="Generáló script"
                            textAreaName={`testCases.${index}.inputGenerator`}
                        />
                    </td>
                </tr>
                <tr>
                    <td>
                        <h4>Kimenet</h4>
                    </td>
                    <td>
                        <OutputFields objectPath={`testCases.${index}`}/>
                    </td>
                </tr>
                </tbody>
            </table>
        </>
    );
}
