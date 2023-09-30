const express = require('express');
const router = express.Router();
const db = require('../db');
const slugify = require('slugify');

router.get('/', async (req, res, next) => {
  const results = await db.query(`SELECT * FROM companies`);
  return res.json({ companies: results.rows });
});

router.get('/:code', async (req, res, next) => {
  const code = req.params.code;
  const results = await db.query('SELECT * FROM companies WHERE code=$1', [
    code,
  ]);
  if (!results.rows[0]) {
    return res.status(404).send('Data is not in the database');
  }

  return res.json({ company: results.rows[0] });
});

router.post('/', async (req, res, next) => {
  const { code, name, description } = req.body;
  const slugcode = slugify(code, {
    lower: true,
    remove: /[*+~.()'"!/:@]/g,
    replacement: '',
  });
  const results = await db.query(
    `INSERT INTO companies (code, name, description) 
  VALUES ($1, $2, $3)
  RETURNING code, name, description`,
    [slugcode, name, description]
  );
  return res.status(201).json(results.rows[0]);
});

router.put('/:code', async (req, res, next) => {
  const { name, description } = req.body;
  const code = req.params.code;

  const results = await db.query(
    `UPDATE companies SET name=$1, description=$2 WHERE code=$3
    RETURNING code, name, description`,
    [name, description, code]
  );
  if (!results.rows[0]) {
    return res.status(404).send('Data is not in the database');
  }
  return res.status(201).json(results.rows[0]);
});

router.delete('/:code', async (req, res, next) => {
  const code = req.params.code;
  const codesQuery = await db.query('SELECT code FROM companies');
  const codesMap = codesQuery.rows.map(({ code }) => {
    return code;
  });
  const results = await db.query(`DELETE FROM companies WHERE code=$1`, [code]);
  if (!codesMap.includes(code)) {
    return res.status(404).send('Data is not in the database');
  }
  return res.send({ status: 'deleted' });
});

module.exports = router;
