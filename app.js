var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var routes = require('./routes');
var passportsetup = require ("./passportsetup");
var app = express();
var formidabe = require("express-form-data");
var favicon = require('serve-favicon');

mongoose.connect('mongodb://Erik:floresW1@ds221242.mlab.com:21242/py-final');

passportsetup();
app.set('port', process.env.PORT || 3000);

app.set('views',path.resolve(__dirname,'views'));

app.use(express.static(path.resolve(__dirname,'public')));

app.use(favicon(path.join(__dirname,'public','images','favicon.ico')));

app.set('view engine',"ejs");

app.use(formidabe.parse({ keepExtensions:true }));

app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieParser());
app.use(session({
    secret:"ALOLF#$#",
    resave:true,
    saveUninitialized:true
}));
app.use(flash());

app.use(passport.initialize({
    userProperty:"user"
}));

app.use(passport.session());

app.use(routes);

app.listen(app.get("port"),() =>{
    console.log("la aplicacion inicio por el puerto"+app.get("port"));
});
