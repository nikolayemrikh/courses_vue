var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var VKontakteStrategy = require('passport-vkontakte').Strategy;
//var IfmoSSOStrategy = require('passport-ifmosso').Strategy;
var config = require('nconf');
var profile = require('../../db/dao/user');
var logger = require('../../common/logger');

function checkRole(req, res, next, role) {
    if (req.isAuthenticated()) {
        if (!role || req.user.role >= role) next();
        else res.status(403).end();
    }
    else {
        res.status(401).end();
    }
}

router.isAuth = function(req, res, next) {
    checkRole(req, res, next);
};
router.isStudent = function(req, res, next) {
    checkRole(req, res, next, 1);
};
router.isInspector = function(req, res, next) {
    checkRole(req, res, next, 2);
};
router.isAdministrator = function(req, res, next) {
    checkRole(req, res, next, 3);
};
router.isMyself = function(req, res, next) {
    if (req.params.userId === req.user._id) next();
    else res.status(403).end();
};
router.logUserIP = function(req, res, next) {
    if (req.isAuthenticated()) {
        logger.info('User "' + req.user.username + '" logged in from IP ' + req.ip);
    }
    next();
};

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    done(null, user);
});

// Local strategy
// Авторизация
passport.use('local', new LocalStrategy(profile.auth.local));
router.post('/', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) return res.status(500).send(err);
    if (!user) return res.status(404).send(err);
    req.logIn(user, function(err) {
      if (err) return res.status(500).send(err);
      return res.status(200).send(user);
    });
  })(req, res, next);
}, router.logUserIP);

passport.use('vk', new VKontakteStrategy({
        clientID: config.get('auth:vk:clientID'), // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId' 
        clientSecret: config.get('auth:vk:clientSecret'),
        callbackURL: config.get('auth:vk:callbackURL')
    },
    function(accessToken, refreshToken, params, data, done) {
        // console.log(params.email); // getting the email 
        try {
            console.log(data)
            profile.auth.vk(data, done);
        }
        catch (e) {
            done(e);
        }
    }
));

router.get('/vk', passport.authenticate('vk'));
router.get('/vk/callback', passport.authenticate('vk', {
    failureRedirect: '/#login'
}), router.logUserIP, function(req, res, next) {
    res.redirect('/');
});

// Get user profile
router.get('/', function(req, res) {
    req.isAuthenticated() ? res.json(req.user) : res.status(401).end();
});
// User logout
router.delete('/:userId', function(req, res) {
    req.logout();
    res.json({});
});
// Get user profile by id
router.get('/:userId', router.isMyself, function(req, res) {
    var args = {
        userId: req.params.userId
    };
    profile.get(args, function(err, data) {
        if (!err && data) {
            res.json(data);
        }
        else {
            res.status(400).end();
        }
    });
});

// Update user profile and session by id
router.put('/:userId', router.isMyself, function(req, res) {
    var args = {
        userId: req.params.userId,
        data: req.body
    };
    profile.update(args, function(err, data) {
        if (!err && data) {
            /*req.login(data, function(error) {
                if (error) res.status(400).end();
                else res.json(data);
            });*/
            res.json(data);
        }
        else {
            res.status(400).end();
        }
    });
});

module.exports = router;
