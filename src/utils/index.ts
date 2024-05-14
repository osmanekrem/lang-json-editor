export function countKeysAndEmptyValues(obj:any) {
    let totalKeys = 0;
    let filledValueKeys = 0;
  
    function traverse(obj:any) {
      if (typeof obj === "object" && obj !== null) {
        for (const key in obj) {
          if (typeof obj[key] === "object") {
            traverse(obj[key]);
          } else if (typeof obj[key] === "string") {
            totalKeys++;
            if (obj[key] !== "") filledValueKeys++;
          }
        }
      }
    }
  
    traverse(obj);
    return { totalKeys, filledValueKeys };
  }

export const updateDataForKey = (data: any, path: string[], newKey: string, value: string) => {
    let current = data;
    for (const key of path.slice(0, -1)) {
      current = current[key];
    }
    
    console.log(current, data, path);
    let tempKeys = Object.keys(current);
    
    tempKeys[tempKeys.indexOf(path[path.length - 1])] = newKey;

    let tempCurrent:any = {};
    tempKeys.forEach((key) => {
      tempCurrent[key] = current[key];
    });
    
    tempCurrent[newKey] = value;
    return tempCurrent;
  };

  export const addKeyToData = (data: any, path: string[], randomname: string) => {

    let tempData = data
    let current = tempData;
    for (const key of path.slice(0, -1)) {
        current = current[key];
    }

    if (typeof current[path[path.length - 1]] === "object") {
        current[path[path.length - 1]] = {
            ...current[path[path.length - 1]],
            [randomname]: "",
        };
    } else {
        current[path[path.length - 1]] = { [randomname]: "" };
    }
    return tempData;
};