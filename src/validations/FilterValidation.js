const { body, check, validationResult } = require("express-validator");

module.exports = {
  validate: () => {
    return [
      check("startDate").notEmpty().withMessage("No startDate was specified."),
      check("endDate").notEmpty().withMessage("No endDate was specified."),
      check("minCount")
        .notEmpty()
        .not()
        .isString()
        .withMessage("Please make sure to provide minCount as a number."),
      check("maxCount")
        .notEmpty()
        .not()
        .isString()
        .withMessage("Please make sure to provide maxCount as a number."),
    ];
  },
  checkValidationResult: (req, res, next) => {
    const result = validationResult(req).array({ onlyFirstError: true });
    if (!result.length) {
      return next();
    }
    res.status(422).json({ code: 422, msg: result[0].msg });
  },
};
