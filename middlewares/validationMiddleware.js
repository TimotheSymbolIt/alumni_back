const { body, param, validationResult } = require('express-validator');
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require('../errors/index.js');
const db = require('../db');

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, _res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);

        if (errorMessages[0].startsWith('Accès non')) {
          throw new UnauthorizedError(errorMessages);
        }

        if (errorMessages[0].startsWith("Pas d'utilisateur")) {
          throw new NotFoundError(errorMessages);
        }
        if (errorMessages[0].startsWith('Id non va')) {
          throw new NotFoundError(errorMessages);
        }

        throw new BadRequestError(errorMessages);
      }

      next();
    },
  ];
};

const validateRegisterInput = withValidationErrors([
  body('name').trim().notEmpty().withMessage('Le nom est requis').escape(),
  body('email')
    .trim()
    .notEmpty()
    .withMessage("L'email est requis")
    .isEmail()
    .withMessage("Format d'email non valide")
    .escape()
    .custom(async (email) => {
      const {
        rows: [user],
      } = await db.query('SELECT * FROM users WHERE email = $1', [email]);

      if (user) {
        throw new Error("L'email existe déjà");
      }
    }),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Le mot de passe est requis')
    .escape(),
  body('description').trim().escape(),
]);

const validateLoginInput = withValidationErrors([
  body('email')
    .trim()
    .notEmpty()
    .withMessage("L'email est requis")
    .isEmail()
    .withMessage("Format d'email non valide")
    .escape(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Le mot de passe est requis')
    .escape(),
]);

const validateUserParams = withValidationErrors(
  param('id').custom(async (id, { req }) => {
    if (isNaN(Number(id))) {
      throw new Error('Id non valide');
    }
    const {
      rows: [user],
    } = await db.query(
      'SELECT user_id, role_name FROM users WHERE user_id = $1',
      [id]
    );

    if (!user) {
      throw new Error(`Pas d'utilisateur avec l'id ${id}`);
    }

    const isOwner = req.user.userId === user.user_id;
    const isAdminOrModerator = ['admin', 'moderator'].includes(req.user.role);
    const isTargetAdmin = user.role_name === 'admin';

    if (
      !isOwner &&
      (!isAdminOrModerator || (isAdminOrModerator && isTargetAdmin))
    ) {
      throw new Error('Accès non autorisé');
    }
  })
);

const validateUpdateUserInput = withValidationErrors([
  body('name').trim().notEmpty().withMessage('Le nom est requis').escape(),
  body('email')
    .trim()
    .notEmpty()
    .withMessage("L'email est requis")
    .isEmail()
    .withMessage("Format d'email non valide")
    .escape(),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Le mot de passe est requis')
    .escape(),
  body('description').trim().escape(),
  body('age').trim().escape(),
  body('city').trim().escape(),
  body('professional_experience').trim().escape(),
]);

const validateStackInput = withValidationErrors([
  body('name').trim().notEmpty().withMessage('Le nom est requis').escape(),
]);

const validateTrainingInput = withValidationErrors([
  body('name').trim().notEmpty().withMessage('Le nom est requis').escape(),
]);

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateUserParams,
  validateUpdateUserInput,
  validateStackInput,
  validateTrainingInput,
};
