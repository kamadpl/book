var MongoClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/booksdb';
var collection;

MongoClient.connect(url, function (err, db) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    else {
        console.log("Connected succesfully to server");
        collection = db.collection('books');
    }
});


var connectionPromise = MongoClient.connect(url, {bufferMaxEntries: 0});
var collectionPromise = connectionPromise.then(function(db){
    return db.collection('books');
});

module.exports = {
    stockUp: function (isbn, count){
        return collectionPromise.then(function(collection){
           return collection.updateOne({isbn}, {isbn, count}, {upsert: true});
        });
    },
    findAll: function () {
        return collectionPromise.then(function(collection) {
           var resultsPromise = collection.find({}).toArray();
           return resultsPromise;
       });
    }
}