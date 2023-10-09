//* gestion de connexion base de données

const { Pool } = require('pg');

const pool = new Pool({ ssl: process.env.NODE_ENV === 'production' });

module.exports = {
  query: (text, params) => pool.query(text, params),
};
