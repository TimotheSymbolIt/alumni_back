const { CustomError } = require("./CustomerError.js");

const errorHandler = (error, req, res, next) => {
	if (error instanceof CustomError) {
		return res.status(error.status_code).json({
			error_code: error.status_code,
			error_message: error.message,
		});
	}

	return res.status(400).send(error.message);
};

module.exports = { errorHandler };
