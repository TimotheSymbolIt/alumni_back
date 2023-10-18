//! gestion des offres emplois
//! gestion des offres emplois
const db = require('../db');
const { StatusCodes } = require('http-status-codes');

//! route utilisable par un membre connecté

//getAllJobs
const getAllJobs = async (_req, res) => {
  const { rows: jobs } = await db.query(
    'SELECT j.*, c.compagny_name FROM jobs AS j JOIN compagnies AS c ON j.compagny_id = c.compagny_id WHERE j.is_active = true ORDER BY j.create_at DESC;'
  );
  res.status(StatusCodes.OK).json({ jobs });
};

// getSingleJob
const getSingleJob = async (req, res) => {
  const { job_id } = req.params;
  await db.query('SELECT * FROM jobs WHERE job_id=$1', [job_id]);
  res.status(StatusCodes.OK).json({ job });
};

// getAllInactivJobs
const getAllInactiveJobs = async (_req, res) => {
  const { rows: jobs } = await db.query(
    'SELECT * FROM jobs WHERE is_active=false'
  );
  const {
    rows: [count],
  } = await db.query(
    'SELECT COUNT(*) AS compagny_id_count FROM jobs WHERE is_active=false'
  );
  res.status(StatusCodes.OK).json({ jobs, count });
};

// Activation d'un job
const updateActivateJob = async (req, res) => {
  const { job_id, is_active } = req.body;
  await db.query('UPDATE jobs SET is_active=$1 WHERE job_id=$2 ', [
    is_active,
    job_id,
  ]);
  res.status(StatusCodes.OK).json({ msg: 'annonce validée' });
};

// Supprimer un job
const deleteJob = async (req, res) => {
  const { job_id } = req.body;
  await db.query('DELETE FROM jobs WHERE job_id=$1', [job_id]);
  res.status(StatusCodes.OK).json({ msg: 'Job supprimé' });
};

// Creation d'un job
const createJob = async (req, res) => {
  const { compagny_id } = req.user;
  const { title, description, type_job } = req.body;
  await db.query(
    'INSERT INTO jobs(title, description, type_job, compagny_id) VALUES ($1, $2, $3, $4) ',
    [title, description, type_job, compagny_id]
  );
  res.status(StatusCodes.OK).json({ msg: 'Annonce enregister' });
};

// Mise a jour d'un job
const updateJob = async (req, res) => {
  const { title, description, type_job, job_id } = req.body;
  await db.query(
    'UPDATE jobs SET title=$1, description=$2, type_job=$3 WHERE job_id=$4',
    [title, description, type_job, job_id]
  );
  res.status(StatusCodes.CREATED).json({ msg: 'Annonce  modifié' });
};

module.exports = {
  getSingleJob,
  getAllJobs,
  getAllInactiveJobs,
  updateActivateJob,
  updateJob,
  deleteJob,
  createJob,
};
