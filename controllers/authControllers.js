const { BadRequestError } = require('../errors');
const db = require('../db');
const { StatusCodes } = require('http-status-codes');
const { createJWT } = require('../utils/tokenUtils.js');
const { hashPassword, comparePassword } = require('../utils/passwordUtils.js');

//! gestion de l'enregistrement  utilisateur

const registerUser = async (req, res) => {
  const {
    name,
    email,
    password,
    training_id,
    description,
    age,
    city,
    professional_experience,
  } = req.body;

  // const {
  //   rows: [{ count }],
  // } = await db.query('SELECT COUNT(*) FROM users');
  // const isFirstAccount = Number(count) === 0;
  // const role = isFirstAccount ? 'admin' : 'alumni';
  const role = 'alumni';
  const hashedPassword = await hashPassword(password);
  const {
    rows: [user],
  } = await db.query(
    'INSERT INTO users (name, email, password, training_id,  description,age,city,professional_experience,role_name)VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *',
    [
      name,
      email,
      hashedPassword,
      training_id,
      description,
      age,
      city,
      professional_experience,
      role,
    ]
  );

  res
    .status(StatusCodes.CREATED)
    .json({ msg: 'Votre compte est en attente de validation ' });
};

//!

//! gestion de la connexion utilisateur

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const {
    rows: [user],
  } = await db.query(
    'SELECT name, user_id, password, role_name,is_active,avatar_url FROM users WHERE email = $1',
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
  delete user.password;

  if (!user.avatar_url) {
    avatar = null;
  }

  const token = createJWT({
    userId: user.user_id,
    name: user.name,
    role: user.role_name,
    active: user.is_active,
    avatar: avatar,
  });

  res.status(StatusCodes.OK).json({ msg: 'Utilisateur connecté', token });
};

//! gestion de l'enregistrement  compagny

const registerCompagny = async (req, res) => {
  const { name, email, password, city, adress, description } = req.body;

  const hashedPassword = await hashPassword(password);
  const {
    rows: [compagny],
  } = await db.query(
    'INSERT INTO compagnies(name,email,password,city,adress,description)VALUES($1,$2,$3,$4,$5,$6) RETURNING *',
    [name, email, hashedPassword, city, adress, description]
  );

  res
    .status(StatusCodes.CREATED)
    .json({ msg: 'Votre compte est en attente de validation' });
};

//! gestion de la connexion compagny

const loginCompagny = async (req, res) => {
  const { email, password } = req.body;
  const {
    rows: [compagny],
  } = await db.query(
    'SELECT compagny_id,name,password,avatar_url,is_active FROM compagnies WHERE email=$1',
    [email]
  );
  if (!compagny) {
    throw new BadRequestError('Identifiants invalides');
  }
  if (compagny.is_active === false) {
    throw new BadRequestError('Votre compte est attente de validation');
  }

  const isPasswordCorrect = await comparePassword(password, compagny.password);

  if (!isPasswordCorrect) {
    throw new BadRequestError('Identifiants invalides');
  }
  delete compagny.password;

  if (!compagny.avatar_url) {
    avatar = null;
  }
  const token = createJWT({
    compagnyId: compagny.user_id,
    name: compagny.name,
    active: compagny.is_active,
    avatar: avatar,
  });

  res.status(StatusCodes.OK).json({ msg: 'Utilisateur connecté', token });
};

module.exports = { registerUser, loginUser, registerCompagny, loginCompagny };
