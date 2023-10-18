const db = require('../db');
const { StatusCodes } = require('http-status-codes');

//! route utilisable sans connexion

const getSingleCompagny = async (req, res) => {
  const { id } = req.params;
  const { rows: compagnies } = await db.query(
    'SELECT *FROM compagnies WHERE compagny_id=$1',
    [id]
  );
  res.status(StatusCodes.OK).json({ compagnies });
};

// getAllCompagnies
const getAllCompagnies = async (req, res) => {
  const { rows: compagnies } = await db.query(
    'SELECT * FROM compagnies WHERE is_active= true'
  );
  res.status(StatusCodes.OK).json({ compagnies });
};

// getALLInactivCompagnies
const getAllInactiveCompagnies = async (_req, res) => {
  const { rows: compagnies } = await db.query(
    'SELECT * FROM compagnies WHERE is_active = false'
  );
  const {
    rows: [count],
  } = await db.query(
    'SELECT COUNT(*) AS compagny_name_count FROM compagnies WHERE is_active=false'
  );
  res.status(StatusCodes.OK).json({ compagnies, count });
};

//! Route avec une moderation

// Activation d'une entreprise
const updateActivateCompagny = async (req, res) => {
  const { compagny_id, is_active } = req.body;
  await db.query('UPDATE compagnies SET is_active=$1 WHERE compagny_id=$2 ', [
    is_active,
    compagny_id,
  ]);
  res.status(StatusCodes.OK).json({ msg: 'Compte activé' });
};
// UpdateCompagny
const updateCompagny = async (req, res) => {
  const { name, city, adress, avatar_url, description, compagny_id } = req.body;

  await db.query(
    'UPDATE compagnies SET compagny_name=$1, city=$2, adress=$3, avatar_url=$4, description=$5 WHERE compagny_id=$6 ',
    [name, city, adress, avatar_url, description, compagny_id]
  );

  res.status(StatusCodes.CREATED).json({ msg: 'Société  bien modifié' });
};
// DeleteCompagny

const deleteCompagny = async (req, res) => {
  const { compagny_id } = req.body;
  await db.query('DELETE FROM compagnies WHERE compagny_id=$1', [compagny_id]);
  res.status(StatusCodes.OK).json({ msg: 'Cette compagnie est supprimé' });
};

// CreateCompagny

const createCompagny = async (req, res) => {
  const { name, city, adress, avatar_url, description } = req.body;
  const { rows } = await db.query(
    'INSERT INTO compagnies(compagny_name, city, adress, avatar_url, description) VALUES ($1, $2, $3, $4, $5) RETURNING compagny_id',
    [name, city, adress, avatar_url, description]
  );
  const compagny_id = rows[0].compagny_id;

  const { userId } = req.user;
  await db.query('UPDATE users SET compagny_id=$1  WHERE user_id=$2', [
    compagny_id,
    userId,
  ]);
  res
    .status(StatusCodes.OK)
    .json({ msg: 'Compagnie créée', compagny_id: compagny_id });
};

module.exports = {
  getSingleCompagny,
  getAllCompagnies,
  getAllInactiveCompagnies,
  updateActivateCompagny,
  updateCompagny,
  deleteCompagny,
  createCompagny,
};
