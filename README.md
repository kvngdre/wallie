# Wallie

Wallie is a node API that grants wallet functionality to users. Users can sign up, deposit, withdraw and transfer funds. More features will be added over time.

## Getting Started

You are required to have installed [NodeJS](https://nodejs.org/en/download) on your machine.

### Database Setup

Ensure you have [MySQL](https://dev.mysql.com/downloads/mysql/) installed and the MongoDB database server is running.

Open a terminal window and run the command below to spin up [MySQL shell](https://dev.mysql.com/doc/mysql-shell/8.0/en/mysql-shell-interactive-code-execution.html).

```sh
mysql -u root -p
```

Next, enter the password for the root user (your user might be different, use that).

Create a new database for development, run:

```sh
# create development database
mysql> CREATE DATABASE e-wallet;
```

### App Setup

Clone the repo and install project dependencies:

```sh
npm install
```

Create a `.env` file in the root directory or you can use the `.env.example` file, it should contain these properties:

- DB_PORT=

- DEV_DB_HOST=
- DEV_DB_USER=
- DEV_DB_PASSWORD=
- DEV_DB_NAME=
- TEST_DB_NAME=

As well as the JSON web token details:

- JWT_ACCESS_KEY=
- JWT_ACCESS_EXP_TIME=
- JWT_ISSUER=
- JWT_AUDIENCE=

Next, run the migrations to create database tables:

```sh
npm run migrations
```

Seed the database to create dummy data:

```sh
npm run seed
```

You can go ahead and start the server:

```sh
npm run start:dev
```

Great!🚀 You should be ready to start making API calls. Verify the health of the API by hitting this [endpoint](http://localhost:4000/status).
<br></br>

> 💡 &nbsp; If you do not want to go through all those steps, you can skip that by using Docker. Please note you must have Docker installed and set up on your machine.
>
> To spin up the docker containers, run in the root directory:
>
> ```sh
> docker-compose up
> ```
>
> If successful, the API, MySQL database and database migrations should all have been created and taken care of, with the server running on port `4000`.

### Database structure

Every `transaction` belongs to an `account` and every `account` belongs to a `user`. See the ER diagram below for relationship mapping:

<p align="center" style="margin: 0"><img src="./src/images/schema pic.png" /><p align="center"><i>Entity Relationship Diagram</i></p></p>

<!-- ![database ER diagram](/images/schema%20pic.png)
_Entity Relationship Diagram_    -->

### Test Structure

With that complete, lets take a look at the current test structure. All tests live in the "test" directory in the root of the application. Test suite has been split into `unit` and `integration` tests.

To run the test suite:

```sh
npm test
```

To view the test coverage, open the `index.html` file in your browser located in the generated `coverage` folder in the root directory.

### Endpoints

All server endpoints can be found in the `src/routes` directory or view API documentation [here](https://documenter.getpostman.com/view/22366860/2s93CExwfx).

### TODO

Integration of a payment gateway such as Paystack to enable funds transfer outside of Wallie ecosystem.

### Feature Requests

You can suggest a feature by creating an issue and adding the label `request` to it.
