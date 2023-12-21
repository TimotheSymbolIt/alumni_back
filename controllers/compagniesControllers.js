const db = require("../db");

const getSingleCompagny = async (req, res) => {
	const { id } = req.params;
	const { rows: compagnies } = await db.query(
		"SELECT *FROM compagnies WHERE compagny_id=$1",
		[id]
	);
	res.status(200).json({ compagnies });
};

const getAllCompagnies = async (req, res) => {
	const { rows: compagnies } = await db.query("SELECT * FROM compagnies");
	res.status(200).json({ compagnies });
};

module.exports = {
	getSingleCompagny,
	getAllCompagnies,
};
