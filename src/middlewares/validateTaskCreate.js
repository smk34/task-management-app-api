import { body, validationResult } from 'express-validator';

const validateTaskCreate = [
  body('taskTitle')
    .exists()
    .withMessage('Task title is required')
    .isLength({ max: 20 })
    .withMessage('Task title must be at most 20 characters long')
    .trim(),

  body('taskDescription')
    .exists()
    .withMessage('Task description is required')
    .isLength({ max: 250 })
    .withMessage('Task description must be at most 250 characters long')
    .trim(),

  body('taskStatus')
    .optional()
    .isIn(['assinged', 'ongoing', 'completed', 'pending'])
    .withMessage('Task status must be one of: assinged, ongoing, completed, pending')
    .trim(),

//   body('assingedToUsers')
//     .optional()
//     .isArray({ min: 1 })
//     .withMessage('Assigned to users must be an array with at least one element')
//     .custom((value) => {
//       return value.every((userId) => mongoose.Types.ObjectId.isValid(userId));
//     })
//     .withMessage('Assigned to users must contain only valid user IDs'),

  body('isBacklogged')
    .optional()
    .isBoolean()
    .withMessage('Is backlogged must be a boolean value')
    .toBoolean(),

  body('isOnHold')
    .optional()
    .isBoolean()
    .withMessage('Is on hold must be a boolean value')
    .toBoolean(),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

export default validateTaskCreate;
