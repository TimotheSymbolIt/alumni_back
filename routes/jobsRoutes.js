const { Router } = require("express");
const router = Router();

const { getAllJobs, getJobById } = require("../controllers/jobsControllers");

//Récupérer tous les emplois
router.get("/", getAllJobs);

router.get("/:id", getJobById);

module.exports = router;
