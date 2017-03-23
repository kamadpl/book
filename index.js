var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var repo = require('./repository');

function logRequest(req, res, next) {
    console.log('incoming request at ', new Date());
    next();
}
function auth(req, res, next) {
    console.log('you can pass my auth');
    next();
}


// middleware - cross cutting concerns
app.use(logRequest);
app.use(auth);
app.use(bodyParser.json());


// handler/routes
app.get('/', function (req, res) {
    res.send('Hello World!');
});

app.post('/stock', function (req, res, next) {
    repo
        .stockUp(req.body.isbn, req.body.count)
        .then(function(){
            res.json({
                isbn: req.body.isbn,
                count: req.body.count
            });
        });
});
var collection;
app.get('/stock', function (req, res, next) {
    repo
        .findAll(collection)
        .then(function(results) {
            res.json(results);
        }).catch(next);
});
// fn next powoduje przejscie do kolejnego nexta gdzie szuka obslugi erora ktory tu wystapil

app.get('/error', function (req, res) {
    throw new Error('forced error');
});


// error handling
app.use(clientError);
app.use(serverError);

function clientError(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
}

function serverError(err, req, res, next) {
    var status = err.status || 500;
    res.status(status);
    console.error(err.stack);
    res.send('Oh no: ' + status);
}

module.exports = app;