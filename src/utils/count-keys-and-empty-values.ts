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