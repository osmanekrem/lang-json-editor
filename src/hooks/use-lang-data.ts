import { create } from "zustand";

export const langDataStore = create((set) => ({
  lang: {
    code: "en",
    file: "src/data/en.json",
  },
  setLang: (lang:any) => set({ lang }),
  langData: {},
  setLangData: (value: any, lang: string) =>
    set((state: any) => ({ langData: { ...state.langData, [lang]: value } })),
}));
