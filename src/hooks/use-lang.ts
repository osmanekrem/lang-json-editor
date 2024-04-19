import { create } from 'zustand'

export const useLang = create((set) => ({
  lang: "tr",
  langs: ["tr","en"],
  setLang: (lang:"string") => set({ lang }),
}))
