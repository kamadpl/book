var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/booksdb';

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
    var isbn = req.body.isbn;
    var count = req.body.count;
    
    MongoClient.connect(url, function (err, db) {
        if(err) console.log(err);
        db.collection('books').updateOne({isbn: isbn}, {isbn: isbn, count: count}, {upsert: true});
        console.log("Connected successfully to server");
    });
    
    res.json({
        isbn: req.body.isbn,
        count: req.body.count
    });
});

app.get('/stock', function (req, res, next) {
    var isbn = req.body.isbn;
    var count = req.body.count;
    
    MongoClient.connect(url, function (err, db) {
        if(err) console.log(err);
        db.collection('books').find({}).toArray(function(err, results){
            res.json(results);
        });
        console.log("Connected successfully to server");
    });
});

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