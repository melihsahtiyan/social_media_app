export class Result {
  statusCode: number;
  success: boolean;
  message: string;
  stack?: any;

  constructor(
    statusCode: number,
    success: boolean,
    message: string,
    stack?: any
  ) {
    this.statusCode = statusCode;
    this.success = success;
    this.message = message;
    this.stack = stack;
  }
}
