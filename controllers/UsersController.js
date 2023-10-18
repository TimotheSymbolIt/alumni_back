const db = require('../db');
const { BadRequestError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const { hashPassword } = require('../utils/passwordUtils.js');
const { createJWT } = require('../utils/tokenUtils.js');

const getAllUsers = async (_req, res) => {
  const userQuery = `
    SELECT
      u.user_id,
      u.name,
      u.email,
      u.role_name,
      u.avatar_url,
      u.description,
      u.age,
      u.city,
      u.professional_experience,
      c.compagny_name,
      t.training_name,
      (SELECT json_agg(s.stack_name) FROM stacks s
        JOIN user_stack us ON s.stack_id = us.stack_id
        WHERE us.user_id = u.user_id
      ) AS stacks
    FROM users u
    LEFT JOIN compagnies c ON u.compagny_id = c.compagny_id
    LEFT JOIN trainings t ON u.training_id = t.training_id
    WHERE u.is_active = true AND u.compagny_id IS NULL;
  `;

  const { rows: users } = await db.query(userQuery);

  res.status(StatusCodes.OK).json({ users });
};

// retourner l'utilisateur courant
const getCurrentUser = async (req, res) => {
  const userId = req.user.userId;

  const userQuery = `
    SELECT
      u.name,
      u.email,
      u.age,
      u.role_name,
      u.is_active,
      u.description,
      u.avatar_url,
      c.compagny_name,
      t.training_name,
      (SELECT json_agg(stack_name) FROM stacks WHERE stack_id IN (SELECT stack_id FROM user_stack WHERE user_id = $1)) AS stacks
    FROM users u
    LEFT JOIN compagnies c ON u.compagny_id = c.compagny_id
    LEFT JOIN trainings t ON u.training_id = t.training_id
    WHERE u.user_id = $1;
  `;

  const {
    rows: [result],
  } = await db.query(userQuery, [userId]);

  delete result.password;

  const user = {
    name: result.name,
    email: result.email,
    role: result.role_name,
    age: result.age,
    active: result.is_active,
    avatar: result.avatar_url,
    compagny_name: result.compagny_name,
    training_name: result.training_name,
    description: result.description,
    stacks: result.stacks,
  };

  res.status(StatusCodes.OK).json({ user });
};

const getAllInactiveUsers = async (_req, res) => {
  const {
    rows: [users],
  } = await db.query('SELECT * FROM users WHERE is_active = false');

  delete users.password;
  const {
    rows: [count],
  } = await db.query(
    'SELECT COUNT(*) AS user_count FROM users WHERE is_active = false'
  );
  res.status(StatusCodes.OK).json({ users, count });
};

const updateActivationUser = async (req, res) => {
  const { id, is_active } = req.body;

  const {
    rows: [user],
  } = await db.query(
    'UPDATE users SET is_active = $1 WHERE user_id = $2 RETURNING is_active',
    [is_active, id]
  );

  res.status(StatusCodes.OK).json({ user });
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;

  const userQuery = `
    SELECT
      u.user_id,
      u.name,
      u.email,
      u.role_name,
      u.avatar_url,
      u.description,
      u.age,
      u.city,
      u.professional_experience,
      c.compagny_name,
      t.training_name,
      (SELECT json_agg(stack_name) FROM stacks WHERE stack_id IN (SELECT stack_id FROM user_stack WHERE user_id = $1)) AS stacks
    FROM users u
    LEFT JOIN compagnies c ON u.compagny_id = c.compagny_id
    LEFT JOIN trainings t ON u.training_id = t.training_id
    WHERE u.user_id = $1 AND u.is_active = true AND u.compagny_id IS NULL
  `;

  const {
    rows: [result],
  } = await db.query(userQuery, [id]);

  // Supprimez le mot de passe des données utilisateur
  delete result.password;

  res.status(StatusCodes.OK).json({ user: result });
};

// updateUser
const updateUser = async (req, res) => {
  const {
    user_id,
    name,
    email,
    password,
    training_id,
    description,
    age,
    city,
    professional_experience,
    avatar_url,
    role_name,
    compagny_id,
  } = req.body;

  // hasher le mot de passe
  const hashedPassword = await hashPassword(password);

  //controle si l'email de l'utilisateur est changé
  const {
    rows: [userMail],
  } = await db.query('SELECT * FROM users WHERE user_id = $1', [user_id]);

  // controle si l'email existe déjà
  if (userMail.email !== email) {
    const alreadyExist = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    if (alreadyExist.rows[0]) {
      throw new BadRequestError('Cet email existe déjà');
    }
  }

  const {
    rows: [user],
  } = await db.query(
    'UPDATE users SET name = $1, email = $2, password = $3, training_id = $4, description = $5, age = $6, city = $7, professional_experience = $8, avatar_url = $9, role_name = $10, compagny_id = $11 WHERE user_id = $12 RETURNING *',
    [
      name,
      email,
      hashedPassword,
      training_id,
      description,
      age,
      city,
      professional_experience,
      avatar_url,
      role_name,
      compagny_id,
      user_id,
    ]
  );

  // recrée le token
  const token = createJWT({
    userId: user.user_id,
    name: user.name,
    role: user.role_name,
    active: user.is_active,
    compagny_id: user.compagny_id,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ msg: 'Compte utilisateur bien modifié', token });
};

// deleteUser
const deleteUser = async (req, res) => {
  const { userId } = req.user;

  await db.query('DELETE FROM users WHERE user_id = $1', [userId]);
  res.status(StatusCodes.OK).json({ msg: 'Compte utilisateur bien supprimé' });
};

module.exports = {
  getAllUsers,
  getCurrentUser,
  getAllInactiveUsers,
  updateActivationUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
