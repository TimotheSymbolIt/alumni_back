const { Router } = require("express");
const router = Router();

const {
	getSingleCompagny,
	getAllCompagnies,
} = require("../controllers/compagniesControllers");

// Récupérer tous les entreprises
router.get("/", getAllCompagnies);

// Récupérer une entreprise par son ID
router.get("/:id", getSingleCompagny);

module.exports = router;
