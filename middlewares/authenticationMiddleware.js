const { UnauthenticatedError } = require('../errors');
const jwt = require('jsonwebtoken');

const authenticateUser = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthenticatedError('Pas de token fournit');
  }

  const token = authHeader.split(' ')[1];

  try {
    const { name, userId, role, active } = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    req.user = { userId, name, role, active };

    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentification non valide');
  }
};

const authorizePermissions = (...roles) => {
  return (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new UnauthenticatedError('Accès non autorisé');
    }
    next();
  };
};

const validateUserParams = (req, _res, next) => {
  const isOwner = req.user.userId === user.user_id;
  const isAdminOrModerator = ['admin', 'moderator'].includes(req.user.role);
  const isTargetAdmin = user.role_name === 'admin';

  if (
    !isOwner &&
    (!isAdminOrModerator || (isAdminOrModerator && isTargetAdmin))
  ) {
    throw new Error('Accès non autorisé');
  }

  next();
};

module.exports = { authorizePermissions, authenticateUser, validateUserParams };
