const express = require("express");
const router = express.Router();

const ExpressError = require("../expressError")

const db = require("../db");


router.get('/', async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM industries`);
        const comp_results = await db.query(`SELECT * FROM associates`);

        let industries = [];
        for (let i = 0; i< results.rows.length; i++){
            let industry = [];
            let {code, name} = results.rows[i];
            let companies =[];
            for (let j = 0; j< comp_results.rows.length; j++){
                if (comp_results.rows[j].ind_code === code){
                    companies.push(comp_results.rows[j].comp_code);
                }
            }
            industry = {
                code: code,
                name: name,
                companies: companies
            };
            industries.push(industry);
        }
        
        return res.json({industries: industries});
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