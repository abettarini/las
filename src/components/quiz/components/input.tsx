import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    type: string;
    id: string;
    className?: string
    onChange: (value: string) => void;
}

export function QuizInput(props: InputProps) {
    const { label, type, id, className = '', onChange } = props

    const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        onChange(event.target.value);
    }
    return (
        <>
            <Label htmlFor={id}>{label}</Label>
            <Input
                className={className}
                id={id}
                type={type}
                onChange={onChangeHandler}
            />
        </>
    )
}