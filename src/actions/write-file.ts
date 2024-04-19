"use server";

import fsPromises from 'fs/promises';

export const writeFile = async (path: string, data: any) => {
    try {
        
        await fsPromises.writeFile(path, JSON.stringify(data)); 
    } catch (error) {
        console.log(error);
        
    }
}