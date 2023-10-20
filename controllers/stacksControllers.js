const db = require('../db');
const { StatusCodes } = require('http-status-codes');

//getAllStacks
const getAllStacks = async (_req, res) => {
  const { rows: stacks } = await db.query('SELECT * FROM stacks');
  res.status(StatusCodes.OK).json({ stacks });
};

//addUserStack
const addUserStack = async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;
  const { rows: stack } = await db.query(
    'INSERT into user_stack VALUES ($1,$2) RETURNING *',
    [userId, id]
  );
  res.status(StatusCodes.OK).json({ stack });
};

//deleteUserStack
const deleteUserStack = async (req, res) => {
  const { userId } = req.user;
  const { id } = req.params;

  const { rows: stack } = await db.query(
    'DELETE FROM user_stack WHERE user_id=$1 AND stack_id=$2 RETURNING *',
    [userId, id]
  );
  res.status(StatusCodes.OK).json({ stack });
};

// createStack
const createStack = async (req, res) => {
  const { name } = req.body;
  const { rows: stacks } = await db.query(
    'INSERT INTO stacks(stack_name) VALUES($1) RETURNING *',
    [name]
  );
  res.status(StatusCodes.CREATED).json({ stacks });
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
  addUserStack,
  deleteUserStack,
};
