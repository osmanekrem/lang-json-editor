"use server";

import fsPromises from 'fs/promises';

export const readFile = async (path: string) => {
    try {
        
        const data = await fsPromises.readFile(path); 
        return JSON.parse(data.toString())

    } catch (error) {
        console.log(error);
        
    }
}

export const writeFile = async (path: string, data: any) => {
    try {
        
        await fsPromises.writeFile(path, JSON.stringify(data)); 
    } catch (error) {
        console.log(error);
        
    }
}

export const saveLangData = async (lang: any, data: any) => {
  await writeFile(lang.file, data);
};