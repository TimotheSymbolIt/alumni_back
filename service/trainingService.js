const { StatusCodes } = require("http-status-codes");
const db = require("../db");
const { CustomError } = require("../errors/CustomerError");

const getAllTrainingsService = async (req, res, next) => {
	try {
		const { rows: trainings } = await db.query("SELECT * FROM trainings");
		res
			.status(StatusCodes.OK)
			.json({ msg: "Toutes les formations retournées !", trainings });
	} catch (error) {
		next(error);
	}
};

const createTrainingService = async (req, res, next) => {
	const { training_name } = req.body;

	try {
		const { rows: training } = await db
			.query("INSERT INTO trainings(training_name) VALUES($1) RETURNING *", [
				training_name,
			])
			.catch((error) => {
				if (error.code === "23505") {
					throw new CustomError(400, "Ce nom de formation existe déjà");
				} else {
					throw new CustomError(400, "Vous avez une erreur sur votre contenu");
				}
			});

		return res.status(StatusCodes.OK).json({
			msg: `La formation a bien été ajoutée !`,
			training: training[0],
		});
	} catch (error) {
		next(error);
	}
};

module.exports = { getAllTrainingsService, createTrainingService };
