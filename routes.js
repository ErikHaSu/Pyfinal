var express = require('express');
var passport = require('passport');
var User = require("./models/user");
//var user = require("./models/user");
var card = require("./models/card");
var acl = require('express-acl');
var fs = require("fs.extra");
var router = express.Router();

router.use((req,res,next) => {
    res.locals.currentUser = req.user;
    res.locals.currentcard = req.card;
    res.locals.errors = req.flash('error');
    res.locals.infos = req.flash('info');
    if (req.user){
        req.session.role = req.user.role;
    }else{
        req.session.role = 'user';
    }
    console.log(req.session);
    next();
});

acl.config({
    baseUrl:'/',
    defaultRole:'user',
    decodedObjectName:'user',
    roleSearchPath:'user.role'
});


router.use(acl.authorize);

router.get('/',(req,res,next) => {
    card.find()
    .exec((err,card) =>{
        if(err){
            return next(err);
        }
        res.render('index',{card:card});
    });
});
router.get("/card/:name_card",(req,res,next) => {
    card.findOne({name_card:req.params.name_card},(err,card) =>{
        if(err){
            return next(err);
        }
        if(!card){
            return next(404);
        }
        res.render("card",{card:card});
    });
});

router.get('/signup',(req,res) => {
    res.render('signup');
});

router.post('/signup',(req,res,next) =>{
    var username = req.body.username;
    var password = req.body.password;
    var role = req.body.role;

    User.findOne({username:username},(err,user)=>{
        if(err){
            return next(err);
        }
        if(user){
            req.flash("error","El nombre de usuario ya existe");
            return res.redirect("/signup");
        }
        var newUser = new User({
            username:username,
            password:password,
            role:role
        });
        newUser.save(next);
        return res.redirect("/")
    });
});

router.get("/login",(req,res)=> {
    res.render("login");
});
router.post("/login",passport.authenticate("login",{
    successRedirect:"/",
    failureRedirect:"/login",
    failureFlash:true 
}));
router.get("/logOut",(req,res) => {
    req.logOut();
    res.redirect("/");
    
});

router.get("/edit",ensureAuthenticated,(req,res)=> {
res.render("edit");
});

router.post("/edit",ensureAuthenticated,(req,res,next)=>{
    req.user.displayName = req.body.displayName;
    req.user.bio = req.body.bio;
    req.user.favoriteTCG = req.body.favoriteTCG;
    req.user.save((err)=>{
        if(err){
            next(err);
            return;
        }
        req.flash("info","Perfil Actualizado");
        res.redirect("/edit");
    });
});


function ensureAuthenticated(req,res,next){
    if(req.isAuthenticated()){
        next();
    }else{
        req.flash("info","necesitas iniciar sesion para acceder a esta zona");
        res.redirect("/login");
    }
}

router.get('/add-card',(req,res,next) => {
    card.find()
    .sort({createdat:'descending'})
    .exec((err,card) =>{
        if(err){
            return next(err);
        }
        res.render('add-card',{card:card});
    });
});

router.post('/add-card',function(req,res){
    console.log(req.files.archivo);
    var extension = req.files.archivo.name.split(".").pop();
    var data = {
        name_card: req.body.name_card,
        description: req.body.description,
        whatTCG: req.body.description,
        creator: res.locals.user,
        extension:extension
    }
    var imagen = new card(data);
    imagen.save(function(err){
        if(!err){
            fs.copy(req.files.archivo.path,"public/images/"+imagen._id+"."+extension);
            res.redirect("/");
        }else{
            console.log(imagen);
            res.render(err);
        }

    });
});


module.exports = router;