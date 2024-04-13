import { Result } from "./Result";

export class DataResult<T> extends Result {
  data?: T;

  constructor(
    statusCode: number,
    success: boolean,
    message: string,
    data?: T,
    stack?: any
  ) {
    super(statusCode, success, message, stack);
    this.data = data;
  }
}
