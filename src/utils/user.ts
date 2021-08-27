export const isTheUser = (idInToken: number, idInRequest: number): boolean => {
  if (idInToken === idInRequest) return true;
  else return false;
};
