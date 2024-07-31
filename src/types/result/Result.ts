export class Result {
	statusCode: number;
	success: boolean;
	message: string;
	stack?;

	constructor(statusCode: number, success: boolean, message: string, stack?) {
		this.statusCode = statusCode;
		this.success = success;
		this.message = message;
		this.stack = stack;
	}
}
