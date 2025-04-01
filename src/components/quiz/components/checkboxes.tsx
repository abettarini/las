import React, { useEffect } from "react";
import { Checkbox, CheckboxGroup } from "../@/components/ui/checkbox";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    options: string[];
    type: string;
    id: string;
    className?: string
    onChange: (value: string[]) => void;
}

export function QuizCheckboxes(props: CheckboxProps) {
    const { id, className = '', onChange, options } = props
    const [selected, setSelected] = React.useState([]);

    useEffect(() => {
        setSelected([])
    }, [])

    useEffect(() => {
        onChange(selected)
    }, [selected])

    const handleCheckboxChange = (value: string) => {
        setSelected((prevSelected) => {
            if (prevSelected.includes(value)) {
                return prevSelected.filter((item) => item !== value);
            } else {
                return [...prevSelected, value];
            }
        });
    };
    return (
            <CheckboxGroup value={selected} aria-label={id} className="pb-4">
                {options?.map((option) => (
                    <Checkbox
                        key={option}
                        value={option}
                        isSelected
                        onChange={() => handleCheckboxChange(option)}
                    >
                        <div className="text-md">{option}</div>
                    </Checkbox>
                ))}
            </CheckboxGroup>
    )
}