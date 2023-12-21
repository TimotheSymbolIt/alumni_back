//! gestion des formations

const db = require("../db");
const { StatusCodes } = require("http-status-codes");
const {
	createTrainingService,
	getAllTrainingsService,
} = require("../service/trainingService");
const { CustomError } = require("../errors/CustomerError");

const getAllTrainingsController = async (req, res, next) => {
	try {
		return getAllTrainingsService(req, res, next);
	} catch (error) {
		console.log(error);
	}
};

const createTrainingController = async (req, res, next) => {
	try {
		const { training_name } = req.body;
		if (training_name) {
			return createTrainingService(req, res, next);
		} else {
			throw new CustomError(400, "Vous n'avez pas écrit de nom de formation");
		}
	} catch (error) {
		console.log(error);
	}
};

const updateTraining = async (req, res) => {
	const { name, training_id } = req.body;
	await db.query(
		"UPDATE trainings SET training_name = $1 WHERE training_id = $2 RETURNING *",
		[name, training_id]
	);
	res.status(200).json({ msg: `Bien modifié en ${name}` });
};

const deleteTraining = async (req, res) => {
	const { training_id, name } = req.body;
	await db.query("DELETE FROM trainings WHERE training_id = $1", [training_id]);
	res.status(200).json({ msg: `Formation ${name} supprimée` });
};

module.exports = {
	getAllTrainingsController,
	createTrainingController,
	updateTraining,
	deleteTraining,
};
