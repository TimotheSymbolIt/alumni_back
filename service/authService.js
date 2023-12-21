const { createJWT } = require("../utils/tokenUtils.js");
const { hashedPassword } = require("../utils/passwordUtils.js");
const db = require("../db");

const loginService = async (user, req, res, next) => {
	try {
		const TOKEN = createJWT({
			user_id: user.user_id,
			user_name: user.name,
			user_role: user.role_name,
		});

		return res.status(200).json({
			msg: "Utilisateur connecté",
			token: TOKEN,
		});
	} catch (error) {
		console.log(error);
	}
};

const registerService = async (req, res, next) => {
	try {
		const { name, email, password, training_id, description, compagny_id } =
			req.body;

		const NEW_HASHED_PASSWORD = await hashedPassword(password);

		await db.query(
			"INSERT INTO users (name, email,is_active, password, training_id,description,compagny_id,role_name)VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
			[
				name,
				email,
				false,
				NEW_HASHED_PASSWORD,
				training_id,
				description,
				compagny_id,
				"alumni",
			]
		);

		return res.status(201).json({ msg: "Votre compte a été crée !" });
	} catch (error) {
		console.log(error);
	}
};

module.exports = { loginService, registerService };
