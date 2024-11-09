const fs = require("fs");
const path = require("path");
const express = require("express");
const https = require('https');
const commandLineArgs = require("command-line-args");
const { ensureLoggedIn } = require('connect-ensure-login');
const Auth = require('./auth');
const Config = require("./config");
const _ = require("lodash");

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const argsDefinition = [{
    name: "env",
    alias: "e",
    type: String,
    defaultValue: "local"
}];

const options = commandLineArgs(argsDefinition);

let cfg = new Config(options.env);

function startHttp(port) {
    const app = new express();

    // remove redirect to HTTPS endpoint until proxy is created
    // if(_.lowerCase(options.env) === "dev") {
    app.use("/public/assets", express.static('build/js'));
    app.use("/public/img", express.static('src/images'));

    app.get('*',
        function (req, res) {
            fs.readFile(path.join(__dirname, '../src/index.html'), 'utf8', function (err, data) {
                if (err) {
                    return console.log(err);
                }
                let result = data.replace(/\${ENVIRONMENT}/g, options.env);

                res.send(result);
            });
        });
    // }
    // 

    app.listen(port, function () {
        console.log('listening on port ' + port);
    });
}

function startHttpsRedirectServer() {
    const app = new express();
    app.get('*', function (req, res) {
        res.redirect('https://' + req.headers.host.split(':')[0] + req.url);
    });

    app.listen(80, function () {
        console.log('listening on port ' + 80);
    });
}

function startHttps(sslPort) {
    const app = new express();
    const oAuth = new Auth(cfg);
    oAuth.configure(app);

    app.use("/public/assets", express.static('build/js'));
    app.use("/public/img", express.static('src/images'));

    app.get('*', ensureLoggedIn('/login'),
        function (req, res) {
            fs.readFile(path.join(__dirname, '../src/index.html'), 'utf8', function (err, data) {
                if (err) {
                    return console.log(err);
                }
                let result = data.replace(/\${ENVIRONMENT}/g, options.env);

                res.send(result);
            });
        });

    https.createServer({
        pfx: fs.readFileSync(path.join(__dirname, '../certs/' + cfg.getCertName())),
        passphrase: cfg.getCertToken()
    }, app).listen(sslPort, function () {
        console.log('listening on port ' + sslPort);
    });
}

startHttp(3500);
//startHttpsRedirectServer();
//startHttps(443);




