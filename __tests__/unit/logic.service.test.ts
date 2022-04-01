import request from "supertest";
import { app, cacheClient } from "../../src/index";

const supertest = request.agent(app.listen());

describe("Tests", () => {
  beforeEach(() => {});

  afterAll(() => {
    app.terminate();
  });

  describe("Health Check", () => {
    it("Should Return Body of UP and status 200", async () => {
      const res = await supertest
        .get("/")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");
      const data = res.body;
      console.log(data);
      expect(res.status).toEqual(200);
    });
  });

  describe("Inbound SMS", () => {
    it("No Authorization", async () => {
      const res = await supertest
        .post("/inbound/sms")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");
      const data = res.body;
      const { message, error } = data;
      expect(res.status).toEqual(403);
      expect(message).toEqual("");
      expect(error).toEqual("Unauthorized");
    });

    it("No Authorization 2", async () => {
      const res = await supertest
        .post("/inbound/sms")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .auth("", "");
      const data = res.body;
      const { message, error } = data;
      expect(res.status).toEqual(403);
      expect(message).toEqual("");
      expect(error).toEqual("Unauthorized");
    });

    it("Invalid Method", async () => {
      const res = await supertest
        .get("/inbound/sms")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json");
      expect(res.status).toEqual(405);
    });

    it("Incorrect Authorization", async () => {
      const res = await supertest
        .post("/inbound/sms")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .auth("judex", "123456");
      const data = res.body;
      const { message, error } = data;
      expect(res.status).toEqual(403);
      expect(message).toEqual("");
      expect(error).toEqual("Unauthorized");
    });

    it("No Body", async () => {
      const res = await supertest
        .post("/inbound/sms")
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .auth("azr1", "20S0KPNOIM");
      const data = res.body;
      const { message, error } = data;
      expect(res.status).toEqual(400);
      expect(message).toEqual("");
      expect(error).toEqual("from is missing");
    });

    it("Invalid Body (ommitted to)", async () => {
      const res = await supertest
        .post("/inbound/sms")
        .send({
          from: "4924195509198",
          text: "STOP",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .auth("azr1", "20S0KPNOIM");
      const data = res.body;
      const { message, error } = data;
      expect(res.status).toEqual(400);
      expect(message).toEqual("");
      expect(error).toEqual("to is missing");
    });

    it("Invalid Body (to more than 16 characters)", async () => {
      const res = await supertest
        .post("/inbound/sms")
        .send({
          from: "4924195509198",
          to: "44122445954888889",
          text: "STOP",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .auth("azr1", "20S0KPNOIM");
      const data = res.body;
      const { message, error } = data;
      expect(res.status).toEqual(400);
      expect(message).toEqual("");
      expect(error).toEqual("to is invalid");
    });

    it("Invalid Body (from more than 16 characters)", async () => {
      const res = await supertest
        .post("/inbound/sms")
        .send({
          from: "4924195509198149429",
          to: "441224459548",
          text: "STOP",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .auth("azr1", "20S0KPNOIM");
      const data = res.body;
      const { message, error } = data;
      expect(res.status).toEqual(400);
      expect(message).toEqual("");
      expect(error).toEqual("from is invalid");
    });

    it("Invalid Body (ommitted test)", async () => {
      const res = await supertest
        .post("/inbound/sms")
        .send({
          from: "4924195509198",
          to: "441224459548",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .auth("azr1", "20S0KPNOIM");
      const data = res.body;
      const { message, error } = data;
      expect(res.status).toEqual(400);
      expect(message).toEqual("");
      expect(error).toEqual("text is missing");
    });

    it("Invalid Body (text more than 120 characters)", async () => {
      const res = await supertest
        .post("/inbound/sms")
        .send({
          from: "4924195509198",
          to: "441224459548",
          text: "I am Jude, I am just trying to exceed this limit and be sure it throws the correct error, so I got to make this text really long. Here goes!",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .auth("azr1", "20S0KPNOIM");
      const data = res.body;
      const { message, error } = data;
      expect(res.status).toEqual(400);
      expect(message).toEqual("");
      expect(error).toEqual("text is invalid");
    });

    it("Wrong Account", async () => {
      const res = await supertest
        .post("/inbound/sms")
        .send({
          from: "441224459598",
          to: "441224459548",
          text: "STOP\n",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .auth("azr1", "20S0KPNOIM");
      const data = res.body;
      const { message, error } = data;
      await cacheClient.deleteKey("441224459598");
      await cacheClient.deleteKey("441224459598-441224459548");
      expect(res.status).toEqual(400);
      expect(message).toEqual("");
      expect(error).toEqual("to parameter not found");
    });

    it("Successful Inbound", async () => {
      const res = await supertest
        .post("/inbound/sms")
        .send({
          from: "441224980099",
          to: "441224980100",
          text: "STOP\n",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .auth("azr1", "20S0KPNOIM");
      const data = res.body;
      const { message, error } = data;
      await cacheClient.deleteKey("441224980099");
      await cacheClient.deleteKey("441224980099-441224980100");
      expect(res.status).toEqual(201);
      expect(message).toEqual("inbound sms ok");
      expect(error).toEqual("");
    });
  });

  describe("Outbound SMS", () => {
    it("From Parameter Not Found", async () => {
      const res = await supertest
        .post("/outbound/sms")
        .send({
          from: "4924195509198156",
          to: "441224459508",
          text: "STOP\n",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .auth("azr1", "20S0KPNOIM");
      const data = res.body;
      const { message, error } = data;
      expect(res.status).toEqual(422);
      expect(message).toEqual("");
      expect(error).toEqual("from parameter not found");
    });

    it("Blocked Outbound", async () => {
      const cacheKey = "3253280329-3253280313";
      await cacheClient.setKey(cacheKey, "inbound", "EX", 4 * 60 * 60);
      const res = await supertest
        .post("/outbound/sms")
        .send({
          from: "3253280329",
          to: "3253280313",
          text: "STOP\n",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .auth("azr1", "20S0KPNOIM");
      await cacheClient.deleteKey(cacheKey);
      const data = res.body;
      const { message, error } = data;
      expect(res.status).toEqual(422);
      expect(message).toEqual("");
      expect(error).toEqual(
        "sms from 3253280329 to 3253280313 blocked by STOP request"
      );
    });

    it("Increase Count of from", async () => {
      const cacheKey = "4924195509195";
      await cacheClient.incrValue(cacheKey);
      const res = await supertest
        .post("/outbound/sms")
        .send({
          from: "4924195509197",
          to: "4924195509195",
          text: "STOP\n",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .auth("azr1", "20S0KPNOIM");
      await cacheClient.deleteKey(cacheKey);
      const data = res.body;
      const { message, error } = data;
      expect(res.status).toEqual(201);
      expect(message).toEqual("outbound sms ok");
      expect(error).toEqual("");
    });

    it("Limit Reached", async () => {
      const cacheKey = "4924195509192";
      await cacheClient.setKey(cacheKey, "51", "EX", 4 * 60 * 60);
      const res = await supertest
        .post("/outbound/sms")
        .send({
          from: "4924195509192",
          to: "4924195509194",
          text: "STOP\n",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .auth("azr1", "20S0KPNOIM");
      await cacheClient.deleteKey(cacheKey);
      const data = res.body;
      const { message, error } = data;
      expect(res.status).toEqual(422);
      expect(message).toEqual("");
      expect(error).toEqual("limit reached for from 4924195509192");
    });

    it("Successful Outbound", async () => {
      const res = await supertest
        .post("/outbound/sms")
        .send({
          from: "3253280312",
          to: "31297728125",
          text: "STOP\n",
        })
        .set("Content-Type", "application/json")
        .set("Accept", "application/json")
        .auth("azr1", "20S0KPNOIM");
      await cacheClient.deleteKey("3253280312");
      const data = res.body;
      const { message, error } = data;
      expect(res.status).toEqual(201);
      expect(message).toEqual("outbound sms ok");
      expect(error).toEqual("");
    });
  });
});
