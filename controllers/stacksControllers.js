const db = require('../db');
const { StatusCodes } = require('http-status-codes');

//! route utilisable sans connexion

//getAllStacks
const getAllStacks = async (_req, res) => {
  const { rows: stacks } = await db.query('SELECT * FROM stacks');
  res.status(StatusCodes.OK).json({ stacks });
};

//getUserAllStacks

const getUserAllStacks = async (req, res) => {
  const { id } = req.params;
  const { rows: stacks } = await db.query(
    'SELECT stacks.stack_name FROM users JOIN user_stack ON users.user_id = user_stack.user_id JOIN stacks ON user_stack.stack_id = stacks.stack_id WHERE users.user_id = $1',
    [id]
  );
  const userStacks = stacks.map((stack) => {
    return stack.stack_name;
  });
  res.status(StatusCodes.OK).json({ userStacks });
};

//! route utilisable par un membre connecté

//addUserStack
const addUserStack = async (req, res) => {
  const { id } = req.params;
  const { stack_id } = req.body;
  const { rows: stack } = await db.query(
    'INSERT into user_stack VALUES ($1,$2) RETURNING *',
    [id, stack_id]
  );
  res.status(StatusCodes.OK).json({ stack });
};

//deleteUserStack
const deleteUserStack = async (req, res) => {
  const { id } = req.params;
  const { stack_id } = req.body;
  const { rows: stack } = await db.query(
    'DELETE FROM user_stack WHERE user_id=$1 AND RETURNING *',
    [id, stack_id]
  );
  res.status(StatusCodes.OK).json({ stack });
};
//! route moderation

// createStack
const createStack = async (req, res) => {
  const { name } = req.body;
  const { rows: stacks } = await db.query(
    'INSERT INTO stacks(stack_name) VALUES($1) RETURNING *',
    [name]
  );
  res.status(StatusCodes.OK).json({ stacks });
};

//updateStack
const updateStack = async (req, res) => {
  const { name, stack_id } = req.body;
  await db.query(
    'UPDATE stacks set stack_name = $1 WHERE stack_id= $2 RETURNING *',
    [name, stack_id]
  );

  res.status(StatusCodes.OK).json({ msg: `modification faite par : ${name}` });
};

//deleteStack
const deleteStack = async (req, res) => {
  const { stack_id } = req.body;
  await db.query('DELETE  FROM stacks WHERE stack_id=$1 RETURNING*', [
    stack_id,
  ]);
  res.status(StatusCodes.OK).json({ msg: `stack: ${stack_id} bien supprimé` });
};

module.exports = {
  createStack,
  getAllStacks,
  updateStack,
  deleteStack,
  getUserAllStacks,
  addUserStack,
  deleteUserStack,
};
