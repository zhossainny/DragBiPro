const session = require('express-session');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const Config = require("../config");

function auth(config){

    this.configure = function(app){

        const oAuthConfig = {
            state: true,
            tokenURL: config.getTpsTokenUrl(),
            authorizationURL: config.getTpsAuthUrl(),
            clientID: "deskdev",
            clientSecret: config.getClientToken(),
            callbackURL: config.getCallbackUrl(),
            passReqToCallback: true
        };

        app.use(session(  {secret: 'keyboard cat'}));
        app.use(passport.initialize());
        app.use(passport.session());

        const tokenToProfile = async (req, accessToken, refreshToken, params, profile, done) => {
            const user = {accessToken: accessToken};
            done(null, user);
        };

        passport.use(new OAuth2Strategy(oAuthConfig, tokenToProfile));

        passport.serializeUser(function(user, done) {
            done(null, user);
        });

        passport.deserializeUser(function(user, done) {
            done(null, user);
        });

        app.get('/login', this.login);
        app.get('/logout', this.logout);
    };

    this.login = function(req, res, next){

        passport.authenticate('oauth2', {
            session: true
        }, (err, user, info)=>{
            if(err){
                return next(err);
            }

            req.logIn(user, function(err) {
                if (err) { return next(err); }

                const redirectTo = req.session.redirectTo || '/';

                delete req.session.redirectTo;

                res.cookie(config.getTpsCookieName(), user.accessToken);

                return res.redirect(redirectTo);
            });
        })(req, res, next);
    };

    this.logout = function(req, res) {
        if(req.query !== {}  && req.query.location != null){
            let url = decodeURIComponent(req.query.location);
            req.session.destroy(() => res.redirect(url));
        }else{
            console.log("redirecting to ", "/");
            req.session.destroy(() => res.redirect('/'));
        }
    };
}

module.exports = auth;