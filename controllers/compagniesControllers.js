const db = require('../db');
const { StatusCodes } = require('http-status-codes');

//! route utilisable sans connexion

// getSingleCompagny
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
const updateActivationCompagnies = async (req, res) => {
  const { id, is_active } = req.body;
  await db.query('UPDATE compagnies SET is_active=$1 WHERE compagny_id=$2 ', [
    is_active,
    id,
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
  await db.query(
    'INSERT INTO compagnies(compagny_name,city,adress,avatar_url,description) VALUES($1,$2,$3,$4,$5)RETURNING *',
    [name, city, adress, avatar_url, description]
  );
  res.status(StatusCodes.OK).json({ msg: 'compagnie créé' });
};

module.exports = {
  getSingleCompagny,
  getAllCompagnies,
  getAllInactiveCompagnies,
  updateActivationCompagnies,
  updateCompagny,
  deleteCompagny,
  createCompagny,
};
