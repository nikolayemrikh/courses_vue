require('./check-versions')()
var config = require('../config')
if (!process.env.NODE_ENV) process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV)
var path = require('path')
var express = require('express')
var webpack = require('webpack')
var opn = require('opn')
var proxyMiddleware = require('http-proxy-middleware')
var webpackConfig = process.env.NODE_ENV === 'testing'
  ? require('./webpack.prod.conf')
  : require('./webpack.dev.conf')

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.dev.port
// Define HTTP proxies to your custom API backend
// https://github.com/chimurai/http-proxy-middleware
var proxyTable = config.dev.proxyTable

var app = express()
var compiler = webpack(webpackConfig)

///// Добавил
var projConfig = require('nconf').file('./proj_config.json');

var morgan = require('morgan');
var logger = require('../common/logger');
app.use(morgan("short", {
    "stream": logger.stream
}));

var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var session = require('express-session');
app.use(cookieParser());
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

var db = require('../db');
var MongoStore = require('connect-mongo')(session);
var mongoStore = new MongoStore({
    mongooseConnection: db.mongoose.connection,
    ttl: projConfig.get("cookie:ttl") * 24 * 60 * 60 // days
});

app.use(session({
    name: 'vue_courses',
    secret: projConfig.get("cookie:secret"),
    store: mongoStore,
    proxy: true,
    resave: true,
    saveUninitialized: true,
    cookie: {
      session: false,
      maxAge: projConfig.get("cookie:ttl") * 24 * 60 * 60 * 1000 // days
    }
}));

app.use(passport.initialize());
app.use(passport.session());
require('../routes')(app);

/////

var devMiddleware = require('webpack-dev-middleware')(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true
})

var hotMiddleware = require('webpack-hot-middleware')(compiler)
// force page reload when html-webpack-plugin template changes
compiler.plugin('compilation', function (compilation) {
  compilation.plugin('html-webpack-plugin-after-emit', function (data, cb) {
    hotMiddleware.publish({ action: 'reload' })
    cb()
  })
})

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context]
  if (typeof options === 'string') {
    options = { target: options }
  }
  app.use(proxyMiddleware(context, options))
})

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

// serve webpack bundle output
app.use(devMiddleware)

// enable hot-reload and state-preserving
// compilation error display
app.use(hotMiddleware)

const allowedExtension = ['.png', '.jpg', '.jpeg', '.gif', '.svg'];
// serve pure static assets
var staticPath = path.posix.join(config.dev.assetsPublicPath, config.dev.assetsSubDirectory)
app.use(staticPath, function(req, res, next) {
  const urlPath = path.extname(req.path);
  if (allowedExtension.includes(urlPath)) next();
  else res.status(404).end();
}, express.static('./static'))

var uri = 'http://localhost:' + port

devMiddleware.waitUntilValid(function () {
  console.log('> Listening at ' + uri + '\n')
})

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }

  // when env is testing, don't need open it
  if (process.env.NODE_ENV !== 'testing') {
    opn(uri)
  }
})
