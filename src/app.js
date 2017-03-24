var express = require('express');
var bodyParser = require('body-parser');
var errors = require('./errors');
var middleware = require('./middleware');

module.exports = function (stockRepository) {
    var app = express();

    app.use(middleware.logRequest);
    app.use(middleware.auth);
    app.use(bodyParser.json());

    var routes = require('./routes')(stockRepository);

    app.get('/', routes.ping);
    app.post('/stock', routes.stockUp);
    app.get('/stock', routes.findAll);
    app.get('/stock/:isbn', routes.getCount);


    app.use(errors.clientError);
    app.use(errors.serverError);

    return app;
};