const { Router } = require("express");
const router = Router();

const {
	getAllTrainingsController,
	createTrainingController,
	updateTraining,
	deleteTraining,
} = require("../controllers/trainingsControllers");

// Récupérer toutes les formations
router.route("/").get(getAllTrainingsController);

// Ajouter une formation
router.route("/").post(createTrainingController);

// Modifier une formation
router.route("/:id").put(updateTraining);

// Supprimer une formation
router.route("/:id").delete(deleteTraining);

module.exports = router;
