"use client";

import { useEffect, useState } from "react";
import Collapse from "@/components/collapse";
import { useLang } from "@/hooks/use-lang";
import LangDropdown from "@/components/lang-dropdown";
import { langDataStore } from "@/hooks/use-lang-data";
import { writeFile } from "@/utils/write-file";
import { readFile } from "@/utils/read-file";
import { countKeysAndEmptyValues } from "@/utils/count-keys-and-empty-values";

export default function Home() {
  const { lang, langs } = useLang((state: any) => state);
  const {
    langData,
    setLangData,
  } = langDataStore((state: any) => state);

  const [data, setData] = useState<any>({})

  const [showJson, setShowJson] = useState<boolean>(false);

  const getData = async () => {
    const data = await readFile("langdata.json") 
    
      Object.keys(data).forEach(lang => {
        setLangData(data[lang], lang)
      })
      
      setData(data[lang])
  }

  useEffect(() => {
    getData()
  }, [lang]);  

  useEffect(() => {
    setData(langData[lang])
  }, [langData])

  if ( !data) return "loading...";

  const collapseCheck = (
    data: any,
    handleChange: (path: string[], value: string) => void,
    handleKeyChange: (path: string[], newKey: string, value: string) => void,
    path: string[] = []
  ) => {
    return Object.keys(data).map((key, i) => {
      const currentPath = [...path, key];
      const value = data[key];
      if (typeof value === "object" && value !== null) {
        const { totalKeys, filledValueKeys } = countKeysAndEmptyValues(
          data[key]
        );
        return (
          <Collapse
            key={i}
            total={totalKeys}
            filled={filledValueKeys}
            header={key}
            handleKeyChange={handleKeyChange}
            path={currentPath}
            value={value}
            addKey={addKey}
          >
            {collapseCheck(value, handleChange, handleKeyChange, currentPath)}
          </Collapse>
        );
      } else {
        return (
          <div className="flex rounded items-center border w-full gap-x-2 pr-2" key={i}>
          <div
            className="grid grid-cols-2 h-12 flex-1 items-center"
          >
            <input
              className="h-8 px-3 focus:outline-none"
              value={key}
              onChange={(e) =>
                handleKeyChange(currentPath, e.target.value, value)
              }
            />
            <input
              className="border-l h-8 px-3 focus:outline-none"
              value={value}
              onChange={(e) => handleChange(currentPath, e.target.value)}
            />
          </div>
          
            <button className="h-8 flex items-center justify-center text-center w-8 rounded-full hover:bg-gray-100" onClick={() => addKey(currentPath)}>+</button>
            
          </div>
        );
      }
    });
  };

  const handleChange = (path: string[], value: string) => {
    let tempData = { ...data };

    let current = tempData;
    for (const key of path.slice(0, -1)) {
      current = current[key];
    }
    current[path[path.length - 1]] = value;

    setData(tempData);
    setLangData(tempData,lang);
  };

  const addKey = (path: string[]) => {

    const randomname = "key"+Math.random()*1000
    langs.forEach((lang: any) => {
      let tempData = { ...langData[lang] };

      let current = tempData;
      for (const key of path.slice(0, -1)) {
        current = current[key];
      }
      
      if(typeof current[path[path.length - 1]] === "object") {

        current[path[path.length - 1]] = { ...current[path[path.length - 1]], [randomname]: "" };
      } else {
        current[path[path.length - 1]] = {[randomname]: "" };
      }

      setLangData(tempData,lang);
    })
  };

  const handleKeyChange = (path: string[], newKey: string, value: string) => {
    const newData = { ...data };
    let current = newData;

    for (const key of path.slice(0, -1)) {
      current = current[key];
    }

    let tempKeys = Object.keys(current);
    tempKeys[tempKeys.indexOf(path[path.length - 1])] = newKey;

    let tempCurrent:any = {};
    tempKeys.forEach((key) => {
      tempCurrent[key] = current[key];
    });

    tempCurrent[newKey] = value;

    let newDataPointer = newData;
    if (path.length < 2) {
      setData(tempCurrent);
    } else {
      for (const key of path.slice(0, -2)) {
        newDataPointer = newDataPointer[key];
      }
      newDataPointer[path[path.length - 2]] = tempCurrent;
      setData(newData);
    }

    langs.map((lang: any) => {
      const newData = { ...langData[lang] };
      let current = newData;

      for (const key of path.slice(0, -1)) {
        current = current[key];
      }

      let tempKeys = Object.keys(current);
      tempKeys[tempKeys.indexOf(path[path.length - 1])] = newKey;

      let tempCurrent:any = {};
      tempKeys.forEach((key) => {
        tempCurrent[key] = current[key];
      });

      tempCurrent[newKey] = value;

      let newDataPointer = newData;
      if (path.length < 2) {
        setLangData(tempCurrent,lang)
      } else {
        for (const key of path.slice(0, -2)) {
          newDataPointer = newDataPointer[key];
        }
        newDataPointer[path[path.length - 2]] = tempCurrent;
        setLangData(newData,lang);
      }
    })
  };

  const collapsed = collapseCheck(data, handleChange, handleKeyChange);

  return (
    <div className="p-4">
      <header className="flex items-center justify-between h-12">
        <LangDropdown />

        <div className="flex items-center gap-x-2">
          <button
            className="h-8 px-3 rounded border flex items-center justify-center"
            onClick={() => {
              navigator.clipboard.writeText(JSON.stringify(data, null, 2));
            }}
          >
            copy to clipboard
          </button>
          <button
            className="h-8 w-8 rounded border flex items-center justify-center"
            onClick={() => setShowJson((prev) => !prev)}
          >
            {"{ }"}
          </button>
          <button
            className="h-8 px-3 rounded border flex items-center justify-center"
            onClick={async () => {
               await writeFile('langdata.json', langData)
            }}
          >
            Save
          </button>
        </div>
      </header>
      <div className="flex flex-col mt-10 w-full gap-y-4">
        {countKeysAndEmptyValues(data).filledValueKeys}/
        {countKeysAndEmptyValues(data).totalKeys}
        {!showJson ? collapsed : <pre>{JSON.stringify(data, null, 2)}</pre>}
      </div>
    </div>
  );
}
