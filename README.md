# A customer support ticketing system.

This App features _NodeJs_, _Express_, _Typescript_, and _MongoDB_.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Included Tooling](#included-tooling)
- [Installation](#installation)
- [Commands](#commands)
- [Database](#Database)
- [Deployment](#Deployment)

## Overview

This customer support ticketing system allows customers to be able to place support requests, get updates on their requests and support agents being able to process the request. Customer can create support requests, View the status of their previous requests and Comment on a support request after the support agent might have made comment on the support request.
It also allows Support agent to find and process support requests, update request status, and create initial comment on support requests.

### Tech Stack

- [NodeJs](https://nodejs.org/)
- [ExpressJs](https://expressjs.com/)
- [mongoDB](https://www.mongodb.com/)

### Included Tooling

- [Jest](https://jestjs.io/) - Test runner
- [TypeScript](https://www.typescriptlang.org/) - Type checking
- [ESLint](https://eslint.org/) - Code linting
- [Prettier](https://prettier.io/) - Code formatting
- [Heroku](https://support-req-app.herokuapp.com/)-

## Installation

```bash
git clone https://github.com/OmoladeAkingbade/Ticketing-App.git
```

- `cd` into the project directory and run `yarn`.
- Run `yarn dev` to start the development server.

## Commands

- `yarn dev` - Starts the development server.
- `yarn test` - Runs the unit tests.
- `yarn compile:watch` - Compiles code and watch for file changes.
- `yarn prod` - Starts the production server.
- `node dist/seed-data/seed.js` - creates seed data.

## Database

```Seed Data Files
    comments.json
    supportrequests.json
    users.json
```

## Deployment

- [Heroku Link](https://support-req-app.herokuapp.com/)
