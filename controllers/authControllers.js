const { BadRequestError } = require('../errors');
const db = require('../db');
const { StatusCodes } = require('http-status-codes');
const { createJWT } = require('../utils/tokenUtils.js');
const { hashPassword, comparePassword } = require('../utils/passwordUtils.js');

//! gestion de l'enregistrement  utilisateur

const registerUser = async (req, res) => {
  const { name, email, password, training_id, description, compagny_id } =
    req.body;

  const {
    rows: [{ count }],
  } = await db.query('SELECT COUNT(*) FROM users');
  const isFirstAccount = Number(count) === 0;
  const role = isFirstAccount ? 'admin' : 'alumni';
  const is_active = isFirstAccount ? true : false;
  const hashedPassword = await hashPassword(password);

  const {
    rows: [user],
  } = await db.query(
    'INSERT INTO users (name, email,is_active, password, training_id,description,compagny_id,role_name)VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
    [
      name,
      email,
      is_active,
      hashedPassword,
      training_id,
      description,
      compagny_id,
      role,
    ]
  );

  res
    .status(StatusCodes.CREATED)
    .json({ msg: 'Votre compte est en attente de validation ' });
};

//! gestion de la connexion utilisateur

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const {
    rows: [user],
  } = await db.query(
    'SELECT name, user_id, password, role_name,is_active,compagny_id FROM users WHERE email = $1',
    [email]
  );

  if (!user) {
    throw new BadRequestError('Identifiants invalides');
  }
  if (user.is_active === false) {
    throw new BadRequestError('Votre compte est attente de validation');
  }

  const isPasswordCorrect = await comparePassword(password, user.password);

  if (!isPasswordCorrect) {
    throw new BadRequestError('Identifiants invalides');
  }

  const token = createJWT({
    userId: user.user_id,
    name: user.name,
    role: user.role_name,
    active: user.is_active,
    compagny_id: user.compagny_id,
  });

  res.status(StatusCodes.OK).json({ msg: 'Utilisateur connecté', token });
};

module.exports = { registerUser, loginUser };
