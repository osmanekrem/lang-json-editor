import React from "react";

type Props = {
  keyValue: string;
  value: string;
  currentPath: string[];
  addKey: (path: string[]) => void;
  handleChange: (path: string[], value: string) => void;
  handleKeyChange: (path: string[], newKey: string, value: string) => void;
  enValue: string;
};

export default function KeyValue({
  keyValue,
  value,
  currentPath,
  addKey,
  handleChange,
  handleKeyChange,
  enValue,
}: Props) {

  return (
    <div className="flex rounded items-center border w-full gap-x-2 pr-2">
      <div className="grid grid-cols-2 h-12 flex-1 items-center">
        <input
          className="h-8 px-3 w-full focus:outline-none"
          value={keyValue}
          onChange={e => handleKeyChange(currentPath, e.target.value, value)}
        />
        <div className="flex gap-x-1 w-full items-center">
          <span className="border-l pl-3 opacity-60">({enValue})</span>
          <input
            className="flex-1  h-8 px-3 focus:outline-none"
            value={value}
            onChange={(e) => handleChange(currentPath, e.target.value)}
          />
        </div>
      </div>

      <button
        className="h-8 flex items-center justify-center text-center w-8 rounded-full hover:bg-gray-100"
        onClick={() => addKey(currentPath)}
      >
        +
      </button>
    </div>
  );
}
