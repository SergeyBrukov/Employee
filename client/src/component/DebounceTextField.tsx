import React, {FC, useEffect, useRef, useState} from "react";
import TextField from "@mui/material/TextField";

interface IUseDebounceValue {
    initialValue: string,
    setDebounceValue?: (debounceValue: string) => void,
    className?: any,
    time?: number,
    placeholder: string,
    handleChangeValue: (debounceValue: string) => void
}

const DebounceTextField: FC<IUseDebounceValue> = ({setDebounceValue, time = 600, className, initialValue, placeholder, handleChangeValue}) => {

    const [value, setValue] = useState<string>(initialValue);

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    const didMount = useRef(true);

    useEffect(() => {

        if (didMount.current) {
            didMount.current = false
            return;
        }

        let timeOut: NodeJS.Timeout;
        timeOut = setTimeout(() => {
            // setDebounceValue(value);
            handleChangeValue(value)
        }, time)

        return () => clearTimeout(timeOut)
    }, [value])

    return (
        <TextField placeholder={placeholder} className={className}
                   value={value} onChange={(e) => setValue(e.target.value)}/>
    )

}

export default DebounceTextField