process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
const db = require("../db");

let testCompany;

beforeEach(async () => {
    const result = await db.query(
        `INSERT INTO companies (code, name, description) 
        VALUES ('bmw', 'BMW', 'A German car company.') 
        RETURNING *`);
    testCompany = result.rows[0];
})

afterAll(async () => {
  await db.end();  
})

describe("GET /companies", () => {
    test("Get all data from companies table", async () => {
        const res = await request(app).get("/companies");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({companies: testCompany});
    })
})

describe("GET /companies/:code", () => {
    test("Get a specific data of one company and invoices", async () => {
        const res = await request(app).get("/companies/bmw");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({company: [testCompany], invoices: []});
    })
})

describe("POST /companies", () => {
    test("Create a new company", async () => {
        const res = await request(app).post("/companies")
        .send({code: "ford", name: "Ford", description: "American car company."});;

        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({company: res.rows});
    })
})

describe("PUT /companies/:code", () => {
    test("Update an existing company", async () => {
        const res = await request(app).put("/companies/bmw")
        .send({name: "Bmw", description: "A VERY German Car Company."});

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({company: {code: "bmw", name: "Bmw", description: "A VERY German Car Company."}});
    })
})

describe("DELETE /companies/:code", () => {
    test("Delete a specific company", async () => {
        const res = await request(app).delete("/companies/bmw");

        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({message: "Deleted"});
    })
})