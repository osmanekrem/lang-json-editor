import { create } from 'zustand'

export const langDataStore = create((set) => ({
  langData:  {},
  setLangData: (value:any,lang:string) => set((state:any) => ({ langData:{...state.langData, [lang]:value} })),
}))
