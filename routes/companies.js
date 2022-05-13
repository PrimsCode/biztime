const express = require("express");
const router = express.Router();

const ExpressError = require("../expressError")

const db = require("../db");


router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM companies`);
        return res.json({companies: results.rows});
    } catch (e) {
        return next(e);
    }    
})

router.get('/:code', async (req, res, next) => {
    try {
        const {code} = req.params;

        const compResult = await db.query(`SELECT * FROM companies WHERE code=$1`, [code]);
        const inResult = await db.query(`SELECT id FROM invoices WHERE comp_code=$1`, [code]);

        if (compResult.rows.length === 0) {
            throw new ExpressError ("Company not found", 404);
        } else {
            const company = compResult.rows;
            const inData = inResult.rows;

            let invoices = inData.map(inv => inv.id);

            return res.json({company, invoices: invoices});
        }
        
    } catch (e) {
        return next(e);
    }
})

router.post('/', async (req, res, next) => {
    try {
        const {code, name, description} = req.body;
        const result = await db.query(
            `INSERT INTO companies (code, name, description) 
            VALUES ($1, $2, $3) 
            RETURNING *`, [code, name, description]);
        return res.status(201).json({company: result.rows});
    } catch (e) {
        return next(e);
    }
})


router.put('/:code', async (req, res, next) => {
    try {
        const {name, description} = req.body;
        const {code} = req.params;

        const result = await db.query(
            `UPDATE companies 
            SET name=$1, description=$2 
            WHERE code=$3 
            RETURNING *`, [name, description, code])
        
        if (result.rows.length === 0) {
            throw new ExpressError ("Company not found", 404);
        } else {
            return res.json({company: result.rows});
        }
    } catch (e) {
        return next(e);
    }
})

router.delete('/:code', async (req, res, next) => {
    try {
        const {code} = req.params;

        const result = await db.query(`DELETE FROM companies WHERE code=$1`, [code]);

        if (result.rows.length === 0) {
            throw new ExpressError ("Company not found", 404);
        } else {
            return res.send({message: "Deleted"});
        }        
    } catch (e) {
        return next(e);
    }
})

module.exports = router;