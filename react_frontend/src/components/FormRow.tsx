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
        <div className="form-control w-full">
            <label className="label">
                <span className="label-text font-medium">{title}</span>
                {tooltip && (
                    <Tooltip message={tooltip}>
                        <Question size={16} className="ml-1" />
                    </Tooltip>
                )}
            </label>
            {input}
            {error && (
                <div className="mt-1 text-error text-sm">
                    <ErrorMessage name={name}/>
                </div>
            )}
        </div>
    );
}
