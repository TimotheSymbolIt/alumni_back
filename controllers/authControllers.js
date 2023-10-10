const { BadRequestError } = require('../errors');
const db = require('../db');
const { StatusCodes } = require('http-status-codes');
const { createJWT } = require('../utils/tokenUtils.js');
const { hashPassword, comparePassword } = require('../utils/passwordUtils.js');

//! gestion de l'enregistrement  utilisateur

//! gestion de la connexion utilisateur

//! gestion de l'enregistrement  compagny

//! gestion de la connexion compagny
