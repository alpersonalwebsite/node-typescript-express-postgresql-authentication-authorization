# Node, TS, Express, PostgreSQL — Authentication & Authorization with JWT

A small, raw example of how to authenticate and authorize an Express + PostgreSQL
API using `jsonwebtoken`. Meant for learning: clone, run, read.

## Requirements

* Node 12+
* PostgreSQL
* `db-migrate` installed globally

## Setup

1. Install dependencies:

   ```shell
   npm install
   ```

2. Create a `.env` from `.env-sample`. Use the **same database names** in `.env`
   (`POSTGRES_DB` / `POSTGRES_TEST_DB`) and in `database.json` — the app reads
   `.env`, while migrations read `database.json`.

3. Create the databases and run migrations:

   ```shell
   createdb auth_dev
   createdb auth_test
   npm run migrate:up
   ```

## Run

```shell
# development (watch + rebuild)
npm run dev

# production
npm run build
npm start
```

## Test & lint

```shell
npm test
npm run lint
```

## Example requests

```shell
# create a user (returns a JWT)
curl -X POST localhost:3000/users \
  -H 'Content-Type: application/json' \
  -d '{"firstname":"Ada","lastname":"Lovelace","password":"secret"}'

# call a protected route with the token
curl localhost:3000/users -H "Authorization: Bearer <token>"
```

## Error handling

Models throw on failure; handlers translate that into a response. Expected
client errors (bad request, not found, unauthorized) return their status and a
message. Unexpected errors return a generic `500` so internal details (e.g. the
database) never leak to the client.

## Kudos

* Extended version of Udacity's JSFSN User project.
