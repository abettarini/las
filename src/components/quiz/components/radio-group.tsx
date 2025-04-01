import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { shuffle } from "@/lib/utils";
import { useEffect, useState } from "react";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    options: string[];
    type: string;
    id: string;
    className?: string
    onValueChange: (value: string) => void;
}

export function QuizRadioGroup(props: CheckboxProps) {
    const [options, setOptions] = useState<string[]>([])
    const { id, onValueChange } = props

    useEffect(() => {
        setOptions(shuffle(props.options))
    }, [])
    return (
        <RadioGroup value={undefined} name={id} onValueChange={onValueChange} className="flex flex-col gap-2 pb-4" defaultValue={undefined}>
            {options.map((option) => (
                <div className="flex-1" key={option}>
                  <RadioGroupItem key={option} value={option} id={option} />
                  <Label htmlFor={option} className="ml-2 text-md">{option}</Label>
                </div>
            ))}
        </RadioGroup>
    )
}