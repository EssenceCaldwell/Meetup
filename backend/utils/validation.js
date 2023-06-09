const { validationResult } = require('express-validator');
const { isISO8601 } = require('validator');
const { check } = require('express-validator');
// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);
  console.log(validationErrors)
  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.param] = error.msg);

    const err = Error("Validation Error");
    err.errors = errors;
    err.status = 400;
    err.title = "Validation Error";
    next(err);
  }
  next();
};

const validateSignup = [
  check('email')
    .isEmail()
    .withMessage('Invalid email'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('First Name is required'),
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Last Name is required'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

const validateLogin = [
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Password is required'),
  handleValidationErrors
];

const validateGroup = [
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ max: 60 })
    .withMessage("Name must be 60 characters or less"),
  check("about")
    .exists({ checkFalsy: true })
    .isLength({ min: 50 })
    .withMessage("About must be 50 characters or more"),
  check("type")
    .exists({ checkFalsy: true })
    .isIn(["Online", "In person"])
    .withMessage("Type must be 'Online' or 'In person'"),
  check("private").isBoolean().withMessage("Private must be a boolean"),
  check("city").exists({ checkFalsy: true }).withMessage("City is required"),
  check("state").exists({ checkFalsy: true }).withMessage("State is required"),
  handleValidationErrors,
];

const validateDate = [
  check('startDate')
  .exists({checkNull: false})
  .isDate()
  .withMessage("Invalid date"),
  check('endDate')
  .exists({checkNull: false})
  .isDate()
  .withMessage("Invalid date"),
  handleValidationErrors
]

const validateVenue = [
    check('address')
    .exists({checkFalsy: true })
    .isString()
    .withMessage("Street address is required"),
    check('city')
    .isString()
    .exists({checkFalsy: true })
    .withMessage("City is required"),
    check('state')
    .exists({checkFalsy: true })
    .isString()
    .withMessage("State is required"),
    check('lat')
    .exists({checkFalsy: true })
    .isDecimal()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude is not valid"),
    check('lng')
    .exists({checkFalsy: true })
    .isDecimal()
    .isFloat({ min: -180, max: 180 })
    .withMessage('Longitude is not valid'),
    handleValidationErrors
];

const validateEvent = [
  check("name")
  .exists({checkFalsy: true})
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters"),
  check("venueId")
    .exists({ checkFalsy: true })
    .withMessage("Venue does not exist"),
  check("type")
    .exists({ checkFalsy: true })
    .isIn(["Online", "In person"])
    .withMessage("Type must be Online or In person"),
  check("capacity")
    .exists({ checkFalsy: true })
    .isNumeric()
    .withMessage("Capacity must be an integer"),
  check("price")
    .exists({ checkFalsy: true })
    .isDecimal()
    .withMessage("Price is invalid"),
  check("description")
    .exists({ checkFalsy: true })
    .withMessage("Description is required"),
  check("startDate")
    .exists({ checkFalsy: true })
    .isISO8601()
    .withMessage("Please add a start date"),
  check("endDate")
    .exists({ checkFalsy: true })
    .isISO8601()
    .withMessage("Please add an end date"),
  handleValidationErrors,
];

const validateMembership = [
  check('memberId')
  .exists({checkFalsy: true})
  .withMessage("User couldn't be found")
];

module.exports = {
  handleValidationErrors,
  validateLogin,
  validateSignup,
  validateGroup,
  validateVenue,
  validateEvent,
  validateDate
};
