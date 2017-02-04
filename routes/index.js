var api = require('./api');

module.exports = function(app) {
    // app.use('/api', auth.isAuth, api);
    app.use('/api', api);
};