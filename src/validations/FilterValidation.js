const { check, validationResult } = require("express-validator");
const Messages = require("../constants/Messages");

module.exports = {
  validate: () => {
    return [
      check("startDate")
        .notEmpty()
        .withMessage(Messages.MissingStartDate)
        .isDate()
        .withMessage(Messages.InvalidDateStartDate)
        .matches(/^(\d{4})(-)(\d{1,2})(-)(\d{1,2})$/)
        .withMessage(Messages.InvalidDateFormatStartDate),
      check("endDate")
        .notEmpty()
        .withMessage(Messages.MissingEndDate)
        .isDate()
        .withMessage(Messages.InvalidDateEndDate)
        .matches(/^(\d{4})(-)(\d{1,2})(-)(\d{1,2})$/)
        .withMessage(Messages.InvalidDateFormatEndDate),
      check("minCount")
        .notEmpty()
        .withMessage(Messages.MissingMinCount)
        .not()
        .isString()
        .withMessage(Messages.InvalidMinCountType),
      check("maxCount")
        .notEmpty()
        .withMessage(Messages.MissingMaxCount)
        .not()
        .isString()
        .withMessage(Messages.InvalidMaxCountType),
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
