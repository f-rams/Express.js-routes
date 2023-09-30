const express = require('express');
const router = express.Router();
const db = require('../db');
const slugify = require('slugify');

router.get('/', async (req, res, next) => {
  const results = await db.query(`SELECT * FROM industries`);
  return res.json({ industries: results.rows });
});

router.get('/:code', async (req, res, next) => {
  const code = req.params.code;
  const results = await db.query('SELECT * FROM industries WHERE code=$1', [
    code,
  ]);
  if (!results.rows[0]) {
    return res.status(404).send('Data is not in the database');
  }

  return res.json({ industry: results.rows[0] });
});

router.get('/companies/:code', async (req, res, next) => {
  const codeParam = req.params.code;
  try {
    const results = await db.query(
      'SELECT * FROM industries AS i LEFT JOIN industries_companies AS ic ON i.code = ic.industry_code LEFT JOIN companies AS c ON ic.company_code = c.code WHERE i.code=$1',
      [codeParam]
    );
    if (!results.rows[0]) {
      return res.status(404).send('Data is not in the database');
    }

    const { industry, industry_code } = results.rows[0];
    const companies = results.rows.map((value) => {
      return {
        name: value.name,
        code: value.company_code,
        description: value.description,
      };
    });

    return res.json({ results: industry, industry_code, companies });
  } catch (err) {
    return res.send(err);
  }
});

module.exports = router;
