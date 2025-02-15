import {ErrorMessage, Field} from "formik";
import {Indicator, Input, Textarea, Tooltip} from "react-daisyui";
import {Question} from "@phosphor-icons/react";

interface FormFieldProps {
    name: string;
    type?: string;
    title: string | React.ReactElement;
    error?: string | boolean;
    disabled?: boolean;
    tooltip?: string;
}

export default function FormRow({name, type, title, error, disabled, tooltip}: FormFieldProps) {
    let input;
    if (type === "textarea") {
        input = <Field as={Textarea} bordered className="w-full h-64 font-mono" name={name} disabled={disabled}/>;
    } else {
        input = (
            <Field as={Input} type={type} name={name} className="w-full" color={error ? "error" : "neutral"}
                   disabled={disabled}/>
        );
    }

    return (
        <>
            <tr>
                <td className="w-1/4">
                    {title}
                    {
                        tooltip &&
                        <Tooltip message={tooltip} style={{marginLeft: "8px"}}>
                            <Question size={16}/>
                        </Tooltip>
                    }
                </td>
                <td>
                    {error ? (
                        <Indicator>
                            <Indicator.Item className="badge text-red-500">
                                <ErrorMessage name={name}/>
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
