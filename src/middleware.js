module.exports = {
    logRequest(req, res, next) {
        console.log('incoming request at ', new Date());
        next();
    },
    auth(req, res, next) {
        console.log('you can pass my auth');
        next();
    }
};