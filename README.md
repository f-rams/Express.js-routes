# Node.js-routes

A practice exercise to explore all the funcionalities that Node.js and Express.js regarding HTTP Requests and RESTful API building.

## TeckStack

This aplications was developed with the support of the following tools: JavaScript, [Node.js](https://nodejs.org/en); [Express.js](https://expressjs.com), [Slufigy](https://www.npmjs.com/package/slugify), [Node-Postgres/PG](https://www.npmjs.com/package/pg), [PostgreSQL](https://www.postgresql.org)

## Seeding the database

After installing psql, from the express-biztime directory, run the following command to create and populate the database:

```shell
$ psql < data.sql
```

## Companies Requests

### GET /companies

- Returns list of companies, like {companies: [{code, name}, ...]}

### GET /companies/code

- Return obj of company: {company: {code, name, description}}

- POST /companies
  Adds a company. Needs to be given JSON like: {code, name, description}

Returns obj of new company: {company: {code, name, description}}

- PUT /companies/code
  Edit existing company. Needs to be given JSON like: {name, description}

Returns update company object: {company: {code, name, description}}

- DELETE /companies/code
  Deletes company.

Returns {status: "deleted"}

## Invoices Requests

- GET /invoices
  Return info on invoices: like {invoices: [{id, comp_code}, ...]}

- GET /invoices/id
  Returns obj on given invoice.
  Returns {invoice: {id, amt, paid, add_date, paid_date, company: {code, name, description}}}

- POST /invoices
  Adds an invoice. Needs to be passed in JSON body of: {comp_code, amt}

Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}

- PUT /invoices/id
  Updates an invoice. Needs to be passed in a JSON body of {amt, paid}

  If paying unpaid invoice: sets paid_date to today. If un-paying: sets paid_date to null. Else: keep current paid_date

  Returns: {invoice: {id, comp_code, amt, paid, add_date, paid_date}}

- DELETE /invoices/id
  Deletes an invoice.

Returns: {status: "deleted"}

- GET /invoices/companies/code
  Return obj of company: {company: {code, name, description, invoices: [id, ...]}}

## Industries Requests

- GET /industries
  Returns obj on industries: like {industries: ...}

- GET /industries/code
  Returns obj on given industry.
  Returns {industry: {....}}

- GET /industries/companies/code
  JOIN TABLE query between companies and industries
