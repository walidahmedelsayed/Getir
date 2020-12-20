const app = require("../../app");
const supertest = require("supertest");
const request = supertest(app);
const mongoose = require("mongoose");
const Record = require("../models/Record");
const Messages = require("../constants/Messages");

beforeAll(async () => {
  await mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  mongoose.connection.close();
});

describe("Basic Setup", function () {
  it("Testing to see if Jest works", () => {
    expect(1).toBe(1);
  });
});

describe("Record /Post suite", function () {
  it("Should run basic filtration", async (done) => {
    const res = await request.post("/").send({
      startDate: "2016-12-21",
      endDate: "2018-02-02",
      minCount: 0,
      maxCount: 0,
    });
    expect((res.body.msg = "Success"));
    expect(res.body.records.length).toBe(0);
    done();
  });

  it("Should retrieve the right number of filtered record(s)", async (done) => {
    const res = await request.post("/").send({
      startDate: "2016-12-21",
      endDate: "2018-02-02",
      minCount: 110,
      maxCount: 116,
    });
    expect(res.statusCode).toBe(200);
    expect((res.body.records[0].msg = "Success"));
    expect(res.body.records.length).toBe(1);
    done();
  });

  it("Should retrieve the filtered record(s) with the right totalCount", async (done) => {
    const record = await Record.findOne({ key: "LSyjwviN" });
    const res = await request.post("/").send({
      startDate: "2016-12-21",
      endDate: "2018-02-02",
      minCount: 110,
      maxCount: 116,
    });

    const calculatedCount = record.counts.reduce(
      (acc, count) => (acc += count),
      0
    );
    expect(calculatedCount == res.body.records[0].totalCount).toBeTruthy();
    done();
  });

  it("Should retrieve the filtered record(s) withing the specified count range", async (done) => {
    const res = await request.post("/").send({
      startDate: "2016-12-21",
      endDate: "2018-02-02",
      minCount: 110,
      maxCount: 116,
    });
    const retrievedRecord = res.body.records[0];
    expect(retrievedRecord.totalCount >= 110).toBeTruthy();
    expect(retrievedRecord.totalCount <= 116).toBeTruthy();
    done();
  });

  it("Should retrieve the filtered record(s) withing the specified time range", async (done) => {
    const res = await request.post("/").send({
      startDate: "2016-12-21",
      endDate: "2018-02-02",
      minCount: 110,
      maxCount: 116,
    });
    const retrievedRecord = res.body.records[0];
    expect(
      new Date(retrievedRecord.createdAt) >= new Date("2016-12-21")
    ).toBeTruthy();
    expect(
      new Date(retrievedRecord.createdAt) <= new Date("2018-02-02")
    ).toBeTruthy();
    done();
  });
});

describe("Record /Post wrong request parameters suite", function () {
  it("Should return the right error message for missing startDate", async (done) => {
    const res = await request.post("/").send({
      endDate: "2018-02-02",
      minCount: 110,
      maxCount: 116,
    });
    expect(res.body.records.length == 0).toBeTruthy();
    expect(res.body.msg == Messages.MissingStartDate).toBeTruthy();

    done();
  });

  it("Should return the right error message for missing endDate", async (done) => {
    const res = await request.post("/").send({
      startDate: "2018-02-02",
      minCount: 110,
      maxCount: 116,
    });
    expect(res.body.records.length == 0).toBeTruthy();
    expect(res.body.msg == Messages.MissingEndDate).toBeTruthy();
    done();
  });

  it("Should return the right error message for wrong startDate format", async (done) => {
    const res = await request.post("/").send({
      startDate: "2016/12/21",
      endDate: "2018-02-02",
      minCount: 110,
      maxCount: 116,
    });
    expect(res.body.records.length == 0).toBeTruthy();
    expect(res.body.msg == Messages.InvalidDateFormatStartDate).toBeTruthy();
    done();
  });

  it("Should return the right error message for wrong endDate format", async (done) => {
    const res = await request.post("/").send({
      startDate: "2016-12-21",
      endDate: "2018/02/02",
      minCount: 110,
      maxCount: 116,
    });
    expect(res.body.records.length == 0).toBeTruthy();
    expect(res.body.msg == Messages.InvalidDateFormatEndDate).toBeTruthy();
    done();
  });
  it("Should return the right error message for missing minCount", async (done) => {
    const res = await request.post("/").send({
      startDate: "2016-12-21",
      endDate: "2018-02-02",
      maxCount: 116,
    });
    expect(res.body.records.length == 0).toBeTruthy();
    expect(res.body.msg == Messages.MissingMinCount).toBeTruthy();
    done();
  });

  it("Should return the right error message for missing maxCount", async (done) => {
    const res = await request.post("/").send({
      startDate: "2016-12-21",
      endDate: "2018-02-02",
      minCount: 116,
    });
    expect(res.body.records.length == 0).toBeTruthy();
    expect(res.body.msg == Messages.MissingMaxCount).toBeTruthy();
    done();
  });

  it("Should return the right error message for wrong minCount format", async (done) => {
    const res = await request.post("/").send({
      startDate: "2016-12-21",
      endDate: "2018-02-02",
      minCount: "110",
      maxCount: 116,
    });
    expect(res.body.records.length == 0).toBeTruthy();
    expect(res.body.msg == Messages.InvalidMinCountType).toBeTruthy();
    done();
  });

  it("Should return the right error message for wrong maxCount format", async (done) => {
    const res = await request.post("/").send({
      startDate: "2016-12-21",
      endDate: "2018-02-02",
      minCount: 110,
      maxCount: "116",
    });
    expect(res.body.records.length == 0).toBeTruthy();
    expect(res.body.msg == Messages.InvalidMaxCountType).toBeTruthy();
    done();
  });
});
