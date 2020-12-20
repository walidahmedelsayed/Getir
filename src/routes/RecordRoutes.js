const router = require("express").Router();
const RecordController = require("../controllers/RecordController");
const FilterValidation = require("../validations/FilterValidation");

//Apply the input parameters validation as a middleware before routing to the filter method
// /POST route
module.exports = (app) => {
  router
    .route("/")
    .post(
      FilterValidation.validate(),
      FilterValidation.checkValidationResult,
      RecordController.filter
    );
  app.use(router);
};
