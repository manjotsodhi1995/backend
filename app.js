require('rootpath')();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('_helpers/error-handler');

function createApp() {
    const app = express();

    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cors());
    app.options('*', cors());

    // api routes
    app.use('/users', require('./users/users.controller'));
    app.use('/comment', require('./comments/comment.controller'));
    app.use('/todos', require('./todos/todos.controller'));

    // global error handler
    app.use(errorHandler);

    return app;
}

module.exports = createApp;

