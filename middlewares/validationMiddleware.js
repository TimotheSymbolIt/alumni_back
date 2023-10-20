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
  body('description').optional().trim().escape(),
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

const validateUpdateUserInput = withValidationErrors([
  body('name').optional().trim().escape(),
  body('email')
    .optional()
    .isEmail()
    .withMessage("Format d'email non valide")
    .trim()
    .escape(),
  body('password').optional().trim().escape(),
  body('description').optional().trim().escape(),
  body('age').optional().isInt().trim().escape(),
  body('city').optional().trim().escape(),
  body('professional_experience').optional().trim().escape(),
]);

const validateStackInput = withValidationErrors([
  body('name').trim().notEmpty().withMessage('Le nom est requis').escape(),
]);

const validateTrainingInput = withValidationErrors([
  body('name').trim().notEmpty().withMessage('Le nom est requis').escape(),
]);

const validateCompagnyInput = withValidationErrors([
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Le nom de la société est requis')
    .escape(),
  body('city').trim().notEmpty().withMessage('La ville est requise').escape(),
  body('adress').trim().escape(),
  body('description').trim().escape(),
]);

const validateEventInput = withValidationErrors([
  body('name').trim().notEmpty().withMessage('Le nom est requis').escape(),
  body('description').trim().escape(),
  body('date').trim().escape(),
]);

const validateJobInput = withValidationErrors([
  body('title').trim().escape(),
  body('description').trim().escape(),
  body('type_job')
    .trim()
    .notEmpty()
    .withMessage('veuillez selectionner un type d annonce')
    .escape(),
]);
module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateUpdateUserInput,
  validateStackInput,
  validateTrainingInput,
  validateCompagnyInput,
  validateEventInput,
  validateJobInput,
};
