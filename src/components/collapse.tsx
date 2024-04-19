import { Dispatch, FC, ReactNode, useState } from "react";

interface CollapseProps {
  header: string;
  children: ReactNode;
  total: number;
  filled: number;
  handleKeyChange: (path:string[], newKey:string, value:string) => void
  path: string[]
  value: any
  addKey: (path: string[]) => void
}

const Collapse: FC<CollapseProps> = ({ header, children, filled, total,handleKeyChange,path, value,addKey}) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="border rounded-md flex flex-col w-full">
      <div
        className="h-12 flex px-4 items-center justify-between cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        <input value={header} onChange={(e) => handleKeyChange(path,e.target.value,value)}/>{" "}{filled}/{total}
        <div className="flex items-center gap-x-2">
        <button onClick={() => addKey(path)} className="h-8 flex items-center justify-center w-8 rounded-full hover:bg-gray-100">
          +
        </button>
        <button className="h-8 flex items-center justify-center w-8 rounded-full hover:bg-gray-100">
          <span
            className={`h-2 border-black w-2 bg-transparent transition-transform duration-300 border-r-2 border-t-2 ${
              open ? "rotate-[135deg]" : "rotate-45"
            }`}
          ></span>
        </button>
        </div>
      </div>
      {open && (
        <div className="p-4 border-t flex flex-col gap-y-3">{children}</div>
      )}
    </div>
  );
};
export default Collapse;
