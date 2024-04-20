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