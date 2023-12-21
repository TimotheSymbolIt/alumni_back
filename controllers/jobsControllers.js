const db = require("../db");
const { StatusCodes } = require("http-status-codes");

const getAllJobs = async (req, res) => {
	let query = "SELECT * FROM jobs";
	const { rows: jobs } = await db.query(query);
	res.status(200).json({ jobs });
};

const getJobById = async (req, res) => {
	const { id } = req.params;
	const {
		rows: [job],
	} = await db.query(
		" SELECT j.*, c.compagny_name, c.adress, c.avatar_url FROM jobs j JOIN compagnies c ON j.compagny_id = c.compagny_id WHERE j.job_id = $1 ",
		[id]
	);
	res.status(200).json({ job });
};

module.exports = {
	getJobById,
	getAllJobs,
};
