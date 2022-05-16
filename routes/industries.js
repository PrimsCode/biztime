const express = require("express");
const router = express.Router();

const ExpressError = require("../expressError")

const db = require("../db");


router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(
            `SELECT i.code, i.name, c.code AS comp_code 
            FROM industries AS i 
            LEFT JOIN associates AS a 
            ON i.code = a.ind_code 
            LEFT JOIN companies AS c 
            ON a.comp_code = c.code`);

        return res.json({industries: results.rows});
    } catch (e) {
        return next(e);
    }    
})


router.post('/', async (req, res, next) => {
    try {
        const {code, name} = req.body;
        const result = await db.query(
            `INSERT INTO industries (code, name) 
            VALUES ($1, $2) 
            RETURNING *`, [code, name]);
        return res.status(201).json({added: result.rows});
    } catch (e) {
        return next(e);
    }
})


router.post('/:ind_code', async (req, res, next) => {
    try {
        const {comp_code} = req.body;
        const {ind_code} = req.params;

        const result = await db.query(
            `INSERT INTO associates (comp_code, ind_code) 
            VALUES ($1, $2) 
            RETURNING *`, [comp_code, ind_code]);        
        if (result.rows.length === 0) {
            throw new ExpressError ("Industry/Company does not exist", 404);
        } else {
            return res.json({associated: result.rows});
        }
    } catch (e) {
        return next(e);
    }
})

module.exports = router;