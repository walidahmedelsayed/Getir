const Record = require("../models/Record");

const filter = async (req, res) => {
  let { startDate, endDate, minCount, maxCount } = req.body;
  /**
   * The aggregations stages:
   * =========================
   * 1- Filter the records based on the specified date range to minimize the document to process.
   * 2- Get the totalCount for each Record.
   * 3- Filter the records based on the specified count range.
   */
  Record.aggregate([
    {
      $match: {
        createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
      },
    },
    {
      $project: {
        _id: 0,
        key: 1,
        createdAt: 1,
        totalCount: {
          $reduce: {
            input: "$counts",
            initialValue: 0,
            in: { $sum: ["$$value", "$$this"] },
          },
        },
      },
    },
    {
      $match: {
        totalCount: { $gte: minCount, $lte: maxCount },
      },
    },
  ]).exec((err, records) => {
    if (err) {
      res.status(500).json({
        code: 500,
        msg: "Something went wrong while trying to retrieve data.",
        records: [],
      });
    } else {
      res.status(200).json({ code: 0, msg: "Success", records });
    }
  });
};

module.exports = {
  filter,
};
