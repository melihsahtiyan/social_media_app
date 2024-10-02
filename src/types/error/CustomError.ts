export class CustomError extends Error {
	statusCode?: number;
	data?: unknown[];
	className?: string;
	functionName?: string;

	constructor(message: string, statusCode?: number, data?: unknown[], className?: string, functionName?: string) {
		super(message);
		this.statusCode = statusCode;
		this.data = data;
		this.className = className;
		this.functionName = functionName;
		Object.setPrototypeOf(this, CustomError.prototype);
	}
}
