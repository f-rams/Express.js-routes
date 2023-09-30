const express = require('express');
const router = express.Router();
const db = require('../db');
const slugify = require('slugify');

router.get('/', async (req, res, next) => {
  const results = await db.query(`SELECT * FROM invoices`);
  return res.json({ invoices: results.rows });
});

router.get('/:id', async (req, res, next) => {
  const id = req.params.id;
  const results = await db.query(
    'SELECT * FROM invoices INNER JOIN companies ON (invoices.comp_code = companies.code) WHERE id=$1',
    [+id]
  );
  if (!results.rows[0]) {
    return res.status(404).send('Data is not in the database');
  }
  const data = results.rows[0];
  const invoice = {
    id: data.id,
    amt: data.amt,
    paid: data.paid,
    add_date: data.add_date,
    paid_date: data.paid_date,
    company: {
      code: data.comp_code,
      name: data.name,
      description: data.description,
    },
  };

  return res.json({ invoice: invoice });
});

router.get('/companies/:code', async (req, res, next) => {
  const codeParam = req.params.code;
  const results = await db.query(
    'SELECT * FROM companies INNER JOIN invoices ON (invoices.comp_code = companies.code) WHERE code=$1',
    [codeParam]
  );
  if (!results.rows[0]) {
    return res.status(404).send('Data is not in the database');
  }
  const { code, name, description } = results.rows[0];
  const rows = results.rows;
  const invoices = rows.map((value) => {
    return {
      id: value.id,
      amt: value.amt,
      paid: value.paid,
      add_date: value.add_date,
      paid_date: value.paid_date,
    };
  });
  const company = {
    code,
    name,
    description,
    invoices,
  };
  return res.json({ company: company });
});

router.post('/', async (req, res, next) => {
  const { comp_code, amt } = req.body;
  try {
    const results = await db.query(
      `INSERT INTO invoices (comp_code, amt) 
  VALUES ($1, $2)
  RETURNING id, comp_code, amt, paid, add_date, paid_date`,
      [comp_code, amt]
    );
    return res.status(201).json({ invoice: results.rows[0] });
  } catch {
    return res.status(404).send('Data is not in the database');
  }
});

router.put('/:id', async (req, res, next) => {
  const { amt, paid } = req.body;
  let paid_date;
  if (paid) {
    paid_date = new Date();
  } else {
    paid_date = null;
  }
  const id = req.params.id;
  const results = await db.query(
    `UPDATE invoices SET amt=$1, paid=$2, paid_date=$3 WHERE id=$4
    RETURNING id, comp_code, amt, paid, add_date, paid_date`,
    [amt, paid, paid_date, +id]
  );
  if (!results.rows[0]) {
    return res.status(404).send('Data is not in the database');
  }

  return res.status(201).json({ invoice: results.rows[0] });
});

router.delete('/:id', async (req, res, next) => {
  const id = req.params.id;
  const idQuery = await db.query('SELECT id FROM invoices');
  const idMap = idQuery.rows.map(({ id }) => {
    return id;
  });
  if (!idMap.includes(+id)) {
    return res.status(404).send('Data is not in the database');
  }
  const results = await db.query(`DELETE FROM invoices WHERE id=$1`, [id]);
  return res.send({ status: 'deleted' });
});

module.exports = router;
