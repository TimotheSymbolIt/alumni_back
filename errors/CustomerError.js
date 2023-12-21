class CustomError extends Error {
	constructor(codeError, messageError) {
		super();
		this.message = messageError;
		this.status_code = codeError;
	}
}

module.exports = { CustomError };
