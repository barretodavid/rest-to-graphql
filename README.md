# REST API to GraphQL Example

This code is an example of how to migrate a traditional REST API to GraphQL using the API of [jsonplaceholder](https://jsonplaceholder.typicode.com) as a reference.

## Requirements

- Node 7.6+
- MongoDB
- Yarn

## Installation

Make sure to have mongodb [installed]((https://docs.mongodb.com/manual/installation/)).

To start the mongodb server run:

```
$ mongod
```

After clonning the project run:

```
$ yarn install // install project dependencies
$ yarn build   // transpile code from typescript to js (ES6)
$ yarn loader  // populate mongodb with data from jsonplaceholder API
$ yarn start   // start koa server with graphql
```

An express server will be up and running in the port 3000.

Open your browser and go to[http://localhost:3000/graphql]() to start playing with the graphiql GUI

## Development

If you want to modify the code, open a new terminal window and run the typescript transpiler in watch mode:

```
$ yarn build:watch
```