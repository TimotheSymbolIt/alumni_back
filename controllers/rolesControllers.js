const db = require('../db');
const { StatusCodes } = require('http-status-codes');

//! route avec une modération

// getAllRoles

const getAllRoles = async (req, res) => {
  const { rows: roles } = await db.query('SELECT *FROM roles');
  res.status(StatusCodes.OK).json({ roles });
  console.log(roles);
};
module.exports = { getAllRoles };
