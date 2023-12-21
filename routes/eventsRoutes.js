const { Router } = require("express");
const router = Router();

const {
	getAllEvents,
	getSingleEvent,
} = require("../controllers/eventsControllers.js");

// Récupérer tous les évènements
router.route("/").get(getAllEvents);

// Récupérer un évènement par son ID
router.route("/:id").get(getSingleEvent);

module.exports = router;
