interface Obj {
  [key: string]: string | number;
}

export const checkIfObjHasAllTheProperties = (
  obj: Obj,
  properties: Array<string | number>
): boolean => {
  for (const property of properties) {
    if (!Object.prototype.hasOwnProperty.call(obj, property)) return false;
  }
  return true;
};
