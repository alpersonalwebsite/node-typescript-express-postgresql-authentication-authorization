# Node, TS, Express, PostgreSQL, Authentication and Authorization with jsonwebtoken

## Overview

This is an easy, basic and raw example of **HOW to** implement an API with Node, TS, Express and PostgreSQL to **authenticate and authorize with jsonwebtoken**.

## Requirements

* Node 12+
* NPM
* PostgreSQL
* db-migrate package as a global dependency

Note: Other libraries will be installed as part of the project with `npm install`

## Prerequisites

### Create .env file
Create at the root level of the project a `.env` file following the structure of `.env-sample`

### Update database.json
Update the file `database.json` with the proper information.

## Install dependencies

```shell
npm install
```

## DB

### Create databases 

```shell
createdb test_db
createdb test_db_test
```

### Run migrations

```shell
npm run migrate:up
```

## Running the server

### Development

```shell
npm run dev
```

### Production

```shell
npm run build

npm start
```

## Run unit tests

```shell
npm test
```

## Linting

```shell
npm run lint
```

## A note about ERROR handling

If the error occurs at the `controller layer` (or the logic inside the model), I throw the error passing the error object to the express handler function.

node-typescript-express-postgresql-authentication-authorization/src/models/user.ts
```ts
throw new Error(`Cannot get users, ${err}`);
```

If the error occurs at the `handler function`...

1. If the error happens due to throwing an error in the controller (or model logic) I return:
`res.status(500).json({ message: 'Something went wrong!' });`
Why I decided to not pass the error to the client? For security concerns and because the client should just care about its interaction with the API, not with the underlying servers (for example, the database).

2. For other errors, aka, errors directly related to the express handler, like `bad request`, `not found` we respond with the proper statusCode and message.

---

## Kudos

* Extended version of Udacity's JSFSN User Project