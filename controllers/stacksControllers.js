const db = require('../db');
const { StatusCodes } = require('http-status-codes');

//! createStack

const createStack = async (req, res) => {
  const { name } = req.body;
  const { rows: stacks } = await db.query(
    'INSERT INTO stacks(name) VALUES($1) RETURNING *',
    [name]
  );
  res.status(StatusCodes.OK).json({ stacks });
};

//!getAllstacks
const getAllStacks = async (_req, res) => {
  const { rows: stacks } = await db.query('SELECT * FROM stacks');
  res.status(StatusCodes.OK).json({ stacks });
};

//!getSingleStack
const getSingleStack = async (req, res) => {
  const { stack_id } = req.body;
  const { rows: stack } = await db.query(
    'SELECT * FROM stacks WHERE stack_id=$1',
    [stack_id]
  );

  res.status(StatusCodes.OK).json({ stack });
};

//!updateStack
const updateStack = async (req, res) => {
  const { name, stack_id } = req.body;
  const { rows: stack } = await db.query(
    'UPDATE stacks set name = $1 WHERE stack_id= $2 RETURNING *',
    [name, stack_id]
  );

  res.status(StatusCodes.OK).json({ msg: `modification faite par : ${name}` });
};
//!deleteStack

const deleteStack = async (req, res) => {
  const { stack_id } = req.body;
  const { rows: stack } = await db.query(
    'DELETE  FROM stacks WHERE stack_id=$1 RETURNING*',
    [stack_id]
  );
  res.status(StatusCodes.OK).json({ msg: ` stack :${stack_id} bien supprimé` });
};

// Utilisateur
//!getUserAllStacks
const getUserAllStacks = async (req, res) => {
  const { userId } = req.user;
  const { rows: stacks } = await db.query(
    'SELECT users.user_id=$1, stacks stack_id FROM users JOIN user_stack ON users.user_id = user_stack.user_id JOIN stacks ON user_stack.stack_id = stacks.stack_id RETURNING *',
    [userId]
  );
  res.status(StatusCodes.OK).json({ stacks });
};

// //!deleteUserStack
const deleteUserStack = async (req, res) => {
  const { userId } = req.user;
  const { stack_id } = req.body;
  const { rows: stack } = await db.query(
    'DELETE FROM user_stack WHERE stack_id=$1 RETURNING *',
    [stack_id]
  );
  res.status(StatusCodes.OK).json({ stack });
};
// //!addUserStack
const addUserStack = async (req, res) => {
  const { userId } = req.user;
  const { stack_id } = req.body;
  const { rows: stack } = await db.query(
    'INSERT into user_stack VALUES ($1,$2) RETURNING *',
    [userId, stack_id]
  );
  res.status(StatusCodes.OK).json({ stack });
};
module.exports = {
  createStack,
  getSingleStack,
  getAllStacks,
  updateStack,
  deleteStack,
  getUserAllStacks,
  addUserStack,
  deleteUserStack,
};
