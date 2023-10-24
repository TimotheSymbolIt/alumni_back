const db = require('../db');
const { StatusCodes } = require('http-status-codes');

//getAllStacks
const getAllStacks = async (_req, res) => {
  const { rows: stacks } = await db.query('SELECT * FROM stacks');
  res.status(StatusCodes.OK).json({ stacks });
};

const updateUserStack = async (req, res) => {
  const { userId } = req.user;
  const { stack_id } = req.body;

  if (!stack_id || stack_id.trim() === '') {
    // Si stack_id est vide, supprimer tous les stacks de l'utilisateur
    await db.query('DELETE FROM user_stack WHERE user_id = $1', [userId]);
    res.status(200).send('Stacks vidés');
    return;
  }

  // Récupérer les stacks existants de l'utilisateur
  const { rows: existingStacks } = await db.query(
    'SELECT stack_id FROM user_stack WHERE user_id = $1',
    [userId]
  );

  // Supprimer les stacks qui ne sont pas inclus dans les nouveaux stacks
  const stacksToDelete = existingStacks
    .filter((stack) => !stack_id.includes(stack.stack_id))
    .map((stack) => stack.stack_id);

  for (let id of stacksToDelete) {
    await db.query(
      'DELETE FROM user_stack WHERE user_id = $1 AND stack_id = $2',
      [userId, id]
    );
  }

  // Ajouter les nouveaux stacks à la base de données
  const stacksToInsert = stack_id
    .split(',')
    .filter((id) => !existingStacks.some((stack) => stack.stack_id === id));

  for (let id of stacksToInsert) {
    await db.query(
      'INSERT INTO user_stack (user_id, stack_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
      [userId, id]
    );
  }

  res.status(200).send('Stacks mise à jour');
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
  updateUserStack,
};
