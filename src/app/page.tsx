"use client";

import { useEffect, useState } from "react";
import Collapse from "@/components/collapse";
import LangDropdown from "@/components/lang-dropdown";
import { langDataStore } from "@/hooks/use-lang-data";
import { readFile, saveLangData } from "@/utils/file";
import {
  addKeyToData,
  countKeysAndEmptyValues,
  updateDataForKey,
} from "@/utils";
import { langs } from "@/data/data";
import KeyValue from "@/components/key-value";

export default function Home() {
  const { lang } = langDataStore((state: any) => state);

  const [data, setData] = useState<any>({});
  const [langData, setLangData] = useState<any>(null)

  const [showJson, setShowJson] = useState<boolean>(false);

  const getData = async (lang: any) => {
    const data = await readFile(lang.file);
    return data;
  };

  const save = async () => {
    langs.forEach(async lang => {
      await saveLangData(lang, langData[lang.code])
    })
  };

  const fetchlangs = async () => {

    langs.forEach(async lang => {
      const data = await getData(lang)
      console.log(data, lang);
      
      setLangData((prev: any) => ({
        ...prev,
        [lang.code]: data
      }))
    })
  };

  useEffect(() => {
    fetchlangs();
  }, []);

  useEffect(() => {
    
    if(langData?.[lang.code]) {
      setData(langData[lang.code])
    }
  }, [langData, lang])

  const addKey = (path: string[]) => {
    const randomname = "key" + Math.random() * 1000;

    let newData = langData

    Object.keys(langData).forEach(lang => {
      newData = {
        ...newData,
        [lang]: addKeyToData(langData[lang], path, randomname)
      }
    })

    setLangData(newData)
  };

  const handleKeyChange = (path: string[], newKey: string, value: string) => {
    const newData = { ...data };
    const tempCurrent = updateDataForKey(newData, path, newKey, value);

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
      console.log(langData[lang.code]);
      
      const newData = { ...langData[lang.code] };
      let tempCurrent = updateDataForKey(newData, path, newKey, value)

      let newDataPointer = newData;
      if (path.length < 2) {
        setLangData((prev: any) => ({
          ...prev,
          [lang.code]: tempCurrent
        }))
      } else {
        for (const key of path.slice(0, -2)) {
          newDataPointer = newDataPointer[key];
        }
        newDataPointer[path[path.length - 2]] = tempCurrent;
        setLangData((prev: any) => ({
          ...prev,
          [lang.code]: newData
        }))
      }
    })
  };

  const handleChange = (path: string[], value: string) => {
    let tempData = { ...data };

    let current = tempData;
    for (const key of path.slice(0, -1)) {
      current = current[key];
    }
    current[path[path.length - 1]] = value;

    setData(tempData);
  };

  const collapseCheck = (
    data: any,
    enData: any,
    path: string[] = []
  ) => {
    return Object.keys(data).map((key, i) => {
      const currentPath = [...path, key];
      const value = data[key];
      const enValue = enData?.[key];
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
            {collapseCheck(
              value,
              enValue,
              currentPath
            )}
          </Collapse>
        );
      } else {
        return (
          <KeyValue
            addKey={addKey}
            currentPath={currentPath}
            key={i}
            keyValue={key}
            enValue={enValue}
            handleChange={handleChange}
            handleKeyChange={handleKeyChange}
            value={value}
          />
        );
      }
    });
  };

  if (!data || !langData) return "loading...";
  const collapsed = collapseCheck(data, langData["en"])

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
            onClick={save}
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
