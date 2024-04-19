import { useEffect, useRef, useState } from "react";
import {useLang} from "../hooks/use-lang";
import langs from "../data/langs.json"

export default function LangDropdown() {
    const [open, setOpen] = useState<boolean>(false)

    const {lang, setLang} = useLang((state:any) => state)

    const dropdownRef = useRef(null)
    const buttonRef = useRef(null)

    useEffect(() => {
        const handleClick = (e:MouseEvent | TouchEvent) => {
            if(dropdownRef.current && buttonRef.current && !e.composedPath().includes(dropdownRef.current) && !e.composedPath().includes(buttonRef.current)) {
                setOpen(false)
            }
        }

        document.addEventListener("click", handleClick)

        return () => {
            document.removeEventListener("click", handleClick)
        }
    })
    
    return (
        <div className="relative">

        <button ref={buttonRef} type="button" onClick={() => setOpen(prev => !prev)} className="h-8 px-3 rounded-md bg-white border">
            {lang}
        </button>
        {open && (<div ref={dropdownRef} className="rounded-md border p-2 bg-white flex flex-col absolute top-10 left-0">
            {langs.map((lang,i) => (
                <button className="h-8 px-2 rounded hover hover:bg-gray-200" key={i} onClick={() => setLang(lang.code)}>{lang.text}</button>
            ))}
        </div>)}
        </div>
    )
}