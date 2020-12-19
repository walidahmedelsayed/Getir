const router = require("express").Router();
const RecordController = require("../controllers/RecordController");
const FilterValidation = require("../validations/FilterValidation");
module.exports = (app) => {
  router
    .route("/filter")
    .post(
      FilterValidation.validate(),
      FilterValidation.checkValidationResult,
      RecordController.filter
    );
  app.use(router);
};
