const Record = require("../models/Record");

const filter = async (req, res) => {
  let { startDate, endDate, minCount, maxCount } = req.body;
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
    if (err) throw err;
    console.log(records);
    res.status(200).json({ code: 0, msg: "Success", records });
  });
};

module.exports = {
  filter,
};
