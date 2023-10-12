const db = require('../db');
const { BadRequestError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const { hashPassword } = require('../utils/passwordUtils.js');
const { createJWT } = require('../utils/tokenUtils.js');

// Retourner tout les utilisateurs actifs qui n'ont pas de compagnie
const getAllUsers = async (_req, res) => {
  const {
    rows: [user],
  } = await db.query(`
    SELECT users.*, trainings.name AS training_name
    FROM users
    LEFT JOIN trainings ON users.training_id = trainings.training_id
    WHERE users.is_active = true AND users.compagny_id IS NULL
  `);
  delete user.password, delete user.email;
  delete user.training_id;
  res.status(StatusCodes.OK).json({ user });
};

// Retourner tout les utilisateurs inactifs
const getAllInactiveUsers = async (_req, res) => {
  const {
    rows: [user],
  } = await db.query('SELECT * FROM users WHERE is_active = false');

  delete user.password;
  const {
    rows: [count],
  } = await db.query(
    'SELECT COUNT(*) AS user_count FROM users WHERE is_active = false'
  );
  res.status(StatusCodes.OK).json({ user, count });
};

// modifier l'activation de l'utilisateur
const updateActivationUser = async (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  const {
    rows: [user],
  } = await db.query(
    'UPDATE users SET is_active = $1 WHERE user_id = $2 RETURNING is_active',
    [is_active, id]
  );

  res.status(StatusCodes.OK).json({ user });
};

// getSingleUser
const getSingleUser = async (req, res) => {
  const { id } = req.params;
  const {
    rows: [user],
  } = await db.query(
    'SELECT * FROM users WHERE user_id = $1 AND is_active = true',
    [id]
  );
  res.status(StatusCodes.OK).json({ user });
};

// updateUser
const updateUser = async (req, res) => {
  const { id } = req.params;
  const {
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
  } = await db.query('SELECT * FROM users WHERE user_id = $1', [id]);

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
      id,
    ]
  );

  // recrée le token

  const token = createJWT({
    userId: user.user_id,
    name: user.name,
    role: user.role_name,
    active: user.is_active,
    avatar: user.avatar_url,
    compagny_id: compagny_id,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ msg: 'Compte utilisateur bien modifié', token });
};

// deleteUser
const deleteUser = async (req, res) => {
  const { id } = req.params;

  await db.query('DELETE FROM users WHERE user_id = $1', [id]);
  res.status(StatusCodes.OK).json({ msg: 'Compte utilisateur bien supprimé' });
};

module.exports = {
  getAllUsers,
  getAllInactiveUsers,
  updateActivationUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
