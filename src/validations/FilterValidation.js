const { check, validationResult } = require("express-validator");

module.exports = {
  validate: () => {
    return [
      check("startDate")
        .notEmpty()
        .withMessage("No startDate was specified.")
        .isDate()
        .withMessage("The provided startDate is not a valid date."),
      check("endDate")
        .notEmpty()
        .withMessage("No endDate was specified.")
        .isDate()
        .withMessage("The provided endDate is not a valid date."),
      check("minCount")
        .notEmpty()
        .withMessage("No minCount was specified.")
        .not()
        .isString()
        .withMessage("minCount should be a number."),
      check("maxCount")
        .notEmpty()
        .withMessage("No maxCount was specified.")
        .not()
        .isString()
        .withMessage("maxCount should be a number."),
    ];
  },
  checkValidationResult: (req, res, next) => {
    const result = validationResult(req).array({
      onlyFirstError: true,
    });
    if (!result.length) {
      return next();
    }
    res.status(422).json({ code: 422, msg: result[0].msg, records: [] });
  },
};
