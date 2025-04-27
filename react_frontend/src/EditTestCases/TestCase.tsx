import { Checkbox, Divider, Input } from "react-daisyui";
import { useFormikContext, Field, ErrorMessage } from "formik";
import RadioTextArea from "@components/RadioTextArea";
import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";

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
                theme={"vs-light"}
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
                <tr>
                    <td className="font-medium">Név</td>
                    <td>
                        <Field
                            as={Input}
                            name={`testCases.${index}.name`}
                            className="w-full input-bordered"
                        />
                        <ErrorMessage
                            name={`testCases.${index}.name`}
                            component="div"
                            className="text-sm text-error"
                        />
                    </td>
                </tr>
                <tr>
                    <td className="font-medium">Leírás</td>
                    <td>
                        <Editor
                            height="20vh"
                            language="markdown"
                            theme="vs-light"
                            value={context.values.testCases[index].description}
                            onChange={(value) =>
                                context.setFieldValue(`testCases.${index}.description`, value)
                            }
                        />
                    </td>
                </tr>
                <tr>
                    <td className="font-medium">Pontszám</td>
                    <td>
                        <Field
                            as={Input}
                            type="number"
                            name={`testCases.${index}.points`}
                            className="w-full input-bordered"
                        />
                        <ErrorMessage
                            name={`testCases.${index}.points`}
                            component="div"
                            className="text-sm text-error"
                        />
                    </td>
                </tr>
                <tr>
                    <td className="font-medium">Tolerancia szorzó</td>
                    <td>
                        <Field
                            as={Input}
                            type="number"
                            name={`testCases.${index}.overheadMultiplier`}
                            className="w-full input-bordered"
                        />
                        <ErrorMessage
                            name={`testCases.${index}.overheadMultiplier`}
                            component="div"
                            className="text-sm text-error"
                        />
                    </td>
                </tr>
                <tr>
                    <td>Kiválasztott nyelv</td>
                    <td>
                        <select
                            className="select w-full max-w-xs"
                            onChange={(e) => setSelectedLanguage(e.target.value)}
                        >
                            {context.values.testCases[index].limits.map((limit: any) => (
                                <option key={limit.language}>{limit.language}</option>
                            ))}
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
