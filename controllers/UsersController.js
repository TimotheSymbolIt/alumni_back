const db = require('../db/index.js');
const he = require('he');
const { BadRequestError } = require('../errors/index.js');
const { StatusCodes } = require('http-status-codes');
const { hashPassword } = require('../utils/passwordUtils.js');
const { createJWT } = require('../utils/tokenUtils.js');

const getAllUsers = async (req, res) => {
  const { title, training } = req.query;
  const page = Number(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  // Condition WHERE pour le titre
  const whereClauseTitle = title
    ? `AND lower(u.name) LIKE lower('%${title}%')`
    : '';

  // Condition WHERE pour la formation (training)
  const whereClauseTraining = training ? `AND u.training_id = ${training}` : '';

  // Requête SQL pour récupérer les utilisateurs
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
        t.training_name,
        (SELECT json_agg(s.stack_name) FROM stacks s
          JOIN user_stack us ON s.stack_id = us.stack_id
          WHERE us.user_id = u.user_id
        ) AS stacks
      FROM users u
      LEFT JOIN trainings t ON u.training_id = t.training_id
      WHERE u.is_active = true AND u.compagny_id IS NULL
      AND u.role_name != 'admin'
      ${whereClauseTitle}
      ${whereClauseTraining}
      ORDER BY u.user_id ASC
      LIMIT $1 OFFSET $2
    `;

  const values = [limit, offset];

  const { rows: users } = await db.query(userQuery, values);

  const {
    rows: [count],
  } = await db.query(
    `
      SELECT COUNT(*) AS count
      FROM users u
      WHERE u.is_active = true AND u.compagny_id IS NULL
      AND u.role_name != 'admin'
    `
  );

  const numberOfPages = Math.ceil(count.count / limit);

  // Décodage des champs description et professional_experience
  users.map((user) => {
    if (user.description) {
      user.description = he.decode(user.description);
    }
    if (user.professional_experience) {
      user.professional_experience = he.decode(user.professional_experience);
    }
  });

  res.status(StatusCodes.OK).json({ users, page, title, numberOfPages });
};

// retourner l'utilisateur courant
const getCurrentUser = async (req, res) => {
  const userId = req.user.userId;

  const userQuery = `
  SELECT
    u.user_id,
    u.name,
    u.email,
    u.age,
    u.role_name,
    u.is_active,
    u.description,
    u.professional_experience,
    u.avatar_url,
    c.compagny_name,
    t.training_name,
    (SELECT json_agg(jsonb_build_object('stack_id', s.stack_id, 'stack_name', s.stack_name)) FROM stacks s WHERE s.stack_id IN (SELECT us.stack_id FROM user_stack us WHERE us.user_id = $1)) AS stacks
  FROM users u
  LEFT JOIN compagnies c ON u.compagny_id = c.compagny_id
  LEFT JOIN trainings t ON u.training_id = t.training_id
  WHERE u.user_id = $1;
`;

  const {
    rows: [result],
  } = await db.query(userQuery, [userId]);

  delete result.password;

  // déséchaper user description et professional_experience
  if (result.description) {
    result.description = he.decode(result.description);
  }
  if (result.professional_experience) {
    result.professional_experience = he.decode(result.professional_experience);
  }

  const user = {
    user_id: result.user_id,
    name: result.name,
    email: result.email,
    role: result.role_name,
    age: result.age,
    active: result.is_active,
    avatar: result.avatar_url,
    compagny_name: result.compagny_name,
    training_name: result.training_name,
    description: result.description,
    professional_experience: result.professional_experience,
    stacks: result.stacks,
  };

  res.status(StatusCodes.OK).json({ user });
};

const getAllInactiveUsers = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = 10;
  const offset = (page - 1) * limit;

  const query = `
    SELECT name,email,is_active,user_id,role_name FROM users
    WHERE is_active = false
    LIMIT $1
    OFFSET $2
  `;
  const values = [limit, offset];

  const { rows: users } = await db.query(query, values);

  const {
    rows: [count],
  } = await db.query(
    'SELECT COUNT(*) AS inactive_count FROM users WHERE is_active = false'
  );

  const numberOfPages = Math.ceil(count.inactive_count / limit);

  res.status(StatusCodes.OK).json({ users, count, page, numberOfPages });
};

const updateActivationUser = async (req, res) => {
  const { id, role } = req.body;

  const {
    rows: [user],
  } = await db.query(
    'UPDATE users SET is_active = NOT is_active,role_name=$1 WHERE user_id = $2 RETURNING is_active',
    [role, id]
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

  // déséchaper user description et professional_experience
  if (result.description) {
    result.description = he.decode(result.description);
  }
  if (result.professional_experience) {
    result.professional_experience = he.decode(result.professional_experience);
  }

  res.status(StatusCodes.OK).json({ user: result });
};

// updateUser
const updateUser = async (req, res) => {
  const { userId } = req.user;
  const updateData = req.body;

  delete updateData.user_id;

  // Vérifie si l'e-mail a changé
  const userMail = (
    await db.query('SELECT email FROM users WHERE user_id = $1', [userId])
  ).rows[0];

  if (userMail.email !== updateData.email) {
    // Vérifie l'unicité de l'e-mail
    const alreadyExist = await db.query(
      'SELECT email FROM users WHERE email = $1',
      [updateData.email]
    );
    if (alreadyExist.rows[0]) {
      throw new BadRequestError('Cet email existe déjà');
    }
  }

  // Prépare les champs à mettre à jour
  const updateFields = {};
  const values = [];

  for (const key in updateData) {
    if (updateData.hasOwnProperty(key)) {
      // Si la clé est "password", hachez le mot de passe
      if (key === 'password') {
        updateFields[key] = await hashPassword(updateData[key]);
      } else {
        updateFields[key] = updateData[key];
      }
      values.push(updateFields[key]);
    }
  }

  // Construit la requête SQL dynamique
  const queryValues = [...values, userId];
  let queryText = 'UPDATE users SET ';
  let updateColumns = Object.keys(updateFields);

  for (let i = 0; i < updateColumns.length; i++) {
    queryText += `${updateColumns[i]} = $${i + 1}`;
    if (i < updateColumns.length - 1) {
      queryText += ', ';
    }
  }

  queryText += ` WHERE user_id = $${updateColumns.length + 1} RETURNING *`;

  // Exécute la requête SQL
  const {
    rows: [user],
  } = await db.query(queryText, queryValues);

  // Recrée le token
  const token = createJWT({
    userId: user.user_id,
    name: user.name,
    role: user.role_name,
    active: user.is_active,
    compagny_id: user.compagny_id,
  });

  // Répond avec le token
  res
    .status(StatusCodes.CREATED)
    .json({ msg: 'Compte utilisateur bien modifié', token });
};

// deleteUser
const deleteUser = async (req, res) => {
  const { id } = req.params;

  //  supprimer ses stacks
  await db.query('DELETE FROM user_stack WHERE user_id = $1', [id]);

  //  supprimer l'utilisateur
  await db.query('DELETE FROM users WHERE user_id = $1', [id]);

  res.status(StatusCodes.OK).json({ msg: 'Compte utilisateur bien supprimé' });
};

// devenir mentor
const updateMentoringUser = async (req, res) => {
  const { userId } = req.user;

  await db.query('UPDATE users SET role_name = $1 WHERE user_id = $2', [
    'mentor',
    userId,
  ]);

  res.status(StatusCodes.OK).json({ msg: 'Compte utilisateur bien modifié' });
};

module.exports = {
  getAllUsers,
  getCurrentUser,
  getAllInactiveUsers,
  updateActivationUser,
  getSingleUser,
  updateUser,
  deleteUser,
  updateMentoringUser,
};
