const db = require("../db/index.js");
const { comparedPassword } = require("../utils/passwordUtils.js");
const { CustomError } = require("../errors/CustomerError.js");
const { loginService, registerService } = require("../service/authService.js");

const registerUser = async (req, res, next) => {
	const { email } = req.body;
	try {
		const {
			rows: [{ count }],
		} = await db.query("SELECT COUNT(*) FROM users where email = $1", [email]);

		if (count >= 1) {
			throw new CustomError(400, "Cette adresse est déjà utilisée !");
		} else {
			const RESPONSE = await registerService(req, res, next);
			return RESPONSE;
		}
	} catch (error) {
		next(error);
	}
};

const loginUser = async (req, res, next) => {
	const { email, password } = req.body;
	try {
		const {
			rows: [user],
		} = await db.query(
			"SELECT user_id, name, password, role_name, is_active FROM users WHERE email = $1",
			[email]
		);

		if (!user) {
			throw new CustomError(
				400,
				"L'email et/ou le mot de passe sont incorrects !"
			);
		}

		const IS_PASSWORD_CORRECT = await comparedPassword(password, user.password);

		if (!IS_PASSWORD_CORRECT) {
			throw new CustomError(
				400,
				"L'email et/ou le mot de passe sont incorrects !"
			);
		}

		const RESPONSE = await loginService(user, req, res, next);
		return RESPONSE;
	} catch (error) {
		next(error);
	}
};

module.exports = { registerUser, loginUser };
