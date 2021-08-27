export interface HandlerError extends Error {
  statusCode: number;
}

export class HandlerError extends Error {
  constructor(statusCode: number, ...params: string[]) {
    super(...params);
    this.name = 'HandlerError';
    this.statusCode = statusCode;

    Object.setPrototypeOf(this, HandlerError.prototype);
  }
}
