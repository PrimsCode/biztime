process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
const db = require("../db");

//set up database

beforeEach(async () => {
    const result = await db.query(
        `INSERT INTO invoices (comp_code, amt) 
        VALUES ('ibm', 900) 
        RETURNING *`);
    testInvoice = result.rows[0];
})

afterAll(async () => {
  await db.end();  
})

//tests
describe("GET /invoices", () => {
    test("Get all data from invoices table", async () => {
        const res = await request(app).get("/invoices");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({invoices: testInvoice});
    })
})

describe("GET /invoices/:id", () => {
    test("Get a specific data of one invoice and company info", async () => {
        const res = await request(app).get("/invoices/1");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({company: [testCompany], invoices: []});
    })
})

describe("POST /invoices", () => {
    test("Create a new invoice", async () => {
        const res = await request(app).post("/invoices")
        .send({comp_code: "apple", amt: 120});;

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({invoice: res.rows});
    })
})

describe("PUT /invoices/:id", () => {
    test("Update an existing invoice", async () => {
        const res = await request(app).put("/invoices/1")
        .send({amt: 1000});

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({invoice: res.rows});
    })
})

describe("DELETE /invoices/:id", () => {
    test("Delete a specific invoice", async () => {
        const res = await request(app).delete("/invoices/1");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({message: "Deleted"});
    })
})