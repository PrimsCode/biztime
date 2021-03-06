const express = require("express");
const router = express.Router();

const ExpressError = require("../expressError")

const db = require("../db");

router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM invoices`);
        return res.json({invoices: results.rows});
    } catch (e) {
        return next(e);
    }    
})

router.get('/:id', async (req, res, next) => {
    try {
        const {id} = req.params;        

        const results = await db.query(
            `SELECT i.id, i.comp_code, i.amt, i.paid, i.add_date, i.paid_date, c.name, c.description 
            FROM invoices AS i 
            INNER JOIN companies as c ON(i.comp_code = c.code) 
            WHERE id=$1`, [id]);

        if (results.rows.length === 0) {
            throw new ExpressError ("Invoice not found", 404);
        } else {
            data = results.rows[0];
            return res.json({invoice: {id: data.id, amt: data.amt, paid: data.paid, add_date: data.add_date, paid_date: data.paid_date, 
                company: {code: data.code, name: data.name, description: data.description}}});
        }
        
    } catch (e) {
        return next(e);
    }
})

router.post('/', async (req, res, next) => {
    try {
        const {comp_code, amt} = req.body;
        const result = await db.query(
            `INSERT INTO invoices (comp_code, amt) 
            VALUES ($1, $2) 
            RETURNING id, comp_code, amt, paid, add_date, paid_date`, [comp_code, amt]);
        return res.status(201).json({invoice: result.rows});
    } catch (e) {
        return next(e);
    }
})

router.put('/:id', async (req, res, next) => {
    try {
        const {amt} = req.body;
        const {id} = req.params;

        const result = await db.query(
            `UPDATE invoices 
            SET amt=$1 
            WHERE id=$2 
            RETURNING *`, [amt, id]);

        if (result.rows.length === 0) {
            throw new ExpressError ("Invoice not found", 404);
        } else {
            return res.json({invoice: result.rows});
        }
        
    } catch (e) {
        return next(e);
    }
})

router.delete('/:id', async (req, res, next) => {
    try {
        const {id} = req.params;
        
        const result = await db.query(`DELETE FROM invoices WHERE id=$1 RETURNING id`, [id]);

        if (result.rows.length === 0) {
            throw new ExpressError ("Invoice not found", 404);
        } else {
            return res.send({message: "Deleted"});
        }
        
    } catch (e) {
        return next(e);
    }
})


module.exports = router;