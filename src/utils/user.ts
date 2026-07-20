export const isTheUser = (idInToken: number, idInRequest: number): boolean =>
  idInToken === idInRequest;
