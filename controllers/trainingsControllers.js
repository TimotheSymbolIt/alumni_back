//! gestion des formations

const db = require('../db');
const { StatusCodes } = require('http-status-codes');

const getAllTrainings = async (_req, res) => {
  const { rows: trainings } = await db.query('SELECT * FROM trainings');
  res.status(StatusCodes.OK).json({ trainings });
};

const createTraining = async (req, res) => {
  const { name } = req.body;
  await db.query(
    'INSERT INTO trainings(training_name) VALUES($1) RETURNING *',
    [name]
  );
  res.status(StatusCodes.OK).json({ msg: `${name} Bien ajouté` });
};

const updateTraining = async (req, res) => {
  const { name, training_id } = req.body;
  await db.query(
    'UPDATE trainings SET training_name = $1 WHERE training_id = $2 RETURNING *',
    [name, training_id]
  );
  res.status(StatusCodes.OK).json({ msg: `Bien modifié en ${name}` });
};

const deleteTraining = async (req, res) => {
  const { training_id, name } = req.body;
  await db.query('DELETE FROM trainings WHERE training_id = $1', [training_id]);
  res.status(StatusCodes.OK).json({ msg: `Formation ${name} supprimée` });
};

module.exports = {
  getAllTrainings,
  createTraining,
  updateTraining,
  deleteTraining,
};
