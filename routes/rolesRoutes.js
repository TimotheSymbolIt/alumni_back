const { Router } = require("express");
const router = Router();

const { getAllRoles } = require("../controllers/rolesControllers");

//Récupérer tous les rôles
router.get("/", getAllRoles);

module.exports = router;
